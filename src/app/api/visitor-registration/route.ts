import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import VisitorRegistrationModel from "@/lib/models/VisitorRegistration";
import { appendEnquiryRow } from "@/lib/googleSheets";
import { sendLeadEmail } from "@/lib/mailer";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { visitorSchema } from "@/lib/validators/visitor.schema";
import type { SheetRow } from "@/types/forms";

const PLATFORM_NAME = "Nepal Wood Website";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = visitorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const recaptchaOk = await verifyRecaptcha(data.recaptchaToken);
  if (!recaptchaOk) {
    return NextResponse.json(
      { success: false, message: "reCAPTCHA verification failed. Please try again." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    await VisitorRegistrationModel.create({
      name: data.name,
      designation: data.designation,
      email: data.email,
      phone: data.phone,
      company: data.company,
      websiteUrl: data.websiteUrl,
      country: data.country,
      state: data.state,
      city: data.city,
      areasOfInterest: data.areasOfInterest,
      privacyAccepted: data.privacyAccepted,
    });
  } catch (err) {
    console.error("[api/visitor-registration] DB save failed:", err);
    return NextResponse.json(
      { success: false, message: "Could not save your registration. Please try again shortly." },
      { status: 500 }
    );
  }

  const sheetRow: SheetRow = {
    date: new Date().toLocaleString("en-IN"),
    platform: PLATFORM_NAME,
    registerAs: "Visitor",
    companyName: data.company,
    contactPerson: data.name,
    designation: data.designation,
    email: data.email,
    mobile: data.phone,
    website: data.websiteUrl ?? "",
    address: [data.city, data.state, data.country].filter(Boolean).join(", "),
    country: data.country ?? "",
    areaOfInterest: (data.areasOfInterest ?? []).join(", "),
    infoGet: "",
    message: "",
    correctionNotes: "",
  };

  const [sheetResult, emailResult] = await Promise.all([
    appendEnquiryRow(sheetRow),
    sendLeadEmail(
      "visitor-registration",
      {
        name: data.name,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
        company: data.company,
        websiteUrl: data.websiteUrl,
        country: data.country,
        state: data.state,
        city: data.city,
        areasOfInterest: data.areasOfInterest,
      },
      { replyTo: data.email }
    ),
  ]);

  if (!sheetResult.ok) console.error("[api/visitor-registration] Sheet write failed:", sheetResult.error);
  if (!emailResult.ok) console.error("[api/visitor-registration] Email send failed:", emailResult.error);

  return NextResponse.json({ success: true });
}