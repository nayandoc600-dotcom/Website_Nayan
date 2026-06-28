import type { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { createClient } from "@/lib/supabase/server";
import { getAllMaterialLeadsForExport } from "@/lib/data/admin-material-leads";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { header: "Name", key: "name" },
  { header: "Email", key: "email" },
  { header: "Phone", key: "phone" },
  { header: "Preferred Country", key: "preferred_country" },
  { header: "Qualification", key: "qualification" },
  { header: "Downloaded File", key: "material_title" },
  { header: "Submitted At", key: "created_at" },
  { header: "User Agent", key: "user_agent" },
] as const;

export async function GET(req: NextRequest) {
  // Authorization — admin session required.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const sp = req.nextUrl.searchParams;
  const format = sp.get("format") === "xlsx" ? "xlsx" : "csv";

  const leads = await getAllMaterialLeadsForExport({
    q: sp.get("q") ?? undefined,
    country: sp.get("country") ?? undefined,
    material: sp.get("material") ?? undefined,
  });

  const records: Record<string, string>[] = leads.map((r) => ({
    name: r.name,
    email: r.email,
    phone: r.phone,
    preferred_country: r.preferred_country ?? "",
    qualification: r.qualification ?? "",
    material_title: r.material_title ?? "",
    created_at: new Date(r.created_at).toLocaleString("en-GB"),
    user_agent: r.user_agent ?? "",
  }));

  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "xlsx") {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Leads");
    ws.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 26 }));
    ws.getRow(1).font = { bold: true };
    for (const rec of records) ws.addRow(rec);
    const buffer = (await wb.xlsx.writeBuffer()) as ArrayBuffer;

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="study-material-leads-${stamp}.xlsx"`,
      },
    });
  }

  // CSV — quote every field, escape embedded quotes, prepend BOM so Excel reads UTF-8.
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = COLUMNS.map((c) => esc(c.header)).join(",");
  const lines = records.map((rec) =>
    COLUMNS.map((c) => esc(rec[c.key] ?? "")).join(","),
  );
  const csv = "﻿" + [header, ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="study-material-leads-${stamp}.csv"`,
    },
  });
}
