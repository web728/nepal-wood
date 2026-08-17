import { google } from "googleapis";
import type { SheetRow } from "@/types/forms";

const SHEET_TAB_NAME = "Website Enquries"; // exact spelling per spec — do not "fix" the typo

function getAuth() {
  const privateKeyBase64 = process.env.GOOGLE_PRIVATE_KEY;

  if (!privateKeyBase64) {
    throw new Error(
      "Google Sheets private key is missing (GOOGLE_PRIVATE_KEY)."
    );
  }

  let email: string;
  let privateKey: string;

  try {
    // 1. Base64 string decode karein
    const decodedJsonString = Buffer.from(privateKeyBase64, "base64").toString("utf-8");
    
    // 2. Decoded string ko JSON.parse karein
    const credentials = JSON.parse(decodedJsonString);

    email = credentials.client_email;
    privateKey = credentials.private_key;
  } catch (err) {
    // Fallback: Aggar plain private key string match ho to old logic follow karein
    email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
    privateKey = (privateKeyBase64 || "").replace(/\\n/g, "\n");
  }

  if (!email || !privateKey) {
    throw new Error(
      "Failed to extract valid Google Service Account credentials."
    );
  }

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function rowToArray(row: SheetRow): string[] {
  return [
    row.date,
    row.platform,
    row.registerAs,
    row.companyName,
    row.contactPerson,
    row.designation,
    row.email,
    row.mobile,
    row.website,
    row.address,
    row.country,
    row.areaOfInterest,
    row.infoGet,
    row.message,
    row.correctionNotes,
  ];
}

/**
 * Appends one row to the shared "Website Enquries" tab. Never throws to the
 * caller — logs and returns a success flag so a Sheets outage never fails
 * the overall form submission (DB + email should still succeed).
 */
export async function appendEnquiryRow(row: SheetRow): Promise<{ ok: boolean; error?: string }> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    console.error("[googleSheets] GOOGLE_SHEET_ID is not set — skipping sheet write.");
    return { ok: false, error: "GOOGLE_SHEET_ID not set" };
  }

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${SHEET_TAB_NAME}!A:O`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowToArray(row)],
      },
    });

    return { ok: true };
  } catch (err) {
    console.error("[googleSheets] appendEnquiryRow failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}