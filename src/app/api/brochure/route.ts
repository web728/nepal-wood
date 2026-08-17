import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Brochure from "@/lib/models/Brochure";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { appendEnquiryRow } from "@/lib/googleSheets";
import { sendLeadEmail } from "@/lib/mailer";
import type { SheetRow } from "@/types/forms";

const PLATFORM_NAME = "Nepal Wood Website";
const BROCHURE_FILE_URL = "/downloads/nepal-wood-2027-brochure.pdf";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, designation, country, recaptchaToken } = body;

    // 1. Basic Field Validation
    if (!name || !email || !phone || !company || !country || !recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // 2. Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { success: false, message: "Invalid CAPTCHA verification." },
        { status: 400 }
      );
    }

    // 3. Save to MongoDB Atlas
    await connectDB();
    await Brochure.create({
      name,
      email,
      phone,
      company,
      designation: designation || "",
      country,
    });

    // 4. Data for Google Sheet Row
    const sheetRow: SheetRow = {
      date: new Date().toLocaleString("en-IN"),
      platform: PLATFORM_NAME,
      registerAs: "Brochure Download Request",
      companyName: company,
      contactPerson: name,
      designation: designation || "",
      email,
      mobile: phone,
      website: "",
      address: "",
      country: country,
      areaOfInterest: "Event Brochure 2027",
      infoGet: "Brochure Form",
      message: "Brochure download access granted.",
      correctionNotes: "",
    };

    // 5. Send Email 1 (Admin Alert) & Email 2 (User Instant Download Confirmation) + Save Sheet in Parallel
    const [sheetResult, adminEmailResult, userEmailResult] = await Promise.all([
      appendEnquiryRow(sheetRow),
      
      // Admin Notification Email
      sendLeadEmail(
        "brochure",
        {
          name,
          email,
          phone,
          company,
          designation,
          country,
          interest: "Event Brochure 2027",
          source: "Brochure Download Page",
        },
        { replyTo: email }
      ),

      // User Confirmation & Direct Link Email
      sendLeadEmail(
        "brochure_user_ack",
        {
          name,
          email,
          downloadUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://nepalwood.com.np"}${BROCHURE_FILE_URL}`,
        },
        { to: email }
      ),
    ]);

    if (!sheetResult.ok) console.error("[api/brochure] Sheet write failed:", sheetResult.error);
    if (!adminEmailResult.ok) console.error("[api/brochure] Admin Email failed:", adminEmailResult.error);
    if (!userEmailResult.ok) console.error("[api/brochure] User Ack Email failed:", userEmailResult.error);

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully!",
      downloadUrl: BROCHURE_FILE_URL,
    });
  } catch (error) {
    console.error("Brochure Form Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}