import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS } from "@/lib/destinations";
import Flag from "@/components/marketing/Flag";

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
              className="group block bg-paper rounded-xl border border-sand overflow-hidden hover:border-brand hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              {/* Photo header */}
              <div className="relative h-40 overflow-hidden">
                {dest.image ? (
                  <Image
                    src={dest.image}
                    alt={`Study in ${dest.name}`}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #0c2a44 0%, #004f84 100%)",
                    }}
                  />
                )}
                {/* Legibility scrim */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(12,42,68,0.9) 0%, rgba(12,42,68,0.35) 45%, rgba(12,42,68,0.1) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4">
                  <Flag code={dest.code} className="h-5 w-auto rounded-sm shadow" />
                  <h2
                    className="font-display text-lg font-semibold"
                    style={{
                      color: "#ffffff",
                      textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                    }}
                  >
                    {dest.name}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-slate text-sm leading-relaxed">
                  {dest.tagline}
                </p>
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
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
