import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-ink py-12 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-4">
          Begin Your Journey
        </p>
        <h2 className="font-display text-h2 md:text-4xl font-semibold text-paper mb-5 leading-tight">
          <em>Your future</em> is clearer
          <br />
          than you think.
        </h2>
        <p className="text-paper/70 leading-relaxed mb-10 max-w-sm mx-auto">
          Book a free 30-minute counselling session with one of our advisors.
          No pressure — just clarity.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-8 py-3.5 rounded-md bg-brass text-paper font-medium hover:bg-paper hover:text-ink transition-colors text-sm"
        >
          Book a Free Session
        </Link>
      </div>
    </section>
  );
}
