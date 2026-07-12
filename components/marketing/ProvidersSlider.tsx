"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * Partner / education-provider images — must match the EXACT filenames
 * in /public. All slides share the same 16:9 aspect ratio.
 */
const PROVIDER_IMAGES = ["/1.png", "/2.png", "/3.png", "/4.png"];

const INTERVAL_MS = 5000;

export default function ProvidersSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = PROVIDER_IMAGES.length;

  // Auto-advance always runs when there's more than one image.
  const startTimer = useCallback(() => {
    if (count <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % count),
      INTERVAL_MS,
    );
  }, [count]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + count) % count);
      startTimer();
    },
    [startTimer, count],
  );

  const goTo = useCallback(
    (i: number) => {
      setIndex(i);
      startTimer();
    },
    [startTimer],
  );

  const arrowClass =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full " +
    "bg-ink/40 text-white hover:bg-ink/70 active:bg-ink/90 " +
    "transition-colors duration-150 backdrop-blur-sm " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <section className="bg-paper py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-h2 font-semibold text-ink mb-8">
          OUR EDUCATION PROVIDERS
        </h2>

        <div
          className="relative aspect-video overflow-hidden rounded-2xl"
          aria-roledescription="carousel"
          aria-label="Education provider partners"
        >
          {/* Sliding track */}
          <div
            className="flex h-full w-full"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {PROVIDER_IMAGES.map((src, i) => (
              <div key={i} className="relative h-full w-full shrink-0">
                <Image
                  src={src}
                  alt={`Education provider partners — slide ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 1152px, 100vw"
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className={`${arrowClass} left-4`}
                aria-label="Previous slide"
              >
                <ChevronLeft size={22} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className={`${arrowClass} right-4`}
                aria-label="Next slide"
              >
                <ChevronRight size={22} aria-hidden="true" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {PROVIDER_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={[
                      "h-2 rounded-full transition-all duration-300",
                      i === index
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80",
                    ].join(" ")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
