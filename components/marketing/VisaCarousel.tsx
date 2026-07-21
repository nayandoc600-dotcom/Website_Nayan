"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VisaApproval } from "@/lib/types";

export default function VisaCarousel({ approvals }: { approvals: VisaApproval[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + approvals.length) % approvals.length),
    [approvals.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % approvals.length),
    [approvals.length],
  );

  // Auto-advance unless paused or user prefers reduced motion
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced) return;
    timerRef.current = setInterval(next, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next]);

  const current = approvals[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-sky">
        <Image
          src={current.image_url}
          alt={current.student ? `Visa approval — ${current.student}` : "Visa approval"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {current.student && (
          <div className="absolute bottom-0 inset-x-0 bg-ink/70 backdrop-blur-sm px-5 py-3 text-paper text-base font-medium text-center">
            {current.student}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={prev}
          aria-label="Previous visa approval"
          className="p-2 rounded-full border border-sand hover:bg-sky transition-colors text-slate hover:text-ink"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex gap-2" role="tablist" aria-label="Visa approval slides">
          {approvals.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "w-2 h-2 rounded-full transition-colors",
                i === index ? "bg-brand" : "bg-sand hover:bg-slate",
              ].join(" ")}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next visa approval"
          className="p-2 rounded-full border border-sand hover:bg-sky transition-colors text-slate hover:text-ink"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
