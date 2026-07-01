import Link from "next/link";
import Image from "next/image";
import { getAllTeamMembers } from "@/lib/data/admin-team";
import { deleteTeamMember } from "@/lib/actions/team";
import SubmitButton from "@/components/admin/SubmitButton";
import TeamUploadForm from "./TeamUploadForm";

export const dynamic = "force-dynamic";

export default async function TeamAdminPage() {
  const members = await getAllTeamMembers();

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">Team</h1>
      <p className="text-slate text-sm mb-8">{members.length} members</p>

      <TeamUploadForm />

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate mb-4">
          All Members
        </h2>
        {members.length === 0 && (
          <p className="text-sm text-slate">No team members added yet.</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-sand bg-sky p-4 flex flex-col gap-3 h-full"
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-paper">
                <Image
                  src={m.photo_url}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-ink text-sm truncate">{m.name}</p>
                <p className="text-xs text-slate truncate">{m.title}</p>
                <p className="text-xs text-slate mt-0.5">Sort: {m.sort_order}</p>
              </div>
              <div className="mt-auto flex gap-2">
                <Link
                  href={`/admin/team/${m.id}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-md border border-sand text-slate text-xs font-medium hover:bg-paper transition-colors"
                >
                  Edit
                </Link>
                <form action={deleteTeamMember.bind(null, m.id)}>
                  <SubmitButton
                    label="Delete"
                    pendingLabel="…"
                    variant="danger"
                    className="text-xs px-3 py-1.5"
                  />
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
