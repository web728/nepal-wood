import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import CookieConsentModel from "@/lib/models/CookieConsent";
import { appendEnquiryRow } from "@/lib/googleSheets";
import { sendLeadEmail } from "@/lib/mailer";
import type { SheetRow } from "@/types/forms";

const PLATFORM_NAME = "Nepal Wood Website";

interface CookieConsentBody {
  consentGiven: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as CookieConsentBody | null;
  if (!body || typeof body.consentGiven !== "boolean") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const hasIdentity = Boolean(body.name || body.email || body.phone);

  try {
    await connectToDatabase();
    await CookieConsentModel.create({
      consentGiven: body.consentGiven,
      name: body.name,
      email: body.email,
      phone: body.phone,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error("[api/cookie-consent] DB save failed:", err);
    return NextResponse.json({ success: false, message: "Could not record consent." }, { status: 500 });
  }

  // Only ping the shared Sheet + notification email if we actually have a
  // lead attached to this consent event — an anonymous consent log doesn't
  // need to alert the sales team.
  if (hasIdentity) {
    const sheetRow: SheetRow = {
      date: new Date().toLocaleString("en-IN"),
      platform: PLATFORM_NAME,
      registerAs: "Cookie Consent",
      companyName: "",
      contactPerson: body.name ?? "",
      designation: "",
      email: body.email ?? "",
      mobile: body.phone ?? "",
      website: "",
      address: "",
      country: "",
      areaOfInterest: "",
      infoGet: "",
      message: `Consent given: ${body.consentGiven}`,
      correctionNotes: "",
    };

    const [sheetResult, emailResult] = await Promise.all([
      appendEnquiryRow(sheetRow),
      sendLeadEmail("cookie-consent", {
        name: body.name,
        email: body.email,
        phone: body.phone,
        consentGiven: body.consentGiven,
      }),
    ]);

    if (!sheetResult.ok) console.error("[api/cookie-consent] Sheet write failed:", sheetResult.error);
    if (!emailResult.ok) console.error("[api/cookie-consent] Email send failed:", emailResult.error);
  }

  return NextResponse.json({ success: true });
}