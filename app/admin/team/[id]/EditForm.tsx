"use client";

import { useActionState } from "react";
import Image from "next/image";
import SubmitButton from "@/components/admin/SubmitButton";
import { useUploadSizeGuard } from "@/components/admin/useUploadSizeGuard";
import { updateTeamMember } from "@/lib/actions/team";
import type { TeamMember } from "@/lib/types";

type ActionResult = Awaited<ReturnType<typeof updateTeamMember>>;

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function EditForm({ member }: { member: TeamMember }) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateTeamMember,
    null,
  );
  const photo = useUploadSizeGuard();

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-lg">
      <input type="hidden" name="id" value={member.id} />

      <div className="flex items-center gap-4">
        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-sky shrink-0">
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label htmlFor="photo" className={LABEL}>
            Replace photo (optional · JPEG, PNG, WebP · max 4 MB)
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={photo.onChange}
            className="text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-brand file:text-paper file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-ink file:transition-colors"
          />
          {photo.error && (
            <p role="alert" className="text-xs text-red-600">{photo.error}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={LABEL}>Name</label>
        <input id="name" name="name" type="text" required defaultValue={member.name} className={FIELD} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={LABEL}>Title</label>
        <input id="title" name="title" type="text" required defaultValue={member.title} className={FIELD} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sort_order" className={LABEL}>Sort order</label>
        <input id="sort_order" name="sort_order" type="number" min={0} defaultValue={member.sort_order} className={FIELD} />
      </div>

      {state !== null && !state.ok && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p role="status" className="text-sm text-green-600">Saved.</p>
      )}

      <SubmitButton label="Save Changes" pendingLabel="Saving…" disabled={photo.tooBig} />
    </form>
  );
}
