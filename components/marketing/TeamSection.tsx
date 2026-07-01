import Link from "next/link";
import type { TeamMember } from "@/lib/types";
import TeamSlider from "./TeamSlider";

export default function TeamSection({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <section className="bg-paper py-20 px-6 border-t border-sand">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
              Our People
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink">
              Meet Our Team
            </h2>
          </div>
          <Link
            href="/team"
            className="text-sm font-medium text-brand hover:underline shrink-0"
          >
            See all
          </Link>
        </div>
        <TeamSlider members={members} />
      </div>
    </section>
  );
}
