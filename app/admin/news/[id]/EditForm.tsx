"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import { updateNewsPost } from "@/lib/actions/news";

type ActionResult = Awaited<ReturnType<typeof updateNewsPost>>;

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function EditForm({
  id,
  post,
}: {
  id: string;
  post: { title: string; excerpt: string; body: string; published: boolean };
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateNewsPost,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-2xl">
      {/* id passed as hidden field so the action can read it from FormData */}
      <input type="hidden" name="id" value={id} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={LABEL}>Title</label>
        <input id="title" name="title" type="text" required defaultValue={post.title} className={FIELD} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="excerpt" className={LABEL}>Excerpt</label>
        <input id="excerpt" name="excerpt" type="text" required defaultValue={post.excerpt} className={FIELD} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className={LABEL}>Body</label>
        <textarea id="body" name="body" rows={10} required defaultValue={post.body} className={`${FIELD} resize-y`} />
      </div>

      <div className="flex items-center gap-3">
        <label className={LABEL}>Status</label>
        <div className="flex gap-4">
          {(["false", "true"] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
              <input
                type="radio"
                name="published"
                value={v}
                defaultChecked={String(post.published) === v}
                className="accent-brand"
              />
              {v === "true" ? "Published" : "Draft"}
            </label>
          ))}
        </div>
      </div>

      {state !== null && !state.ok && (
        <p role="alert" className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.ok && (
        <p role="status" className="text-sm text-green-600">Saved.</p>
      )}

      <SubmitButton label="Save Changes" pendingLabel="Saving…" />
    </form>
  );
}
