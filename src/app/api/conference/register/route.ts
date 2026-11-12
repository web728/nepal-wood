import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ConclaveRegistration from "@/lib/models/ConclaveRegistration";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { appendEnquiryRow } from "@/lib/googleSheets";
import { sendConclaveNotifications } from "@/lib/conclave-mailer";
import { conferenceRegistrationSchema, type ConferenceRegistrationValues } from "@/lib/validators/conference.schema";
import type { SheetRow } from "@/types/forms";

export const runtime = "nodejs";

const EVENT_NAME = "Nepal Wood Technical Conclave 2027";

// The existing shared Google Sheets writer uses valueInputOption USER_ENTERED.
// Prefix formula-like user values to avoid interpreting them as spreadsheet formulas.
function sheetSafe(value: string | undefined) {
  const text = value || "";
  return /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
}

function toSheetRow(values: ConferenceRegistrationValues, consentAt: Date): SheetRow {
  const speaker = values.registrationType === "speaker";
  const notes = speaker
    ? [
        `Professional bio / relevant experience: ${values.professionalBio}`,
        `Proposed talk summary: ${values.abstract}`,
      ].join("\n\n")
    : `Question for speakers: ${values.question || "Not provided"}`;

  return {
    date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kathmandu" }),
    platform: "Nepal Wood Website — Technical Conclave 2027",
   registerAs: speaker ? "Conclave Speaker Application" : "Conclave Attendee Interest",
    companyName: sheetSafe(values.organization),
    contactPerson: sheetSafe(values.fullName),
    designation: sheetSafe(values.designation),
    email: sheetSafe(values.email),
    mobile: sheetSafe(values.phone),
    website: speaker ? sheetSafe(values.profileUrl) : "",
    address: "",
    country: sheetSafe(values.country),
    areaOfInterest: sheetSafe(speaker ? values.topic : values.sessionInterest),
    infoGet: sheetSafe(speaker ? "Speaker Application" : values.industry),
    message: sheetSafe(notes),
    correctionNotes: `Pending organizer review | Consent accepted ${consentAt.toISOString()}`,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON request." }, { status: 400 });
  }

  const parsed = conferenceRegistrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please review the highlighted fields and try again." },
      { status: 400 }
    );
  }

  const values = parsed.data;
  try {
    const isHuman = await verifyRecaptcha(values.recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { success: false, message: "Invalid CAPTCHA verification. Please verify again." },
        { status: 400 }
      );
    }

    await connectDB();
    // Lightweight duplicate-submission guard, useful for double clicks/replays.
    // For high-volume public launch, additionally use an edge/shared rate limiter.
    const recentDuplicate = await ConclaveRegistration.findOne({
      email: values.email.toLowerCase(),
      registrationType: values.registrationType,
      createdAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) },
    }).lean();
    if (recentDuplicate) {
      return NextResponse.json(
        { success: false, message: "An application with this email was just received. Please wait a moment before submitting again." },
        { status: 429 }
      );
    }

    const consentAt = new Date();
    // Do not store the reCAPTCHA token in the database or email it.
    const { recaptchaToken: _unusedToken, consent: _unusedConsent, ...storedValues } = values;
    await ConclaveRegistration.create({
      ...storedValues,
      email: values.email.toLowerCase(),
      event: EVENT_NAME,
      sourcePage: "conference",
      status: "pending_review",
      consentAccepted: true,
      consentAt,
    });

    // The database remains the source of truth. Existing website behavior is
    // intentionally non-blocking when Sheets or email is temporarily unavailable.
    const [sheetResult, emailResult] = await Promise.all([
      appendEnquiryRow(toSheetRow(values, consentAt)),
      sendConclaveNotifications(values),
    ]);
    if (!sheetResult.ok) console.error("[api/conference/register] Google Sheets failed:", sheetResult.error);
    if (emailResult.errors.length) console.error("[api/conference/register] Email failed:", emailResult.errors);

    return NextResponse.json({
      success: true,
      message:
        values.registrationType === "speaker"
          ? "Your speaker application was submitted for review."
          : "Your attendee interest was submitted. Confirmation is subject to organizer approval.",
    });
  } catch (error) {
    console.error("[api/conference/register] Submission failed:", error);
    return NextResponse.json({ success: false, message: "Unable to submit right now. Please try again." }, { status: 500 });
  }
}
