import 'server-only';



import { randomUUID } from 'node:crypto';

import { after } from 'next/server';

import { ObjectId } from 'mongodb';



import {

  COLLECTIONS,

  LEAD_COLLECTIONS,

  getDb,

  type LeadCollection,

} from './db';



import {

  adminEmail,

  userEmail,

  sheetFor,

} from './lead-content';



import { sendMail } from './mail';

import {

  upsertSheetRow,

  type SheetResult,

} from './sheets';



const TASKS = [

  'sheet',

  'adminMail',

  'userMail',

] as const;



type Task = (typeof TASKS)[number];



type Status =

  | 'pending'

  | 'running'

  | 'retry'

  | 'ok'

  | 'dead'

  | 'skipped';



const MAX_ATTEMPTS = 8;

const LEASE_MS = 120_000;



export type DeliveryInfo = {

  status: Status;

  attempts: number;

  nextAttemptAt?: Date;

  leaseUntil?: Date;

  leaseId?: string;

  error?: string | null;

  at?: Date;

  messageId?: string;

};



const pending = (): DeliveryInfo => ({

  status: 'pending',

  attempts: 0,

  nextAttemptAt: new Date(),

});



const skipped = (): DeliveryInfo => ({

  status: 'skipped',

  attempts: 0,

});



/* ======================================

   INITIAL DELIVERY STATUS

\====================================== */



export function initialDeliveries(

  collection: LeadCollection

) {

  const adminNotification =

    collection === COLLECTIONS.exhibitors ||

    collection === COLLECTIONS.visitors ||

    collection === COLLECTIONS.enquiries;



  const customerConfirmation =

    collection === COLLECTIONS.exhibitors ||

    collection === COLLECTIONS.visitors;



  return {

    sheet: pending(),



    adminMail: adminNotification

      ? pending()

      : skipped(),



    userMail: customerConfirmation

      ? pending()

      : skipped(),

  };

}



/* ======================================

   CLAIMABLE JOB FILTER

\====================================== */



function claimable(task: Task, now: Date) {

  const field = `deliveries.${task}`;



  return {

    $or: [

      {

        [`${field}.status`]: {

          $in: ['pending', 'retry'],

        },

        [`${field}.nextAttemptAt`]: {

          $lte: now,

        },

      },

      {

        [`${field}.status`]: 'running',

        [`${field}.leaseUntil`]: {

          $lte: now,

        },

      },

    ],

  };

}



function cappedError(error: unknown): string {

  const message =

    error instanceof Error

      ? error.message

      : String(error);



  return message.slice(0, 400);

}



/* ======================================

   PROCESS ONE DELIVERY TASK

\====================================== */



async function deliverTask(

  collection: LeadCollection,

  id: ObjectId,

  task: Task

): Promise<boolean> {

  const db = await getDb();

  const col = db.collection(collection);



  const now = new Date();

  const leaseId = randomUUID();

  const path = `deliveries.${task}`;



  // Atomically claim the delivery task.

  const doc = await col.findOneAndUpdate(

    {

      _id: id,

      ...claimable(task, now),

    },

    {

      $set: {

        [`${path}.status`]: 'running',

        [`${path}.leaseId`]: leaseId,

        [`${path}.leaseUntil`]: new Date(

          now.getTime() + LEASE_MS

        ),

      },

      $inc: {

        [`${path}.attempts`]: 1,

      },

    },

    {

      returnDocument: 'after',

    }

  );



  if (!doc) {

    return false;

  }



  const attempts = Number(

    doc.deliveries?.[task]?.attempts || 1

  );



  const finishedAt = new Date();



  try {

    let messageId: string | undefined;

    let sheetResult: SheetResult | undefined;



    if (task === 'sheet') {

      const mapping = sheetFor[collection];



      sheetResult = await upsertSheetRow(

        mapping.tab,

        mapping.row(doc)

      );



      if (!sheetResult.ok) {

        throw new Error(

          sheetResult.error ||

            'Google Sheets synchronization failed'

        );

      }

    } else {

      const content =

        task === 'adminMail'

          ? adminEmail(collection, doc)

          : userEmail(collection, doc);



      if (!content) {

        throw new Error(

          task === 'adminMail'

            ? 'Admin email recipients not configured'

            : 'Customer email template not available'

        );

      }



      const result = await sendMail(content);



      if (!result.ok) {

        throw new Error(

          result.error || 'SMTP email sending failed'

        );

      }



      messageId = result.messageId;

    }



    // Mark delivery successful.

    await col.updateOne(

      {

        _id: id,

        [`${path}.leaseId`]: leaseId,

      },

      {

        $set: {

          [`${path}.status`]: 'ok',

          [`${path}.at`]: new Date(),

          [`${path}.error`]: null,



          ...(messageId

            ? {

                [`${path}.messageId`]: messageId,

              }

            : {}),



          ...(sheetResult

            ? { sheet: sheetResult }

            : {}),

        },

        $unset: {

          [`${path}.nextAttemptAt`]: '',

          [`${path}.leaseUntil`]: '',

          [`${path}.leaseId`]: '',

        },

      }

    );



    return true;

  } catch (error) {

    const message = cappedError(error);

    const isDead = attempts >= MAX_ATTEMPTS;



    const backoffMs = Math.min(

      30 * 60_000,

      30_000 * 2 ** attempts

    );



    await col.updateOne(

      {

        _id: id,

        [`${path}.leaseId`]: leaseId,

      },

      {

        $set: {

          [`${path}.status`]: isDead

            ? 'dead'

            : 'retry',



          [`${path}.error`]: message,

          [`${path}.at`]: finishedAt,



          ...(isDead

            ? {}

            : {

                [`${path}.nextAttemptAt`]: new Date(

                  Date.now() + backoffMs

                ),

              }),



          ...(task === 'sheet'

            ? {

                sheet: {

                  ok: false,

                  at: finishedAt,

                  error: message,

                },

              }

            : {}),

        },



        $unset: {

          [`${path}.leaseUntil`]: '',

          [`${path}.leaseId`]: '',



          ...(isDead

            ? {

                [`${path}.nextAttemptAt`]: '',

              }

            : {}),

        },

      }

    );



    console.error(

      `[delivery] ${collection} ${String(id)} ` +

        `${task} attempt ${attempts}: ${message}`

    );



    return false;

  }

}



