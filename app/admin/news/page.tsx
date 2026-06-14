import Link from "next/link";
import { getAllNewsPosts } from "@/lib/data/admin-news";
import { deleteNewsPost } from "@/lib/actions/news";
import SubmitButton from "@/components/admin/SubmitButton";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsAdminPage() {
  const posts = await getAllNewsPosts();
  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-h2 font-semibold text-ink mb-1">
            News Posts
          </h1>
          <p className="text-slate text-sm">
            {published.length} published · {drafts.length} draft
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-paper text-sm font-medium hover:bg-ink transition-colors"
        >
          <Plus size={16} aria-hidden /> New Post
        </Link>
      </div>

      {posts.length === 0 && (
        <p className="text-sm text-slate">No posts yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-sand bg-sky p-5 flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={[
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-sand text-slate",
                  ].join(" ")}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-slate">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="font-semibold text-ink text-sm">{post.title}</p>
              <p className="text-xs text-slate line-clamp-1 mt-0.5">
                {post.excerpt}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/news/${post.id}`}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-sand text-slate text-xs font-medium hover:bg-paper transition-colors"
              >
                Edit
              </Link>
              <form action={deleteNewsPost.bind(null, post.id)}>
                <SubmitButton label="Delete" pendingLabel="…" variant="danger" className="text-xs px-3 py-1.5" />
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
