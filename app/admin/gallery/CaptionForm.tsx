"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateGalleryCaption } from "@/lib/actions/gallery";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-md border border-sand text-slate text-xs font-medium px-3 py-1.5 hover:bg-paper transition-colors disabled:opacity-50"
    >
      {pending ? "…" : "Save"}
    </button>
  );
}

export default function CaptionForm({
  id,
  caption,
}: {
  id: string;
  caption: string | null;
}) {
  const [state, formAction] = useActionState(updateGalleryCaption, null);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        name="caption"
        type="text"
        defaultValue={caption ?? ""}
        maxLength={200}
        placeholder="Add a caption…"
        className="flex-1 min-w-0 rounded-md border border-sand bg-paper px-2 py-1.5 text-xs text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      />
      <SaveButton />
      {state !== null && !state.ok && (
        <span role="alert" className="text-xs text-red-600">{state.error}</span>
      )}
      {state?.ok && (
        <span role="status" className="text-xs text-green-600">Saved</span>
      )}
    </form>
  );
}
