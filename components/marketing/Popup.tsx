"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { PopupNotice } from "@/lib/types";

const COOKIE_NAME = "nayan_popup_dismissed";
const COOKIE_DAYS = 7;

export default function Popup({ notice }: { notice: PopupNotice }) {
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Don't show if already dismissed this week
    if (document.cookie.includes(COOKIE_NAME)) return;
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    lastFocusRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    // Focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
      if (e.key !== "Tab") return;
      const focusable = document.getElementById("nayan-popup")
        ?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    setVisible(false);
    lastFocusRef.current?.focus();
    const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
    document.cookie = `${COOKIE_NAME}=1; path=/; expires=${expires}; SameSite=Lax`;
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      id="nayan-popup"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="w-full max-w-md bg-paper rounded-2xl shadow-xl p-8 relative">
        <button
          ref={closeRef}
          onClick={dismiss}
          aria-label="Close notice"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate hover:text-ink hover:bg-sky transition-colors"
        >
          <X size={18} />
        </button>

        {notice.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={notice.image_url}
            alt=""
            className="w-full rounded-lg mb-5 object-cover max-h-48"
            aria-hidden="true"
          />
        )}
        <div className="w-8 h-0.5 bg-brass mb-5" />
        <h2
          id="popup-title"
          className="font-display text-h3 font-semibold text-ink mb-3"
        >
          {notice.title}
        </h2>
        <p className="text-slate text-sm leading-relaxed mb-6">{notice.body}</p>

        <div className="flex gap-3">
          {notice.cta_url && notice.cta_label && (
            <Link
              href={notice.cta_url}
              onClick={dismiss}
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-brand text-paper text-sm font-medium hover:bg-ink transition-colors"
            >
              {notice.cta_label}
            </Link>
          )}
          <button
            onClick={dismiss}
            className="inline-flex items-center px-5 py-2.5 rounded-md border border-sand text-slate text-sm font-medium hover:bg-sky transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
