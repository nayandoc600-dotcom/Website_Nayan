import { getRecentVisaApprovals } from "@/lib/data/visa-approvals";
import { getApprovedTestimonials } from "@/lib/data/testimonials";
import { DESTINATIONS } from "@/lib/destinations";
import HeroSection from "@/components/marketing/HeroSection";
import StatsSection from "@/components/marketing/StatsSection";
import DestinationsPreview from "@/components/marketing/DestinationsPreview";
import VisaApprovalsSection from "@/components/marketing/VisaApprovalsSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import TestimonialSubmitForm from "@/components/marketing/TestimonialSubmitForm";
import CtaSection from "@/components/marketing/CtaSection";

export const revalidate = 3600;

const destinationsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Study Abroad Destinations",
  itemListElement: DESTINATIONS.map((d, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `Study in ${d.name}`,
    url: `https://nayaneducational.com/destinations/${d.slug}`,
  })),
};

export default async function HomePage() {
  const [visaApprovals, testimonials] = await Promise.all([
    getRecentVisaApprovals(),
    getApprovedTestimonials(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationsJsonLd) }}
      />
      <HeroSection />
      <StatsSection />
      <DestinationsPreview />
      <VisaApprovalsSection approvals={visaApprovals} />
      <TestimonialsSection testimonials={testimonials} />

      {/* Student feedback submission */}
      <section className="bg-sky py-24 px-6 border-t border-sand">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Share Your Story
          </p>
          <h2 className="font-display text-h2 font-semibold text-ink mb-3">
            Studied abroad with us?
          </h2>
          <p className="text-slate leading-relaxed mb-10">
            We&apos;d love to hear about your experience. All submissions are reviewed
            before appearing publicly.
          </p>
          <TestimonialSubmitForm />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
