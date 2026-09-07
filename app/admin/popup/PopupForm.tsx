"use client";

import { useActionState, useId } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { useUploadSizeGuard } from "@/components/admin/useUploadSizeGuard";
import type { upsertPopup } from "@/lib/actions/popup";
import type { PopupNotice } from "@/lib/types";

type UpsertAction = typeof upsertPopup;

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";
const FILE =
  "text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-brand file:text-paper file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-ink file:transition-colors";

export default function PopupForm({
  action,
  notice,
}: {
  action: UpsertAction;
  notice: PopupNotice | null;
}) {
  const [state, formAction] = useActionState(action, null);
  const image = useUploadSizeGuard();
  const pdf = useUploadSizeGuard();
  // Several of these forms share one page now, so field ids must be unique
  // or every label would point at the first form's inputs.
  const uid = useId();

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-lg">
      {notice && <input type="hidden" name="id" value={notice.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-title`} className={LABEL}>Title (optional)</label>
        <input
          id={`${uid}-title`}
          name="title"
          type="text"
          defaultValue={notice?.title ?? ""}
          className={FIELD}
          placeholder="September 2026 Intake — Applications Open"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-body`} className={LABEL}>Body (optional)</label>
        <textarea
          id={`${uid}-body`}
          name="body"
          rows={3}
          defaultValue={notice?.body ?? ""}
          className={`${FIELD} resize-y`}
          placeholder="Describe the notice in 1–2 sentences…"
        />
      </div>

      <p className="-mt-2 text-xs text-slate">
        Title and body are optional — a popup can be just an image or a PDF.
      </p>

      {/* Image upload */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-image`} className={LABEL}>
          Image (optional · JPEG, PNG, WebP · max 4 MB)
        </label>
        {notice?.image_url && (
          <div className="flex items-center gap-3 mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={notice.image_url}
              alt="Current popup image"
              className="h-14 w-auto rounded border border-sand object-cover"
            />
            <label className="flex items-center gap-1.5 text-xs text-slate cursor-pointer">
              <input type="checkbox" name="remove_image" className="accent-brand" />
              Remove current image
            </label>
          </div>
        )}
        <input
          id={`${uid}-image`}
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={image.onChange}
          className={FILE}
        />
        {image.error && (
          <p role="alert" className="text-xs text-red-600">{image.error}</p>
        )}
        <p className="text-xs text-slate">
          Shown above the popup text. Upload a new file to replace the current one.
        </p>
      </div>

      {/* PDF upload */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-pdf`} className={LABEL}>
          PDF (optional · max 4 MB)
        </label>
        {notice?.pdf_url && (
          <div className="flex items-center gap-3 mb-1">
            <a
              href={notice.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand hover:underline"
            >
              View current PDF
            </a>
            <label className="flex items-center gap-1.5 text-xs text-slate cursor-pointer">
              <input type="checkbox" name="remove_pdf" className="accent-brand" />
              Remove current PDF
            </label>
          </div>
        )}
        <input
          id={`${uid}-pdf`}
          name="pdf"
          type="file"
          accept="application/pdf"
          onChange={pdf.onChange}
          className={FILE}
        />
        {pdf.error && (
          <p role="alert" className="text-xs text-red-600">{pdf.error}</p>
        )}
        <p className="text-xs text-slate">
          Visitors can open or download it from the popup (e.g. a brochure).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-cta_label`} className={LABEL}>CTA Label (optional)</label>
          <input
            id={`${uid}-cta_label`}
            name="cta_label"
            type="text"
            defaultValue={notice?.cta_label ?? ""}
            className={FIELD}
            placeholder="Book a Session"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-cta_url`} className={LABEL}>CTA URL (optional)</label>
          <input
            id={`${uid}-cta_url`}
            name="cta_url"
            type="text"
            defaultValue={notice?.cta_url ?? ""}
            className={FIELD}
            placeholder="/contact"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-sort_order`} className={LABEL}>Order</label>
        <input
          id={`${uid}-sort_order`}
          name="sort_order"
          type="number"
          min={0}
          max={999}
          defaultValue={notice?.sort_order ?? 0}
          className={`${FIELD} w-24`}
        />
        <p className="text-xs text-slate">
          Lowest number shows first when several popups are active.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className={LABEL}>Active</label>
        <div className="flex gap-4">
          {(["true", "false"] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input
                type="radio"
                name="active"
                value={v}
                defaultChecked={
                  notice ? String(notice.active) === v : v === "false"
                }
                className="accent-brand"
              />
              {v === "true" ? "Yes — show to visitors" : "No — hidden"}
            </label>
          ))}
        </div>
      </div>

      {state !== null && !state.ok && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p role="status" className="text-sm text-green-600">Saved successfully.</p>
      )}

      <SubmitButton
        label={notice ? "Save Popup" : "Add Popup"}
        pendingLabel="Saving…"
        disabled={image.tooBig || pdf.tooBig}
      />
    </form>
  );
}
