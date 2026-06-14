import Link from "next/link";
import { DESTINATIONS } from "@/lib/destinations";
import { ArrowRight } from "lucide-react";

const PREVIEW = DESTINATIONS.slice(0, 6);

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
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-ink transition-colors shrink-0"
          >
            View all destinations <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREVIEW.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group block rounded-xl border border-sand bg-paper p-6 hover:border-brand hover:shadow-sm transition-all"
            >
              <span className="text-4xl mb-4 block" role="img" aria-label={dest.name}>
                {dest.flag}
              </span>
              <h3 className="font-display font-semibold text-ink text-lg mb-1 group-hover:text-brand transition-colors">
                {dest.name}
              </h3>
              <p className="text-sm text-slate leading-relaxed">{dest.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
