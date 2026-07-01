import type { Metadata } from "next";
import Image from "next/image";
import { getTeamMembers } from "@/lib/data/team";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the counsellors and staff at Nayan Educational Consultancy who guide students through their study-abroad journey.",
};

export const revalidate = 3600;

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <>
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Our People
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-4 leading-tight">
            Meet Our Team
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            The counsellors and staff who guide our students from the first query
            to the day they land abroad.
          </p>
        </div>
      </section>

      <section className="bg-sky py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {members.length === 0 ? (
            <p className="text-slate text-sm text-center">
              Our team will be introduced here soon.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="bg-paper rounded-xl border border-sand overflow-hidden"
                >
                  <div className="relative aspect-[4/5] bg-sky">
                    <Image
                      src={m.photo_url}
                      alt={m.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display font-semibold text-ink">{m.name}</p>
                    <p className="text-sm text-slate mt-0.5">{m.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
