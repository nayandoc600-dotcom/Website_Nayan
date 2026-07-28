"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
 * List your photos here — they must match the EXACT filenames in /public.
 * If your files are named differently, change these to match.
 * Any orientation works (object-cover fills + crops). Do NOT use the logo.
 */
const HERO_IMAGES = [
  "/bg1.jpg",
  "/bg2.jpg",
  "/office-1.jpg",
  "/office-2.jpg",
  "/office-3.jpg",
];

const INTERVAL_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = HERO_IMAGES.length;

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
    <>
      {/* Image track (decorative — aria-hidden) */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Navy gradient base — images still loading never flash white */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0c2a44 0%, #004f84 100%)" }}
        />

        {/* Sliding track — always animates the slide */}
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {HERO_IMAGES.map((src, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
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

          {/* Dot indicators — centered on mobile, aligned under the (left-
              aligned) hero copy on desktop so they don't collide with the CTAs. */}
          <div className="absolute bottom-6 inset-x-0 z-30">
            <div className="max-w-6xl mx-auto px-6 flex justify-center md:justify-start gap-2">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={[
                    "h-2 rounded-full transition-all duration-300",
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}