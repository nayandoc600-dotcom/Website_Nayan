"use client";

import { useActionState, useRef, useEffect } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { useUploadSizeGuard } from "@/components/admin/useUploadSizeGuard";
import { createGalleryPhoto } from "@/lib/actions/gallery";

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function GalleryUploadForm() {
  const [state, formAction] = useActionState(createGalleryPhoto, null);
  const formRef = useRef<HTMLFormElement>(null);
  const image = useUploadSizeGuard();

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-sky rounded-xl border border-sand p-6"
    >
      <h2 className="font-semibold text-ink text-sm mb-4">Add Photo</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="image" className={LABEL}>
            Image (JPEG, PNG, WebP · max 4 MB)
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            onChange={image.onChange}
            className="text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-brand file:text-paper file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-ink file:transition-colors"
          />
          {image.error && (
            <p role="alert" className="text-xs text-red-600">{image.error}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="caption" className={LABEL}>Caption (optional)</label>
          <input id="caption" name="caption" type="text" maxLength={200} className={FIELD} placeholder="Send-off, 2026" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sort_order" className={LABEL}>Sort order (optional)</label>
          <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={0} className={FIELD} />
        </div>
      </div>

      {state !== null && !state.ok && (
        <p role="alert" className="mt-3 text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p role="status" className="mt-3 text-sm text-green-600">Uploaded successfully.</p>
      )}

      <div className="mt-4">
        <SubmitButton label="Add Photo" pendingLabel="Uploading…" disabled={image.tooBig} />
      </div>
    </form>
  );
}
