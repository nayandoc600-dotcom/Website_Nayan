"use client";

import { useActionState, useRef, useEffect } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import type { uploadStudyMaterial } from "@/lib/actions/study-materials";
import type { Destination } from "@/lib/destinations";

type UploadAction = typeof uploadStudyMaterial;

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function MaterialUploadForm({
  action,
  destinations,
}: {
  action: UploadAction;
  destinations: Destination[];
}) {
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-sky rounded-xl border border-sand p-6"
      encType="multipart/form-data"
    >
      <h2 className="font-semibold text-ink text-sm mb-4">Upload New Material</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="file" className={LABEL}>
            File (PDF or Word · max 25 MB)
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.doc,.docx"
            required
            className="text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-brand file:text-paper file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-ink file:transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="mat-title" className={LABEL}>Title</label>
          <input id="mat-title" name="title" type="text" required className={FIELD} placeholder="IELTS Preparation Guide" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className={LABEL}>Country (optional)</label>
          <select id="country" name="country" className={FIELD}>
            <option value="">General</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {state !== null && !state.ok && (
        <p role="alert" className="mt-3 text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p role="status" className="mt-3 text-sm text-green-600">Uploaded successfully.</p>
      )}

      <div className="mt-4">
        <SubmitButton label="Upload" pendingLabel="Uploading…" />
      </div>
    </form>
  );
}
