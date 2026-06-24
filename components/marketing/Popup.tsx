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
    // In production, don't show if the visitor dismissed it this week.
    // In development, always show so it's easy to preview while editing.
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev && document.cookie.includes(COOKIE_NAME)) return;
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
      aria-labelledby={notice.title ? "popup-title" : undefined}
      aria-label={notice.title ? undefined : "Notice"}
      id="nayan-popup"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className={`w-full ${
          notice.pdf_url ? "max-w-3xl" : notice.image_url ? "max-w-lg" : "max-w-md"
        } bg-paper rounded-2xl shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto`}
      >
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
            alt={notice.title || "Notice"}
            className="w-full h-auto rounded-lg mb-5"
          />
        )}
        {(notice.title || notice.body) && (
          <div className="w-8 h-0.5 bg-brass mb-5" />
        )}
        {notice.title && (
          <h2
            id="popup-title"
            className="font-display text-h3 font-semibold text-ink mb-3"
          >
            {notice.title}
          </h2>
        )}
        {notice.body && (
          <p className="text-slate text-sm leading-relaxed mb-6">
            {notice.body}
          </p>
        )}

        {notice.pdf_url && (
          <div className="mb-6 rounded-lg overflow-hidden border border-sand bg-white">
            <iframe
              src={`${notice.pdf_url}#toolbar=1&view=FitH`}
              title={notice.title || "Notice PDF"}
              className="w-full h-[65vh]"
            />
            <a
              href={notice.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-medium text-brand hover:text-ink py-2 border-t border-sand transition-colors"
            >
              Open PDF in a new tab
            </a>
          </div>
        )}

        {notice.cta_url && notice.cta_label && (
          <div className="flex">
            <Link
              href={notice.cta_url}
              onClick={dismiss}
              className="inline-flex items-center px-5 py-2.5 rounded-md bg-brand text-paper text-sm font-medium hover:bg-ink transition-colors"
            >
              {notice.cta_label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
