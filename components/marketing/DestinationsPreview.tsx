"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DESTINATIONS } from "@/lib/destinations";

/*
 * The exact 6 destinations to show on the homepage, in order.
 * (Explicit list so it no longer depends on the order in destinations.ts.)
 * New Zealand is included here instead of South Korea.
 */
const PREVIEW_SLUGS = [
  "japan",
  "united-kingdom",
  "australia",
  "canada",
  "usa",
  "new-zealand",
];

const PREVIEW = PREVIEW_SLUGS
  .map((slug) => DESTINATIONS.find((d) => d.slug === slug))
  .filter((d): d is (typeof DESTINATIONS)[number] => Boolean(d));

/*
 * Keys MUST match the destination `slug` exactly.
 * Filenames must match files in /public exactly (lowercase, case-sensitive).
 */
const DEST_IMAGES: Record<string, string> = {
  japan: "/japan.jpg",
  "united-kingdom": "/uk.jpg",
  australia: "/australia.jpg",
  canada: "/canada.jpg",
  usa: "/usa.jpg",
  "new-zealand": "/newzealand.jpg",
};

export default function DestinationsPreview() {
  return (
    <section className="bg-paper py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
              Where We Send Students
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink">
              Top Destinations
            </h2>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-ink transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >
            View all destinations <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREVIEW.map((dest) => {
            const photo = DEST_IMAGES[dest.slug];
            return (
              <div
                key={dest.slug}
                className="rounded-xl border border-sand bg-white overflow-hidden hover:border-brand hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                >
                  {/* Visual: photo when available, else navy gradient */}
                  <div className="relative h-44 overflow-hidden">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={`Study in ${dest.name}`}
                        fill
                        className="object-cover opacity-85 transition-transform duration-300 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

                    {/* Stronger legibility scrim so the name stays readable */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(12,42,68,0.92) 0%, rgba(12,42,68,0.45) 45%, rgba(12,42,68,0.15) 100%)",
                      }}
                    />

                    {/* Country name + flag overlay.
                        Inline color FORCES white past the globals.css
                        `h3 { color: ink }` rule that was hiding the names. */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4">
                      <span className="text-xl" role="img" aria-hidden="true">
                        {dest.flag}
                      </span>
                      <h3
                        className="font-display text-lg font-semibold"
                        style={{
                          color: "#ffffff",
                          textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                        }}
                      >
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-5">
                    <p className="text-sm text-slate leading-relaxed">
                      {dest.tagline}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                      Explore <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}