/* ======================================

   PROCESS EMAILS AND SHEETS

\====================================== */



export async function processLeadDeliveries(

  collection: LeadCollection,

  id: ObjectId

): Promise<void> {

  const results = await Promise.allSettled(

    TASKS.map((task) =>

      deliverTask(collection, id, task)

    )

  );



  for (const result of results) {

    if (result.status === 'rejected') {

      console.error(

        '[delivery] Unexpected task error:',

        result.reason

      );

    }

  }

}



/* ======================================

   SCHEDULE AFTER RESPONSE

\====================================== */



export function scheduleLeadDeliveries(

  collection: LeadCollection,

  id: ObjectId

): void {

  after(async () => {

    try {

      await processLeadDeliveries(collection, id);

    } catch (error) {

      console.error(

        '[delivery] Background delivery failed:',

        cappedError(error)

      );

    }

  });

}



/* ======================================

   RETRY PENDING JOBS

\====================================== */



export async function processPendingDeliveries(

  maxDocs = 40

) {

  const db = await getDb();



  const capped = Math.max(

    1,

    Math.min(maxDocs, 100)

  );



  let processed = 0;



  for (const collection of LEAD_COLLECTIONS) {

    const remaining = capped - processed;



    if (remaining <= 0) {

      break;

    }



    const now = new Date();

    const col = db.collection(collection);



    const docs = await col

      .find(

        {

          $or: TASKS.map((task) =>

            claimable(task, now)

          ),

        },

        {

          projection: {

            _id: 1,

          },

        }

      )

      .limit(Math.min(remaining, 15))

      .toArray();



    // Bounded concurrency.

    for (let i = 0; i < docs.length; i += 5) {

      await Promise.allSettled(

        docs

          .slice(i, i + 5)

          .map((doc) =>

            processLeadDeliveries(

              collection,

              doc._id

            )

          )

      );

    }



    processed += docs.length;

  }



  return {

    examined: processed,

  };

}



/* ======================================

   MANUAL SHEET RESYNC

\====================================== */



export async function syncToSheet(

  collection: string,

  id: ObjectId

): Promise<SheetResult | undefined> {

  if (

    !LEAD_COLLECTIONS.includes(

      collection as LeadCollection

    )

  ) {

    return undefined;

  }



  const key = collection as LeadCollection;

  const db = await getDb();



  const col = db.collection(key);



  const doc = await col.findOne({

    _id: id,

  });



  if (!doc) {

    return undefined;

  }



  const mapping = sheetFor[key];



  const result = await upsertSheetRow(

    mapping.tab,

    mapping.row(doc)

  );



  const at = new Date();



  await col.updateOne(

    { _id: id },

    {

      $set: {

        sheet: result,



        'deliveries.sheet.status': result.ok

          ? 'ok'

          : 'retry',



        'deliveries.sheet.at': at,



        'deliveries.sheet.error':

          result.error || null,



        ...(!result.ok

          ? {

              'deliveries.sheet.nextAttemptAt': at,

            }

          : {}),

      },



      ...(result.ok

        ? {

            $unset: {

              'deliveries.sheet.nextAttemptAt': '',

            },

          }

        : {}),

    }

  );



  return result;

}
