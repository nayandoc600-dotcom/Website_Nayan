import type { Metadata } from "next";
import Link from "next/link";
import { getTeamMembers } from "@/lib/data/team";
import { getGalleryPhotos } from "@/lib/data/gallery";
import TeamSection from "@/components/marketing/TeamSection";
import GallerySection from "@/components/marketing/GallerySection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nayan Educational Consultancy — established 2014 in Minbhawan, Kathmandu. Over a decade helping Nepali students study abroad with clarity and confidence.",
};

export const revalidate = 3600;

const SERVICES = [
  "Test Preparation — IELTS, PTE, Duolingo",
  "Japanese Proficiency — JLPT (N5–N1), NAT (5–1), JLCT (5–1), JPT",
  "Visa & University Interview Preparation",
  "University & College Selection Guidance",
  "Course Selection Guidance",
  "Admission & Documentation Formalities",
  "On-Spot Admission & Counselling Seminars",
  "Visa Formalities",
  "Accommodation & Travel Arrangements",
  "Pre-Departure Briefing & Training",
  "Part-Time Work Guidance",
] as const;

export default async function AboutPage() {
  const [team, gallery] = await Promise.all([
    getTeamMembers(),
    getGalleryPhotos(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-paper py-20 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Our Story
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-5 leading-tight">
            Helping students see <em>clearly</em> since 2014.
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            From a small and humble beginning in 2014, Nayan Educational
            Consultancy has grown — through hard work and perseverance — into one
            of the most referred and preferred consultancies in Kathmandu, based
            in the central locality of Minbhawan. We were founded on a simple
            belief: every student deserves honest, personalised guidance on
            studying abroad — not a sales pitch, but a clear view of their future.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-paper py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
              How We Help
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink">
              Our Services
            </h2>
            <p className="text-slate text-sm leading-relaxed mt-3 max-w-2xl">
              From your first counselling session to the day you land abroad, we
              support every step — language preparation, applications, visas, and
              settling in.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((service) => (
              <div
                key={service}
                className="flex items-start gap-3 bg-sky rounded-xl p-5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brass mt-2 shrink-0" />
                <p className="text-ink text-sm leading-relaxed">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sand py-16 px-6 text-center">
        <h2 className="font-display text-h2 font-semibold text-ink mb-4">
          Ready to start your journey?
        </h2>
        <p className="text-slate mb-8 max-w-sm mx-auto">
          Talk to one of our counsellors — no commitment, just clarity.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 rounded-md bg-brand text-paper font-medium hover:bg-ink transition-colors text-sm"
        >
          Get in Touch
        </Link>
      </section>

      {/* Team + Gallery */}
      <TeamSection members={team} />
      <GallerySection photos={gallery} />
    </>
  );
}
