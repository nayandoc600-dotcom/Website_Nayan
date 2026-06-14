import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import JapanBilingual from "@/components/marketing/JapanBilingual";
import enMessages from "@/messages/en.json";
import jaMessages from "@/messages/ja.json";

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://nayaneducational.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Destinations",
      item: "https://nayaneducational.com/destinations",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Study in Japan",
      item: "https://nayaneducational.com/destinations/japan",
    },
  ],
};

export const metadata: Metadata = {
  title: "Study in Japan",
  description:
    "World-class universities, MEXT scholarships, and a rich cultural experience await Nepali students in Japan.",
  alternates: {
    languages: {
      "ja": "/destinations/japan",
    },
  },
};

export default function JapanPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Back link */}
      <div className="bg-paper px-6 pt-8 pb-0 border-b border-transparent">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors"
          >
            <ArrowLeft size={15} /> All destinations
          </Link>
        </div>
      </div>

      <JapanBilingual enMessages={enMessages} jaMessages={jaMessages} />
    </>
  );
}
