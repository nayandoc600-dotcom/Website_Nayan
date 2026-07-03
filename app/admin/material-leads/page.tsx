import Link from "next/link";
import { Mail, Phone, Search, Download as DownloadIcon } from "lucide-react";
import {
  getMaterialLeads,
  getMaterialLeadStats,
} from "@/lib/data/admin-material-leads";
import { deleteMaterialLead } from "@/lib/actions/admin-material-leads";
import SubmitButton from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

type SP = {
  q?: string;
  country?: string;
  material?: string;
  page?: string;
};

function buildQuery(base: SP, overrides: Partial<SP>): string {
  const merged = { ...base, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export default async function MaterialLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ rows, total }, stats] = await Promise.all([
    getMaterialLeads({
      q: sp.q,
      country: sp.country,
      material: sp.material,
      page,
      perPage: PER_PAGE,
    }),
    getMaterialLeadStats(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const filtersActive = Boolean(sp.q || sp.country || sp.material);
  const exportQuery = buildQuery(sp, { page: undefined });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-1">
        <h1 className="font-display text-h2 font-semibold text-ink">
          Study Material Leads
        </h1>
        <div className="flex gap-2">
          <a
            href={`/admin/material-leads/export${buildQuery(sp, { page: undefined }) ? buildQuery(sp, { page: undefined }) + "&format=csv" : "?format=csv"}`}
            className="inline-flex items-center gap-2 rounded-md border border-sand bg-paper px-3 py-2 text-sm font-medium text-ink hover:border-brand transition-colors"
          >
            <DownloadIcon size={15} aria-hidden /> CSV
          </a>
          <a
            href={`/admin/material-leads/export${buildQuery(sp, { page: undefined }) ? buildQuery(sp, { page: undefined }) + "&format=xlsx" : "?format=xlsx"}`}
            className="inline-flex items-center gap-2 rounded-md border border-sand bg-paper px-3 py-2 text-sm font-medium text-ink hover:border-brand transition-colors"
          >
            <DownloadIcon size={15} aria-hidden /> Excel
          </a>
        </div>
      </div>
      <p className="text-slate text-sm mb-6">
        {stats.uniqueLeads} unique leads · {stats.totalDownloads} total downloads
      </p>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-sand bg-sky p-5">
          <p className="font-display text-3xl font-semibold text-brass">{stats.uniqueLeads}</p>
          <p className="text-sm text-slate mt-1">Unique leads (by phone)</p>
        </div>
        <div className="rounded-xl border border-sand bg-sky p-5">
          <p className="font-display text-3xl font-semibold text-brass">{stats.totalDownloads}</p>
          <p className="text-sm text-slate mt-1">Total downloads</p>
        </div>
        <div className="rounded-xl border border-sand bg-sky p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate mb-2">
            Top files
          </p>
          {stats.perFile.length === 0 ? (
            <p className="text-sm text-slate">—</p>
          ) : (
            <ul className="space-y-1">
              {stats.perFile.slice(0, 3).map((f) => (
                <li key={f.title} className="flex justify-between gap-2 text-xs text-ink">
                  <span className="truncate">{f.title}</span>
                  <span className="font-medium shrink-0">{f.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Search + filters */}
      <form method="get" className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="q" className="text-xs font-medium text-slate uppercase tracking-wide block mb-1.5">
            Search (name, email, phone)
          </label>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" aria-hidden />
            <input
              id="q"
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Search…"
              className="w-full rounded-md border border-sand bg-paper pl-11 pr-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>
        <div>
          <label htmlFor="country" className="text-xs font-medium text-slate uppercase tracking-wide block mb-1.5">
            Country
          </label>
          <select id="country" name="country" defaultValue={sp.country ?? ""} className="rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand">
            <option value="">All</option>
            {stats.countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="material" className="text-xs font-medium text-slate uppercase tracking-wide block mb-1.5">
            Material
          </label>
          <select id="material" name="material" defaultValue={sp.material ?? ""} className="rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand max-w-[200px]">
            <option value="">All</option>
            {stats.materials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded-md bg-brand text-paper text-sm font-medium px-4 py-2 hover:bg-ink transition-colors">
          Apply
        </button>
        {filtersActive && (
          <Link href="/admin/material-leads" className="text-sm text-slate hover:text-ink py-2">
            Clear
          </Link>
        )}
      </form>

      {/* Results */}
      {rows.length === 0 ? (
        <p className="text-sm text-slate">
          {total === 0 && !filtersActive ? "No leads yet." : "No leads match these filters."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-sand bg-sky p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-ink">{lead.name}</p>
                    {lead.qualification && (
                      <span className="px-2 py-0.5 rounded-full bg-paper border border-sand text-xs text-slate">
                        {lead.qualification}
                      </span>
                    )}
                    {lead.preferred_country && (
                      <span className="px-2 py-0.5 rounded-full bg-paper border border-sand text-xs text-slate">
                        {lead.preferred_country}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate flex-wrap">
                    <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 hover:text-brand transition-colors">
                      <Mail size={13} aria-hidden /> {lead.email}
                    </a>
                    <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 hover:text-brand transition-colors">
                      <Phone size={13} aria-hidden /> {lead.phone}
                    </a>
                  </div>
                </div>
                <form action={deleteMaterialLead.bind(null, lead.id)} className="shrink-0">
                  <SubmitButton label="Delete" pendingLabel="…" variant="danger" className="text-xs px-3 py-1.5" />
                </form>
              </div>
              <p className="text-sm text-ink mt-3">
                Downloaded:{" "}
                <span className="font-medium">{lead.material_title ?? "—"}</span>
              </p>
              <p className="text-xs text-slate mt-1">
                {new Date(lead.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 text-sm">
          <p className="text-slate">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/material-leads${buildQuery(sp, { page: String(page - 1) })}`}
                className="rounded-md border border-sand bg-paper px-3 py-1.5 text-ink hover:border-brand transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/material-leads${buildQuery(sp, { page: String(page + 1) })}`}
                className="rounded-md border border-sand bg-paper px-3 py-1.5 text-ink hover:border-brand transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
