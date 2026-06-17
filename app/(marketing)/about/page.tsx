import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Nayan Educational Consultancy — 18 years helping Nepali students achieve their study-abroad goals with clarity and confidence.",
};

const VALUES = [
  {
    title: "Clarity",
    body: "We demystify the study-abroad process — from shortlisting courses to understanding visa timelines — so students make informed decisions, not anxious ones.",
  },
  {
    title: "Honesty",
    body: "We recommend the path that is right for the student, not the one that earns us more. If a destination isn't the right fit, we say so.",
  },
  {
    title: "Care",
    body: "Our counsellors are with students from the first query to the day they land abroad. We answer late-night messages and celebrate every approval.",
  },
] as const;

const TEAM = [
  {
    name: "Prakash Adhikari",
    role: "Founder & Lead Counsellor",
    bio: "18 years in international education. Former student advisor at Tribhuvan University. Placed students in 25+ countries.",
  },
  {
    name: "Sunita Tamang",
    role: "Senior Visa Specialist",
    bio: "Expert in UK, Australia, and Canada visa procedures. 99% first-attempt visa approval rate over 10 years.",
  },
  {
    name: "Rajesh Shrestha",
    role: "Japan Programme Head",
    bio: "Japanese language instructor and MEXT scholarship alumnus. Leads our dedicated Japan intake each year.",
  },
  {
    name: "Anuj Shrestha",
    role: "Japan Programme Head",
    bio: "Japanese language instructor and MEXT scholarship alumnus. Leads our dedicated Japan intake each year.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper py-20 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Our Story
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-5 leading-tight">
            Helping students see <em>clearly</em> since 2006.
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            Nayan — meaning <em>eye</em> — was founded on a simple belief: every
            student deserves honest, personalised guidance on studying abroad.
            Not a sales pitch. Not a one-size-fits-all package. A clear view of
            their future.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sky py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-h2 font-semibold text-ink mb-10 text-center">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map(({ title, body }) => (
              <div key={title} className="bg-paper rounded-xl p-7">
                <div className="w-8 h-0.5 bg-brass mb-5" />
                <h3 className="font-display font-semibold text-h3 text-ink mb-3">
                  {title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-paper py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
              The People Behind Nayan
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink">
              Meet Our Team
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TEAM.map(({ name, role, bio }) => (
              <div key={name} className="border-t-2 border-brass pt-6">
                <div className="w-16 h-16 rounded-full bg-sand mb-4 flex items-center justify-center">
                  <span className="font-display text-xl text-brass font-semibold">
                    {name[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-ink">{name}</h3>
                <p className="text-xs text-brass font-medium uppercase tracking-wide mt-0.5 mb-3">
                  {role}
                </p>
                <p className="text-slate text-sm leading-relaxed">{bio}</p>
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
    </>
  );
}
