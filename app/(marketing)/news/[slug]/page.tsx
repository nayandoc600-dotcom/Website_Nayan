import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPublishedNewsSlugs, getNewsPost } from "@/lib/data/news";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getPublishedNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  const publishedDate = new Date(
    post.published_at ?? post.created_at,
  ).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft size={15} /> All news
          </Link>
          <time
            dateTime={post.published_at ?? post.created_at}
            className="text-xs text-slate uppercase tracking-widest"
          >
            {publishedDate}
          </time>
          <h1 className="font-display text-h1 font-semibold text-ink leading-tight mt-2 mb-4">
            {post.title}
          </h1>
          <p className="text-slate text-lg leading-relaxed">{post.excerpt}</p>
        </div>
      </section>

      <section className="bg-sky py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-paper rounded-xl border border-sand p-8 prose prose-sm max-w-none text-ink leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>

          <div className="mt-10 pt-8 border-t border-sand flex items-center justify-between">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors"
            >
              <ArrowLeft size={15} /> Back to news
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-brand text-paper text-sm font-medium hover:bg-ink transition-colors"
            >
              Book a Free Session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
