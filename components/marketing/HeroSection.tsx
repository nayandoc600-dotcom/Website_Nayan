import Link from "next/link";
import HeroSlider from "./HeroSlider";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100dvh-80px)] flex items-center overflow-hidden">
      {/* Background image slider (with navy gradient base) */}
      <HeroSlider />

      {/* Left-weighted navy scrim for WCAG AA contrast over the image */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(12,42,68,0.92) 0%, rgba(12,42,68,0.70) 45%, rgba(12,42,68,0.25) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Hero copy — all text preserved verbatim */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 w-full py-10 sm:py-16">
        {/* Eyebrow — bigger + bold */}
        <p className="text-sm sm:text-base font-bold text-brass uppercase tracking-widest mb-3 sm:mb-4">
          Study Abroad from Nepal
        </p>

        {/*
         * Inline color forces white past the globals.css `h1 { color: ink }`
         * rule (unlayered CSS beats utility classes in Tailwind v4).
         */}
        <h1
          className="font-display text-4xl sm:text-h1 md:text-5xl lg:text-6xl font-semibold leading-tight mb-4 sm:mb-6"
          style={{ color: "#ffffff" }}
        >
          <em>See your future</em>
          <br />
          clearly!
        </h1>

        <p className="text-paper/80 text-base sm:text-lg leading-relaxed max-w-md mb-8 sm:mb-10">
          Nayan Educational Consultancy helps students across Nepal navigate
          the study-abroad journey — from choosing the right country to
          landing the visa — with clarity and confidence.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Link
            href="/destinations"
            className="inline-flex items-center px-6 py-3 rounded-md bg-brand text-paper font-medium hover:bg-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            Explore Destinations
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 rounded-md border border-paper/60 text-paper font-medium hover:bg-paper/10 transition-colors backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
          >
            Talk to a Counsellor
          </Link>
        </div>
      </div>
    </section>
  );
}