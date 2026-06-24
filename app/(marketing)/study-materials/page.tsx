import type { Metadata } from "next";
import { FileText, Download } from "lucide-react";
import { getStudyMaterials } from "@/lib/data/study-materials";

export const metadata: Metadata = {
  title: "Study Materials",
  description:
    "Free study guides, brochures, and resources from Nayan Educational Consultancy to help you prepare for studying abroad.",
};

export const revalidate = 3600;

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function StudyMaterialsPage() {
  const materials = await getStudyMaterials();

  return (
    <>
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Free Resources
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-4 leading-tight">
            Study Materials
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            Guides, brochures, and preparation resources — free to download. New
            materials are added regularly.
          </p>
        </div>
      </section>

      <section className="bg-sky py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {materials.length === 0 ? (
            <p className="text-slate text-sm text-center">
              No study materials available yet — please check back soon.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {materials.map((m) => (
                <li key={m.id}>
                  <a
                    href={m.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-paper rounded-xl border border-sand p-5 hover:border-brand hover:shadow-sm transition-all"
                  >
                    <span className="flex-shrink-0 w-11 h-11 rounded-lg bg-sky flex items-center justify-center text-brand">
                      <FileText size={20} aria-hidden="true" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium text-ink group-hover:text-brand transition-colors truncate">
                        {m.title}
                      </span>
                      <span className="text-xs text-slate">
                        {[m.country, formatSize(m.size_bytes)]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    <span className="flex-shrink-0 text-slate group-hover:text-brand transition-colors">
                      <Download size={18} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
