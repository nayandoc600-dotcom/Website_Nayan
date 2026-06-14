"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import type { upsertPopup } from "@/lib/actions/popup";
import type { PopupNotice } from "@/lib/types";

type UpsertAction = typeof upsertPopup;

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL =
  "text-xs font-medium text-slate uppercase tracking-wide";

export default function PopupForm({
  action,
  notice,
}: {
  action: UpsertAction;
  notice: PopupNotice | null;
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-lg">
      {notice && <input type="hidden" name="id" value={notice.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={LABEL}>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={notice?.title ?? ""}
          className={FIELD}
          placeholder="Intake 2025 Applications Open"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className={LABEL}>Body</label>
        <textarea
          id="body"
          name="body"
          rows={3}
          required
          defaultValue={notice?.body ?? ""}
          className={`${FIELD} resize-y`}
          placeholder="Describe the notice in 1–2 sentences…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="image_url" className={LABEL}>Image URL (optional)</label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={notice?.image_url ?? ""}
          className={FIELD}
          placeholder="https://example.com/banner.jpg"
        />
        <p className="text-xs text-slate">
          Paste the full URL of an image to display above the popup text.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cta_label" className={LABEL}>CTA Label (optional)</label>
          <input
            id="cta_label"
            name="cta_label"
            type="text"
            defaultValue={notice?.cta_label ?? ""}
            className={FIELD}
            placeholder="Book a Session"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cta_url" className={LABEL}>CTA URL (optional)</label>
          <input
            id="cta_url"
            name="cta_url"
            type="text"
            defaultValue={notice?.cta_url ?? ""}
            className={FIELD}
            placeholder="/contact"
          />
        </div>
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

      <SubmitButton label="Save Popup" pendingLabel="Saving…" />
    </form>
  );
}
