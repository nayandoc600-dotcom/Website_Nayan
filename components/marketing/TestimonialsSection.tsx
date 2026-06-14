import type { Testimonial } from "@/lib/types";

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-paper py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
            Student Stories
          </p>
          <h2 className="font-display text-h2 font-semibold text-ink">
            What Our Students Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="bg-sky rounded-xl p-6 flex flex-col gap-4"
            >
              {/* Quote mark */}
              <span className="font-display text-5xl text-brand/20 leading-none select-none" aria-hidden>
                "
              </span>
              <blockquote className="text-ink leading-relaxed text-sm flex-1 -mt-4">
                {t.body}
              </blockquote>
              <figcaption className="border-t border-sand pt-4">
                <p className="font-semibold text-sm text-ink">{t.name}</p>
                <p className="text-xs text-slate mt-0.5">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
