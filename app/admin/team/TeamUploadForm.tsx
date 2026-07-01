"use client";

import { useActionState, useRef, useEffect } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { createTeamMember } from "@/lib/actions/team";

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function TeamUploadForm() {
  const [state, formAction] = useActionState(createTeamMember, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-sky rounded-xl border border-sand p-6"
    >
      <h2 className="font-semibold text-ink text-sm mb-4">Add Team Member</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="photo" className={LABEL}>
            Photo (JPEG, PNG, WebP · max 5 MB)
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-brand file:text-paper file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-ink file:transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={LABEL}>Name</label>
          <input id="name" name="name" type="text" required className={FIELD} placeholder="Anisha Gurung" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className={LABEL}>Title</label>
          <input id="title" name="title" type="text" required className={FIELD} placeholder="Senior Counsellor" />
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
        <p role="status" className="mt-3 text-sm text-green-600">Added successfully.</p>
      )}

      <div className="mt-4">
        <SubmitButton label="Add Member" pendingLabel="Adding…" />
      </div>
    </form>
  );
}
