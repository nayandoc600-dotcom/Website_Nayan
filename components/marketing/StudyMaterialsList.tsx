"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { FileText, Download, X } from "lucide-react";
import { requestStudyMaterial } from "@/lib/actions/study-material-download";
import { QUALIFICATIONS } from "@/lib/study-material-options";
import { DESTINATIONS } from "@/lib/destinations";
import type { PublicStudyMaterial } from "@/lib/types";

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const FIELD =
  "w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "block text-xs font-medium text-slate uppercase tracking-wide mb-1.5";

function triggerDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function StudyMaterialsList({
  materials,
}: {
  materials: PublicStudyMaterial[];
}) {
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modalFor, setModalFor] = useState<PublicStudyMaterial | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (modalFor) closeRef.current?.focus();
  }, [modalFor]);

  // First click: try with no form data. If the visitor is already unlocked
  // (cookie), the server returns a signed URL; otherwise it asks for the form.
  function handleDownloadClick(m: PublicStudyMaterial) {
    setActiveId(m.id);
    const fd = new FormData();
    fd.set("material_id", m.id);
    startTransition(async () => {
      const res = await requestStudyMaterial({ status: "idle" }, fd);
      setActiveId(null);
      if (res.status === "success") {
        triggerDownload(res.url);
        setToast("Your download has started.");
      } else if (res.status === "need_form") {
        setFormError(null);
        setModalFor(m);
      } else if (res.status === "error") {
        setToast(res.error);
      }
    });
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modalFor) return;
    const fd = new FormData(e.currentTarget);
    fd.set("material_id", modalFor.id);
    startTransition(async () => {
      const res = await requestStudyMaterial({ status: "idle" }, fd);
      if (res.status === "success") {
        triggerDownload(res.url);
        setModalFor(null);
        setToast("Your download has started.");
      } else if (res.status === "error") {
        setFormError(res.error);
      } else {
        // need_form again => validation gap; keep modal open
        setFormError("Please complete all required fields.");
      }
    });
  }

  if (materials.length === 0) {
    return (
      <p className="text-slate text-sm text-center">
        No study materials available yet — please check back soon.
      </p>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {materials.map((m) => (
          <li key={m.id}>
            <div className="group flex items-center gap-4 bg-paper rounded-xl border border-sand p-5 hover:border-brand transition-colors">
              <span className="flex-shrink-0 w-11 h-11 rounded-lg bg-sky flex items-center justify-center text-brand">
                <FileText size={20} aria-hidden="true" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">{m.title}</p>
                <p className="text-xs text-slate">
                  {[m.country, formatSize(m.size_bytes)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                onClick={() => handleDownloadClick(m)}
                disabled={pending && activeId === m.id}
                className="inline-flex items-center gap-2 shrink-0 rounded-md bg-brand text-paper text-sm font-medium px-4 py-2 hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} aria-hidden="true" />
                {pending && activeId === m.id ? "…" : "Download"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Lead-gate modal */}
      {modalFor && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sm-lead-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && !pending) setModalFor(null);
          }}
        >
          <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-7 relative max-h-[90vh] overflow-y-auto">
            <button
              ref={closeRef}
              onClick={() => !pending && setModalFor(null)}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate hover:text-ink hover:bg-sky transition-colors"
            >
              <X size={18} />
            </button>

            <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
              Free Download
            </p>
            <h2
              id="sm-lead-title"
              className="font-display text-h3 font-semibold text-ink mb-1"
            >
              Almost there!
            </h2>
            <p className="text-slate text-sm mb-5">
              Tell us a little about yourself to download{" "}
              <span className="font-medium text-ink">{modalFor.title}</span>. You
              only need to do this once.
            </p>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="sm-name" className={LABEL}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input id="sm-name" name="name" type="text" required autoComplete="name" className={FIELD} placeholder="Priya Sharma" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sm-email" className={LABEL}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input id="sm-email" name="email" type="email" required autoComplete="email" className={FIELD} placeholder="priya@example.com" />
                </div>
                <div>
                  <label htmlFor="sm-phone" className={LABEL}>
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input id="sm-phone" name="phone" type="tel" required autoComplete="tel" className={FIELD} placeholder="+977 98XXXXXXXX" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sm-country" className={LABEL}>Preferred Destination</label>
                  <select id="sm-country" name="preferred_country" className={FIELD} defaultValue="">
                    <option value="">Select…</option>
                    {DESTINATIONS.map((d) => (
                      <option key={d.slug} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sm-qual" className={LABEL}>
                    Highest Qualification <span className="text-red-500">*</span>
                  </label>
                  <select id="sm-qual" name="qualification" required className={FIELD} defaultValue="">
                    <option value="" disabled>Select…</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-1 rounded-md bg-brand text-paper text-sm font-medium py-3 hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Preparing download…" : "Download Now"}
              </button>
              <p className="text-xs text-slate text-center">
                Your details are used only to share relevant study guidance.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] rounded-lg bg-ink text-paper text-sm px-5 py-3 shadow-lg"
        >
          {toast}
        </div>
      )}
    </>
  );
}
