import "server-only";
import { google } from "googleapis";
import { env } from "@/env";

type ContactPayload = {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
};

export async function appendToSheet(data: ContactPayload): Promise<void> {
  try {
    const credentials = JSON.parse(env.GOOGLE_SHEETS_CREDENTIALS) as object;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: "Leads!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            data.name,
            data.email,
            data.phone ?? "",
            data.country ?? "",
            data.message,
          ],
        ],
      },
    });
  } catch (err) {
    // Non-fatal — Supabase is the source of truth
    console.error("appendToSheet failed:", err);
  }
}
