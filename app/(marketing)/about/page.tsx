import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  ClipboardList,
  PenLine,
  Stamp,
  MessagesSquare,
  Award,
  Home,
  PlaneTakeoff,
  Languages,
} from "lucide-react";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const SERVICES = [
  { label: "Career counselling", icon: Compass },
  { label: "University Selection", icon: GraduationCap },
  { label: "Application assistance", icon: ClipboardList },
  { label: "SOP guide", icon: PenLine },
  { label: "Visa processing support", icon: Stamp },
  { label: "Interview Preparation", icon: MessagesSquare },
  { label: "Scholarship Assistance", icon: Award },
  { label: "Accommodation Support", icon: Home },
  { label: "Pre-departure guidance", icon: PlaneTakeoff },
  { label: "IELTS and Japanese language classes", icon: Languages },
] as const;

export default async function AboutPage() {
  const [team, gallery] = await Promise.all([
    getTeamMembers(),
    getGalleryPhotos(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-paper py-20 px-6 border-b border-sand">
        <Image
          src="/about_us.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30 -z-10"
          aria-hidden
        />
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3 [text-shadow:0_1px_3px_rgba(250,248,244,0.9)]">
            Our Story
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-5 leading-tight [text-shadow:0_1px_4px_rgba(250,248,244,0.9)]">
            Helping students see <em>clearly</em> since 2014.
          </h1>
          <p className="text-ink text-lg leading-relaxed font-medium [text-shadow:0_1px_3px_rgba(250,248,244,0.9)]">
            From a small and humble beginning in 2014, Nayan Educational
            Consultancy has grown through hard work and perseverance, into one
            of the most referred and preferred consultancies in Kathmandu, based
            in the central locality of Minbhawan. We were founded on a simple
            belief, which is, every student deserves honest, personalised guidance on
            studying abroad and not a sales pitch, but a clear view of their future.
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
              support every step from language preparation, applications, visas, and
              settling in.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl border-2 border-brand bg-transparent p-5"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-brand text-paper shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden />
                </span>
                <p
                  className={`${montserrat.className} text-brand text-base font-semibold leading-snug`}
                >
                  {label}
                </p>
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
