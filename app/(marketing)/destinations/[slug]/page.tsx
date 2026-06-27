import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DESTINATIONS, getDestination } from "@/lib/destinations";
import Flag from "@/components/marketing/Flag";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) return {};
  return {
    title: `Study in ${dest.name}`,
    description: dest.description,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = getDestination(slug);
  if (!dest) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.nayanedu.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Destinations",
        item: "https://www.nayanedu.com/destinations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Study in ${dest.name}`,
        item: `https://www.nayanedu.com/destinations/${dest.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero — photo background with overlay */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Background image or gradient */}
        {dest.image ? (
          <Image
            src={dest.image}
            alt={`Study in ${dest.name}`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0c2a44 0%, #004f84 100%)",
            }}
          />
        )}
        {/* Dark scrim for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(12,42,68,0.95) 0%, rgba(12,42,68,0.7) 55%, rgba(12,42,68,0.5) 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm text-paper/80 hover:text-paper transition-colors mb-8"
          >
            <ArrowLeft size={15} /> All destinations
          </Link>
          <div className="flex items-center gap-5 mb-6">
            <Flag
              code={dest.code}
              name={dest.name}
              className="h-12 w-auto rounded shadow-md ring-1 ring-white/30"
            />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "#ffba4d" }}
              >
                Study Abroad
              </p>
              <h1
                className="font-display text-h1 font-semibold leading-tight"
                style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
              >
                Study in {dest.name}
              </h1>
            </div>
          </div>
          <p className="text-paper/90 text-lg leading-relaxed max-w-2xl">
            {dest.description}
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-sky py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-h2 font-semibold text-ink mb-8">
            Why {dest.name}?
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {dest.highlights.map((h) => (
              <div key={h} className="bg-paper rounded-xl p-5 border border-sand">
                <div className="w-6 h-0.5 bg-brass mb-3" />
                <p className="font-medium text-ink text-sm">{h}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-ink rounded-xl p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-paper mb-3">
              Interested in studying in {dest.name}?
            </h3>
            <p className="text-paper/70 text-sm mb-6">
              Book a free session with our {dest.name} specialist.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-md bg-brass text-paper font-medium hover:bg-paper hover:text-ink transition-colors text-sm"
            >
              Book a Free Counselling Session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
