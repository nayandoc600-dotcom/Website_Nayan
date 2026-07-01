import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTeamMember } from "@/lib/data/admin-team";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMember(id);
  if (!member) notFound();

  return (
    <div>
      <Link
        href="/admin/team"
        className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={15} /> All members
      </Link>

      <h1 className="font-display text-h2 font-semibold text-ink mb-8">
        Edit Member
      </h1>

      <EditForm member={member} />
    </div>
  );
}
