"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateGalleryCategory } from "@/lib/actions/gallery";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";

function Status() {
  const { pending } = useFormStatus();
  if (pending) return <span className="text-xs text-slate">Saving…</span>;
  return null;
}

export default function CategorySelect({
  id,
  category,
}: {
  id: string;
  category: string;
}) {
  const [state, formAction] = useActionState(updateGalleryCategory, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="category"
        defaultValue={category}
        onChange={() => formRef.current?.requestSubmit()}
        aria-label="Album"
        className="min-w-0 flex-1 rounded-md border border-sand bg-paper px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      >
        {GALLERY_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <Status />
      {state !== null && !state.ok && (
        <span role="alert" className="text-xs text-red-600">{state.error}</span>
      )}
      {state?.ok && (
        <span role="status" className="text-xs text-green-600">Saved</span>
      )}
    </form>
  );
}
