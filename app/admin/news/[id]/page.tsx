import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getNewsPost } from "@/lib/data/admin-news";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getNewsPost(id);
  if (!post) notFound();

  return (
    <div>
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={15} /> All posts
      </Link>

      <h1 className="font-display text-h2 font-semibold text-ink mb-8">
        Edit Post
      </h1>

      <EditForm id={id} post={post} />
    </div>
  );
}
