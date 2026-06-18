import type { Metadata } from "next";
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
      name: "Study in Japan",
      item: "https://www.nayanedu.com/destinations/japan",
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
      <JapanBilingual enMessages={enMessages} jaMessages={jaMessages} />
    </>
  );
}
