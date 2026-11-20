import 'server-only';

import type { ConferenceInput } from './conference';
import { COLLECTIONS, getDb } from './db';
import { shortCode } from './ids';
import { initialDeliveries, scheduleLeadDeliveries } from './lead-delivery';
import type { LeadMeta } from './leads';

export async function saveConclaveRegistration(input: ConferenceInput, meta: LeadMeta) {
  const db = await getDb();
  const { website_url: _honeypot, startedAt: _startedAt, ...details } = input;
  // Keep the complete submitted data in MongoDB. The human-readable message is
  // only a copy for existing admin dashboards and the shared Google Sheet.
  const isSpeaker = input.registration_type === 'speaker';
  const message = isSpeaker
    ? [
        `Seminar topic: ${input.topic}`,
        `Professional bio: ${input.professional_bio}`,
        `Talk summary: ${input.abstract}`,
        input.profile_url ? `Profile: ${input.profile_url}` : '',
      ].filter(Boolean).join('\n\n')
    : [
        `Industry: ${input.industry}`,
        `Session interest: ${input.session_interest}`,
        input.question ? `Question: ${input.question}` : '',
      ].filter(Boolean).join('\n');

  // Reuse the existing 'enquiries' collection and its delivery worker. Ordinary
  // enquiries retain their current behaviour. Conference submissions additionally
  // schedule a user acknowledgement email.
  const doc = {
    ...details,
    form: 'conclave' as const,
    event: 'Nepal Wood Technical Conclave 2027',
    company: input.organization,
    topic: isSpeaker ? 'Conference Speaker' : 'Conference Attendee',
    message,
    ref: `TC-${shortCode(10)}`,
    status: 'new',
    notes: '',
    meta,
    createdAt: new Date(),
    deliveries: {
      ...initialDeliveries(COLLECTIONS.enquiries),
      userMail: { status: 'pending' as const, attempts: 0, nextAttemptAt: new Date() },
    },
  };

  const { insertedId } = await db.collection(COLLECTIONS.enquiries).insertOne(doc);

  // A scheduling failure must not turn a confirmed MongoDB insert into an HTTP 500.
  // Persisted pending jobs can be picked up by the existing retry processor.
  try {
    scheduleLeadDeliveries(COLLECTIONS.enquiries, insertedId);
  } catch (error) {
    console.error('[conclave] Delivery scheduling failed; retry processor can recover', error);
  }

  return { ref: doc.ref };
}
