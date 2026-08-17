import nodemailer from "nodemailer";
import type { FormType } from "@/types/forms";

const FORM_TITLES: Record<FormType, string> = {
  contact: "Contact",
  "exhibitor-registration": "Exhibitor",
  "visitor-registration": "Visitor",
  "cookie-consent": "Cookie Consent",
  brochure: "Brochure Download Request",
  brochure_user_ack: "Your Event Brochure Request",
};

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP credentials are not set (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS)."
    );
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function fieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

// Prevents raw HTML/script tags in user-submitted values from being rendered as markup
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtmlTable(payload: Record<string, unknown>): string {
  const rows = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const raw = Array.isArray(value) ? value.join(", ") : String(value);
      const display = escapeHtml(raw);
      return `
        <tr>
          <td style="padding:8px 12px;border:1px solid #E7DCCB;background:#FBF7F2;font-weight:600;color:#4A2A16;">${escapeHtml(
            fieldLabel(key)
          )}</td>
          <td style="padding:8px 12px;border:1px solid #E7DCCB;color:#2A1B10;">${display}</td>
        </tr>`;
    })
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#7A1F1F;">New Enquiry — Nepal Wood Expo</h2>
      <table style="border-collapse:collapse;width:100%;">${rows}</table>
    </div>`;
}

/** Professional branded email for User Acknowledgment (Instant Download) */
function buildUserAckHtml(payload: Record<string, unknown>): string {
  const name = escapeHtml(String(payload.name || "Valued Visitor"));
  const downloadUrl = String(payload.downloadUrl || "#");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E7DCCB;border-radius:8px;overflow:hidden;background-color:#FFFFFF;">
      <div style="background-color:#4A2A16;padding:24px;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:22px;letter-spacing:0.5px;">Nepal Wood Expo 2027</h1>
        <p style="color:#D4A373;margin:4px 0 0;font-size:13px;">Official Event Brochure Download</p>
      </div>
      <div style="padding:28px 24px;color:#2A1B10;line-height:1.6;">
        <p style="font-size:16px;margin-top:0;">Dear <strong>${name}</strong>,</p>
        <p>Thank you for requesting the official event brochure for <strong>Nepal Wood International Expo 2027</strong>.</p>
        <p>You can access and download your copy immediately using the link below:</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${downloadUrl}" style="background-color:#7A1F1F;color:#FFFFFF;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block;">Download Event Brochure (PDF)</a>
        </div>
        <p style="font-size:13px;color:#666666;">If the button above does not work, copy and paste this link into your browser:<br/><a href="${downloadUrl}" style="color:#7A1F1F;">${downloadUrl}</a></p>
        <hr style="border:none;border-top:1px solid #E7DCCB;margin:24px 0;"/>
        <p style="font-size:13px;margin-bottom:0;color:#4A2A16;">
          <strong>Event Dates:</strong> 28–31 January 2027<br/>
          <strong>Venue:</strong> Bhrikuti Mandap, Kathmandu, Nepal
        </p>
      </div>
      <div style="background-color:#FBF7F2;padding:16px;text-align:center;font-size:12px;color:#777777;border-top:1px solid #E7DCCB;">
        &copy; Nepal Wood International Expo. All rights reserved.
      </div>
    </div>`;
}

interface LeadEmailOptions {
  replyTo?: string;
  to?: string; // Optional direct recipient override
}

/**
 * Sends a formatted notification email to admin or directly to a user.
 * Non-fatal by design: mail-server outage never blocks DB save + Sheets write.
 */
export async function sendLeadEmail(
  formType: FormType,
  payload: Record<string, unknown>,
  options: LeadEmailOptions = {}
): Promise<{ ok: boolean; error?: string }> {
  const mailFrom = process.env.MAIL_FROM;
  const mailTo1 = process.env.MAIL_TO_1;
  const mailTo2 = process.env.MAIL_TO_2;

  // Determine recipients: options.to takes precedence (for user confirmation)
  const recipients = options.to || [mailTo1, mailTo2].filter(Boolean).join(",");

  if (!mailFrom || !recipients) {
    console.error("[mailer] MAIL_FROM or recipients not set — skipping email.");
    return { ok: false, error: "Mail recipients not configured" };
  }

  // Choose template based on formType
  const htmlContent =
    formType === "brochure_user_ack"
      ? buildUserAckHtml(payload)
      : buildHtmlTable(payload);

  const subject =
    formType === "brochure_user_ack"
      ? "Your Nepal Wood Expo 2027 Brochure Download"
      : `New ${FORM_TITLES[formType]} Enquiry — Nepal Wood Expo`;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: mailFrom,
      to: recipients,
      replyTo: options.replyTo,
      subject: subject,
      html: htmlContent,
    });
    return { ok: true };
  } catch (err) {
    console.error("[mailer] sendLeadEmail failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}