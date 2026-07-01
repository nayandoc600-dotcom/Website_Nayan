"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TeamMember } from "@/lib/types";

const INTERVAL_MS = 5000;

// How many cards are visible at each breakpoint. Drives both the card width and
// the translate step so one auto-advance moves exactly one card to the left.
function useVisibleCount(): number {
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    const sm = window.matchMedia("(min-width: 640px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setVisible(lg.matches ? 3 : sm.matches ? 2 : 1);
    update();
    sm.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      sm.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return visible;
}

export default function TeamSlider({ members }: { members: TeamMember[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const visible = useVisibleCount();
  const count = members.length;
  const maxIndex = Math.max(0, count - visible);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep the index in range when the visible count changes (resize).
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, count - visible)));
  }, [visible, count]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => {
        const next = i + dir;
        if (next < 0) return maxIndex;
        if (next > maxIndex) return 0;
        return next;
      });
    },
    [maxIndex],
  );

  // Auto-advance one card to the left every 5s (unless paused / reduced motion).
  useEffect(() => {
    if (paused || maxIndex === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, maxIndex]);

  if (count === 0) return null;
  const showControls = maxIndex > 0;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * (100 / visible)}%)`,
            transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {members.map((m) => (
            <div
              key={m.id}
              className="shrink-0 px-2"
              style={{ width: `${100 / visible}%` }}
            >
              <div className="bg-paper rounded-xl border border-sand overflow-hidden h-full">
                <div className="relative aspect-[4/5] bg-sky">
                  <Image
                    src={m.photo_url}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-ink">{m.name}</p>
                  <p className="text-sm text-slate mt-0.5">{m.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous team members"
            className="p-2 rounded-full border border-sand hover:bg-sky transition-colors text-slate hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next team members"
            className="p-2 rounded-full border border-sand hover:bg-sky transition-colors text-slate hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
