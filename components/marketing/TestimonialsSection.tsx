"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const prefersReduced = useReducedMotion();

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4500, stopOnMouseEnter: true, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    prefersReduced ? [] : [autoplayPlugin.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Pause autoplay when any element inside the carousel receives focus
  const handleFocus = useCallback(() => {
    if (prefersReduced) return;
    const plugin = emblaApi?.plugins()?.autoplay as
      | { stop?: () => void }
      | undefined;
    plugin?.stop?.();
  }, [emblaApi, prefersReduced]);

  const handleBlur = useCallback(() => {
    if (prefersReduced) return;
    const plugin = emblaApi?.plugins()?.autoplay as
      | { play?: () => void }
      | undefined;
    plugin?.play?.();
  }, [emblaApi, prefersReduced]);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-sky py-14 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section header + prev/next controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
              Student Stories
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink">
              What Our Students Say
            </h2>
          </div>
          <div
            className="flex gap-2 shrink-0"
            role="group"
            aria-label="Carousel navigation"
          >
            <button
              onClick={scrollPrev}
              className="p-2 rounded-full border border-sand bg-paper text-slate hover:text-ink hover:border-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 rounded-full border border-sand bg-paper text-slate hover:text-ink hover:border-brand transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Carousel viewport */}
        <div
          className="overflow-hidden"
          ref={emblaRef}
          aria-roledescription="carousel"
          aria-label="Student testimonials"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {/* aria-live lets screen readers announce slide changes */}
          <div
            className="flex gap-5"
            aria-live={prefersReduced ? "off" : "polite"}
            aria-atomic="false"
          >
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="flex-none w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)]"
                role="group"
                aria-roledescription="slide"
                aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
              >
                <figure className="bg-paper rounded-xl p-6 flex flex-col gap-4 h-full shadow-sm">
                  <span
                    className="font-display text-5xl text-brand/20 leading-none select-none"
                    aria-hidden="true"
                  >
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
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        {scrollSnaps.length > 1 && (
          <div
            className="flex justify-center gap-2 mt-8"
            role="group"
            aria-label="Carousel page indicators"
          >
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={[
                  "h-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  i === selectedIndex
                    ? "w-6 bg-brand"
                    : "w-2 bg-sand hover:bg-slate",
                ].join(" ")}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === selectedIndex ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
