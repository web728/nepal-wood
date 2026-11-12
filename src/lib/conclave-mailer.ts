import nodemailer from "nodemailer";
import type { ConferenceRegistrationValues } from "@/lib/validators/conference.schema";

const brand = {
  brown: "#4A2A16",
  amber: "#D4A373",
  cream: "#FBF7F2",
  border: "#E7DCCB",
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlRow(label: string, value: unknown) {
  if (value === undefined || value === null || value === "") return "";
  return `<tr>
    <td style="padding:10px 12px;border:1px solid ${brand.border};background:${brand.cream};font-weight:700;color:${brand.brown};vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:10px 12px;border:1px solid ${brand.border};color:#2A1B10;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(value)}</td>
  </tr>`;
}

function emailShell(content: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;border:1px solid ${brand.border};border-radius:10px;overflow:hidden;background:#fff">
    <div style="background:${brand.brown};padding:23px;color:#fff">
      <h1 style="margin:0;font-size:21px">Nepal Wood Technical Conclave 2027</h1>
      <p style="margin:5px 0 0;color:${brand.amber};font-size:12px">Part of the 12th Nepal Wood International Expo 2027</p>
    </div>
    <div style="padding:24px;color:#2A1B10;font-size:14px;line-height:1.65">${content}</div>
    <div style="background:${brand.cream};padding:15px;color:#725D4D;font-size:12px;border-top:1px solid ${brand.border}">
      28–31 January 2027 • Bhrikuti Mandap, Kathmandu, Nepal<br />
      Conclave date, programme and participation are subject to organizer confirmation.
    </div>
  </div>`;
}

function buildAdminHtml(values: ConferenceRegistrationValues) {
  const speaker = values.registrationType === "speaker";
  const rows: Array<[string, unknown]> = [
    ["Registration Type", speaker ? "Speaker Application" : "Attendee Interest"],
    ["Full Name", values.fullName],
    ["Business Email", values.email],
    ["Phone / WhatsApp", values.phone],
    ["Organization", values.organization],
    ["Designation", values.designation],
    ["Country", values.country],
    ...(speaker
      ? ([
          ["Preferred seminar topic", values.topic],
          ["Professional bio / relevant experience", values.professionalBio],
          ["Proposed talk summary", values.abstract],
          ["LinkedIn / professional profile", values.profileUrl],
        ] as Array<[string, unknown]>)
      : ([
          ["Industry category", values.industry],
          ["Sessions of interest", values.sessionInterest],
          ["Question for speakers", values.question],
        ] as Array<[string, unknown]>)),
    ["Consent", "Accepted (recorded in MongoDB with timestamp)"],
  ];
  return emailShell(`<h2 style="color:${brand.brown};font-size:18px;margin-top:0">New ${speaker ? "speaker application" : "attendee interest"}</h2>
    <table style="border-collapse:collapse;width:100%;font-size:13px">${rows.map(([label, value]) => htmlRow(label, value)).join("")}</table>`);
}

function buildAcknowledgementHtml(values: ConferenceRegistrationValues) {
  const speaker = values.registrationType === "speaker";
  const message = speaker
    ? "Your speaker application was submitted for review. Session assignments are subject to review."
    : "Your attendee interest was submitted. Confirmation is subject to organizer approval.";
  return emailShell(`<p>Dear <strong>${escapeHtml(values.fullName)}</strong>,</p>
    <p>Thank you for your interest in the Nepal Wood Technical Conclave 2027.</p>
    <p>${escapeHtml(message)}</p>
 
    <p>For questions, please contact <a style="color:${brand.brown}" href="https://nepalwood.com.np/contact">the organizers</a>.</p>`);
}

export async function sendConclaveNotifications(values: ConferenceRegistrationValues): Promise<{
  adminOk: boolean;
  attendeeOk: boolean;
  errors: string[];
}> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO_1, MAIL_TO_2 } = process.env;
  const errors: string[] = [];
  const adminRecipients = [MAIL_TO_1, MAIL_TO_2].filter(Boolean).join(",");
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    return { adminOk: false, attendeeOk: false, errors: ["SMTP or MAIL_FROM not configured"] };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const type = values.registrationType === "speaker" ? "Speaker Application" : "Attendee Interest";
  const adminSend = adminRecipients
    ? transporter.sendMail({
        from: MAIL_FROM,
        to: adminRecipients,
        replyTo: values.email,
        subject: `New Technical Conclave ${type} — Nepal Wood 2027`,
        html: buildAdminHtml(values),
      })
    : Promise.reject(new Error("MAIL_TO_1 / MAIL_TO_2 not configured"));
  const attendeeSend = transporter.sendMail({
    from: MAIL_FROM,
    to: values.email,
    replyTo: MAIL_TO_1 || MAIL_FROM,
    subject: `Your Technical Conclave ${type} — Received`,
    html: buildAcknowledgementHtml(values),
  });

  const [admin, attendee] = await Promise.allSettled([adminSend, attendeeSend]);
  if (admin.status === "rejected") errors.push(`Admin email: ${String(admin.reason)}`);
  if (attendee.status === "rejected") errors.push(`Applicant email: ${String(attendee.reason)}`);
  return {
    adminOk: admin.status === "fulfilled",
    attendeeOk: attendee.status === "fulfilled",
    errors,
  };
}
