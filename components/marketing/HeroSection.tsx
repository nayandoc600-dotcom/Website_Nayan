import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-paper py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <div>
          <p className="text-sm font-medium text-brass uppercase tracking-widest mb-4">
            Study Abroad from Nepal
          </p>
          <h1 className="font-display text-h1 md:text-5xl lg:text-6xl font-semibold text-ink leading-tight mb-6">
            <em>See your future</em>
            <br />
            clearly.
          </h1>
          <p className="text-slate text-lg leading-relaxed max-w-md mb-10">
            Nayan Educational Consultancy helps students across Nepal navigate
            the study-abroad journey — from choosing the right country to
            landing the visa — with clarity and confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/destinations"
              className="inline-flex items-center px-6 py-3 rounded-md bg-brand text-paper font-medium hover:bg-ink transition-colors"
            >
              Explore Destinations
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-md border border-ink text-ink font-medium hover:bg-sky transition-colors"
            >
              Talk to a Counsellor
            </Link>
          </div>
        </div>

        {/* Visual — decorative block */}
        <div className="hidden md:flex justify-center">
          <div className="relative w-80 h-80">
            {/* Layered rectangles suggesting a journey / wave */}
            <div className="absolute inset-0 rounded-2xl bg-sky" />
            <div className="absolute inset-6 rounded-2xl bg-sand" />
            <div className="absolute inset-12 rounded-2xl bg-brand/10 flex items-center justify-center">
              <span className="font-display italic text-5xl text-brand/30 select-none">
                नयन
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
