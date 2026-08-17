import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import ExhibitorRegistrationModel from "@/lib/models/ExhibitorRegistration";
import { appendEnquiryRow } from "@/lib/googleSheets";
import { sendLeadEmail } from "@/lib/mailer";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { exhibitorSchema } from "@/lib/validators/exhibitor.schema";
import type { SheetRow } from "@/types/forms";

const PLATFORM_NAME = "Nepal Wood Website";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = exhibitorSchema.safeParse(body);
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
    await ExhibitorRegistrationModel.create({
      fullName: data.fullName,
      designation: data.designation,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
      websiteUrl: data.websiteUrl,
      country: data.country,
      city: data.city,
      message: data.message,
      interestedInSponsorship: data.interestedInSponsorship,
      marketingOptIn: data.marketingOptIn,
      privacyAccepted: data.privacyAccepted,
    });
  } catch (err) {
    console.error("[api/exhibitor-registration] DB save failed:", err);
    return NextResponse.json(
      { success: false, message: "Could not save your enquiry. Please try again shortly." },
      { status: 500 }
    );
  }

  const sheetRow: SheetRow = {
    date: new Date().toLocaleString("en-IN"),
    platform: PLATFORM_NAME,
    registerAs: "Exhibitor",
    companyName: data.companyName,
    contactPerson: data.fullName,
    designation: data.designation,
    email: data.email,
    mobile: data.phone,
    website: data.websiteUrl ?? "",
    address: [data.city, data.country].filter(Boolean).join(", "),
    country: data.country,
    areaOfInterest: "",
    infoGet: "",
    message: [
      data.message,
      data.interestedInSponsorship ? "[Also interested in sponsorship]" : "",
    ]
      .filter(Boolean)
      .join(" "),
    correctionNotes: "",
  };

  const [sheetResult, emailResult] = await Promise.all([
    appendEnquiryRow(sheetRow),
    sendLeadEmail(
      "exhibitor-registration",
      {
        fullName: data.fullName,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        websiteUrl: data.websiteUrl,
        country: data.country,
        city: data.city,
        message: data.message,
        interestedInSponsorship: data.interestedInSponsorship ? "Yes" : "No",
        marketingOptIn: data.marketingOptIn ? "Yes" : "No",
      },
      { replyTo: data.email }
    ),
  ]);

  if (!sheetResult.ok) console.error("[api/exhibitor-registration] Sheet write failed:", sheetResult.error);
  if (!emailResult.ok) console.error("[api/exhibitor-registration] Email send failed:", emailResult.error);

  return NextResponse.json({ success: true });
}