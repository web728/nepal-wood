import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { appendEnquiryRow } from "@/lib/googleSheets";
import { sendLeadEmail } from "@/lib/mailer";
import type { SheetRow } from "@/types/forms";

const PLATFORM_NAME = "Nepal Wood Website";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, interest, message, recaptchaToken, source } = body;

    // 1. Basic required-field guard (schema already validates on client,
    //    this is just a server-side safety net)
    if (!name || !email || !message || !recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 2. Verify reCAPTCHA using the shared helper
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { success: false, message: "Invalid CAPTCHA verification." },
        { status: 400 }
      );
    }

    // 3. Save to MongoDB Atlas
    await connectDB();
    await Contact.create({
      name,
      email,
      phone,
      company,
      interest: interest || "General Enquiry",
      message,
      sourcePage: source || "contact",
    });

    // 4. Append to the shared "Website Enquries" Google Sheet + send email
    //    notification in parallel — same pattern as exhibitor/visitor/cookie-consent
    const sheetRow: SheetRow = {
      date: new Date().toLocaleString("en-IN"),
      platform: PLATFORM_NAME,
      registerAs: "Contact Enquiry",
      companyName: company || "",
      contactPerson: name,
      designation: "",
      email,
      mobile: phone || "",
      website: "",
      address: "",
      country: "",
      areaOfInterest: interest || "",
      infoGet: "",
      message,
      correctionNotes: "",
    };

    const [sheetResult, emailResult] = await Promise.all([
      appendEnquiryRow(sheetRow),
      sendLeadEmail(
        "contact",
        { name, email, phone, company, interest, message, source: source || "contact" },
        { replyTo: email }
      ),
    ]);

    if (!sheetResult.ok) console.error("[api/contact] Sheet write failed:", sheetResult.error);
    if (!emailResult.ok) console.error("[api/contact] Email send failed:", emailResult.error);

    return NextResponse.json({ success: true, message: "Submitted successfully!" });
  } catch (error) {
    console.error("Form Submission Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}