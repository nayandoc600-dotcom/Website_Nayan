import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { StudyMaterialLead } from "@/lib/types";

export type LeadFilters = {
  q?: string;
  country?: string;
  material?: string; // material_title
  page?: number;
  perPage?: number;
};

export type LeadsPage = {
  rows: StudyMaterialLead[];
  total: number; // total matching the filters (for pagination)
  page: number;
  perPage: number;
};

function escapeLike(s: string): string {
  // Neutralise ilike wildcards in user input.
  return s.replace(/[%_,]/g, (m) => `\\${m}`);
}

export async function getMaterialLeads(filters: LeadFilters): Promise<LeadsPage> {
  const supabase = createServiceClient();
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(100, Math.max(1, filters.perPage ?? 20));
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("study_material_leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filters.q?.trim()) {
    const q = escapeLike(filters.q.trim());
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  }
  if (filters.country) query = query.eq("preferred_country", filters.country);
  if (filters.material) query = query.eq("material_title", filters.material);

  const { data, error, count } = await query.range(from, to);
  if (error) {
    console.error("getMaterialLeads:", error.message);
    return { rows: [], total: 0, page, perPage };
  }
  return { rows: data ?? [], total: count ?? 0, page, perPage };
}

export type LeadStats = {
  totalDownloads: number;
  uniqueLeads: number; // distinct phone numbers
  perFile: { title: string; count: number }[];
  countries: string[];
  materials: string[];
};

// Aggregates computed in JS over a lightweight projection. Lead volume for a
// consultancy is modest; if this ever grows large, move to a Postgres view/RPC.
export async function getMaterialLeadStats(): Promise<LeadStats> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("study_material_leads")
    .select("phone, preferred_country, material_title");

  if (error || !data) {
    console.error("getMaterialLeadStats:", error?.message);
    return { totalDownloads: 0, uniqueLeads: 0, perFile: [], countries: [], materials: [] };
  }

  const phones = new Set<string>();
  const perFile = new Map<string, number>();
  const countries = new Set<string>();
  const materials = new Set<string>();

  for (const row of data) {
    if (row.phone) phones.add(row.phone.trim());
    if (row.preferred_country) countries.add(row.preferred_country);
    if (row.material_title) {
      materials.add(row.material_title);
      perFile.set(row.material_title, (perFile.get(row.material_title) ?? 0) + 1);
    }
  }

  return {
    totalDownloads: data.length,
    uniqueLeads: phones.size,
    perFile: Array.from(perFile, ([title, count]) => ({ title, count })).sort(
      (a, b) => b.count - a.count,
    ),
    countries: Array.from(countries).sort(),
    materials: Array.from(materials).sort(),
  };
}

// Used by the export route — all rows matching the filters, no pagination.
export async function getAllMaterialLeadsForExport(
  filters: Omit<LeadFilters, "page" | "perPage">,
): Promise<StudyMaterialLead[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("study_material_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.q?.trim()) {
    const q = escapeLike(filters.q.trim());
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  }
  if (filters.country) query = query.eq("preferred_country", filters.country);
  if (filters.material) query = query.eq("material_title", filters.material);

  const { data, error } = await query;
  if (error) {
    console.error("getAllMaterialLeadsForExport:", error.message);
    return [];
  }
  return data ?? [];
}
