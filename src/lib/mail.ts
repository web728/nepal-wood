import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
}

function getTransport() {
  if (!mailConfigured()) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{
  ok: boolean;
  messageId?: string;
  skipped?: boolean;
  error?: string;
}> {
  const t = getTransport();

  if (!t) {
    return {
      ok: false,
      skipped: true,
      error: "SMTP is not configured",
    };
  }

  try {
    const info = await t.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      ...opts,
    });

    return {
      ok: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[mail] send failed", error);

    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function leadRecipients() {
  return (process.env.LEADS_NOTIFY_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const esc = (s: unknown) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string,
  );

/** Minimal branded email shell that renders in Gmail/Outlook. */
export function emailShell(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f3e4d4;font-family:Arial,Helvetica,sans-serif;color:#1a110d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3e4d4;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fffaf5;border-radius:12px;overflow:hidden">
<tr><td style="background:#1c110c;padding:22px 28px;color:#dd9d59;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">Nepal Wood International Expo 2027 · 28–31 Jan · Bhrikuti Mandap, Kathmandu</td></tr>
<tr><td style="padding:28px"><h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#1a110d">${esc(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e7d2bd;font-size:12px;color:#75645a">Organised by Futurex Trade Fair and Events & Media Space Solutions · nepalwood.com.np</td></tr>
</table></td></tr></table></body></html>`;
}

export function rowsTable(rows: [string, unknown][]) {
  return `<table role="presentation" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px;width:100%">${rows
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="color:#75645a;border-bottom:1px solid #f3e4d4;width:38%;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #f3e4d4">${esc(Array.isArray(v) ? v.join(", ") : v)}</td></tr>`,
    )
    .join("")}</table>`;
}

export { esc };
