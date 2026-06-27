import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { getContactSubmissions } from "@/lib/data/admin-contact";
import { deleteContactSubmission } from "@/lib/actions/admin-contact";
import SubmitButton from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function QueriesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const { country: selected } = await searchParams;
  const submissions = await getContactSubmissions();

  // Distinct countries present in the queries, for the filter chips.
  const countries = Array.from(
    new Set(
      submissions
        .map((s) => s.country)
        .filter((c): c is string => Boolean(c)),
    ),
  ).sort();

  const hasUnspecified = submissions.some((s) => !s.country);

  const filtered = !selected
    ? submissions
    : selected === "__none__"
      ? submissions.filter((s) => !s.country)
      : submissions.filter((s) => s.country === selected);

  function chipClass(active: boolean) {
    return [
      "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
      active
        ? "bg-brand text-paper border-brand"
        : "bg-paper text-slate border-sand hover:text-ink hover:border-slate",
    ].join(" ");
  }

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">
        Contact Queries
      </h1>
      <p className="text-slate text-sm mb-6">
        {submissions.length} total
        {selected ? ` · ${filtered.length} shown` : ""}
      </p>

      {/* Country filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/admin/queries" className={chipClass(!selected)}>
          All
        </Link>
        {countries.map((c) => (
          <Link
            key={c}
            href={`/admin/queries?country=${encodeURIComponent(c)}`}
            className={chipClass(selected === c)}
          >
            {c}
          </Link>
        ))}
        {hasUnspecified && (
          <Link
            href="/admin/queries?country=__none__"
            className={chipClass(selected === "__none__")}
          >
            Not specified
          </Link>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate">
          {submissions.length === 0
            ? "No queries received yet."
            : "No queries for this country."}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-sand bg-sky p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-ink">{q.name}</p>
                    {q.country && (
                      <span className="px-2 py-0.5 rounded-full bg-paper border border-sand text-xs text-slate">
                        {q.country}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate flex-wrap">
                    <a
                      href={`mailto:${q.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
                    >
                      <Mail size={13} aria-hidden /> {q.email}
                    </a>
                    {q.phone && (
                      <a
                        href={`tel:${q.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
                      >
                        <Phone size={13} aria-hidden /> {q.phone}
                      </a>
                    )}
                  </div>
                </div>
                <form action={deleteContactSubmission.bind(null, q.id)}>
                  <SubmitButton
                    label="Delete"
                    pendingLabel="…"
                    variant="danger"
                    className="text-xs px-3 py-1.5"
                  />
                </form>
              </div>
              <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
                {q.message}
              </p>
              <p className="text-xs text-slate mt-3">
                {new Date(q.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
