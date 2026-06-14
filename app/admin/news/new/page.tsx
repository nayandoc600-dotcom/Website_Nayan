"use client";

import { useActionState } from "react";
import { createNewsPost } from "@/lib/actions/news";
import SubmitButton from "@/components/admin/SubmitButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function NewNewsPage() {
  const [state, action] = useActionState(createNewsPost, null);

  return (
    <div>
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={15} /> All posts
      </Link>

      <h1 className="font-display text-h2 font-semibold text-ink mb-8">
        New Post
      </h1>

      <form action={action} className="flex flex-col gap-5 max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className={LABEL}>Title</label>
          <input id="title" name="title" type="text" required className={FIELD} placeholder="Announcement title…" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="excerpt" className={LABEL}>Excerpt (shown in listings)</label>
          <input id="excerpt" name="excerpt" type="text" required className={FIELD} placeholder="One-sentence summary…" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="body" className={LABEL}>Body</label>
          <textarea id="body" name="body" rows={10} required className={`${FIELD} resize-y`} placeholder="Full post content…" />
        </div>

        <div className="flex items-center gap-3">
          <label className={LABEL}>Status</label>
          <div className="flex gap-4">
            {(["false", "true"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                <input type="radio" name="published" value={v} defaultChecked={v === "false"} className="accent-brand" />
                {v === "true" ? "Publish now" : "Save as draft"}
              </label>
            ))}
          </div>
        </div>

        {state !== null && !state.ok && (
          <p role="alert" className="text-sm text-red-600">{state.error}</p>
        )}

        <SubmitButton label="Save Post" pendingLabel="Saving…" />
      </form>
    </div>
  );
}
