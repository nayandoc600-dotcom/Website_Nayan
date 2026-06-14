import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedNewsPosts } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "News & Announcements",
  description:
    "Latest news, intake announcements, and updates from Nayan Educational Consultancy.",
};

export const revalidate = 3600;

export default async function NewsPage() {
  const posts = await getPublishedNewsPosts();

  return (
    <>
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Updates
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink leading-tight">
            News & Announcements
          </h1>
        </div>
      </section>

      <section className="bg-sky py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-slate text-sm">No announcements yet — check back soon.</p>
          ) : (
            <ol className="flex flex-col gap-6">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/news/${post.slug}`}
                    className="group block bg-paper rounded-xl border border-sand p-6 hover:border-brand transition-colors"
                  >
                    <time
                      dateTime={post.published_at ?? post.created_at}
                      className="text-xs text-slate uppercase tracking-widest"
                    >
                      {new Date(
                        post.published_at ?? post.created_at,
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h2 className="font-display text-xl font-semibold text-ink mt-2 mb-2 group-hover:text-brand transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <span className="inline-block mt-4 text-xs font-semibold text-brand uppercase tracking-widest">
                      Read more →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
