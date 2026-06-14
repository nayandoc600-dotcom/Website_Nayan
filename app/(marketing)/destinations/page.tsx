import type { Metadata } from "next";
import Link from "next/link";
import { DESTINATIONS } from "@/lib/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Explore study-abroad destinations Nayan Educational Consultancy specialises in — Japan, UK, Australia, Canada, USA, and more.",
};

export default function DestinationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Study Abroad
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-4 leading-tight">
            Where Will You Go?
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            We guide students into universities across {DESTINATIONS.length}{" "}
            countries. Each destination has unique advantages — we help you
            find the right fit.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-sky py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group block bg-paper rounded-xl border border-sand p-6 hover:border-brand hover:shadow-sm transition-all"
            >
              <span
                className="text-5xl mb-5 block"
                role="img"
                aria-label={dest.name}
              >
                {dest.flag}
              </span>
              <h2 className="font-display font-semibold text-ink text-xl mb-1 group-hover:text-brand transition-colors">
                {dest.name}
              </h2>
              <p className="text-slate text-sm leading-relaxed">{dest.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {dest.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs px-2 py-0.5 rounded-full bg-sky text-slate border border-sand/60"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
