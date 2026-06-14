import { getAllStudyMaterials } from "@/lib/data/admin-study-materials";
import { uploadStudyMaterial, deleteStudyMaterial } from "@/lib/actions/study-materials";
import { DESTINATIONS } from "@/lib/destinations";
import SubmitButton from "@/components/admin/SubmitButton";
import MaterialUploadForm from "./MaterialUploadForm";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function StudyMaterialsAdminPage() {
  const materials = await getAllStudyMaterials();

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">
        Study Materials
      </h1>
      <p className="text-slate text-sm mb-8">{materials.length} files uploaded</p>

      <MaterialUploadForm action={uploadStudyMaterial} destinations={DESTINATIONS} />

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate mb-4">
          All Files
        </h2>
        {materials.length === 0 && (
          <p className="text-sm text-slate">No materials uploaded yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {materials.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-sand bg-sky p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={20} className="text-slate shrink-0" aria-hidden />
                <div className="min-w-0">
                  <p className="font-medium text-ink text-sm truncate">{m.title}</p>
                  <p className="text-xs text-slate">
                    {m.country ?? "General"} · {formatBytes(m.size_bytes)} ·{" "}
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={m.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-md border border-sand text-slate text-xs font-medium hover:bg-paper transition-colors"
                >
                  View
                </a>
                <form action={deleteStudyMaterial.bind(null, m.id)}>
                  <SubmitButton label="Delete" pendingLabel="…" variant="danger" className="text-xs px-3 py-1.5" />
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
