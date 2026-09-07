"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { PopupNotice } from "@/lib/types";

const COOKIE_NAME = "nayan_popups_seen";
const COOKIE_DAYS = 7;
const MAX_REMEMBERED = 40;
const FIRST_DELAY = 1800; // ms before the first popup appears
const NEXT_DELAY = 350; // breathing room between one popup and the next

/**
 * Dismissals are remembered per popup (by a short id prefix, so the cookie
 * stays small) instead of as one blanket flag. A popup the admin adds later
 * still shows to a visitor who already dismissed an earlier one.
 */
const keyOf = (id: string) => id.slice(0, 8);

function readSeen(): string[] {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`),
  );
  if (!match) return [];
  return decodeURIComponent(match[1]).split(",").filter(Boolean);
}

function rememberSeen(id: string) {
  const seen = readSeen().filter((k) => k !== keyOf(id));
  seen.push(keyOf(id));
  const value = seen.slice(-MAX_REMEMBERED).join(",");
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

export default function Popup({ notices }: { notices: PopupNotice[] }) {
  const [queue, setQueue] = useState<PopupNotice[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build the queue on mount. In production, skip popups this visitor already
  // dismissed this week; in development show them all so they are easy to
  // preview while editing.
  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const seen = isDev ? [] : readSeen();
    const pending = notices.filter((n) => !seen.includes(keyOf(n.id)));
    if (pending.length === 0) return;

    setQueue(pending);
    const timer = setTimeout(() => setVisible(true), FIRST_DELAY);
    return () => clearTimeout(timer);
  }, [notices]);

  useEffect(
    () => () => {
      if (nextTimer.current) clearTimeout(nextTimer.current);
    },
    [],
  );

  const current = visible ? queue[index] : undefined;

  const dismiss = useCallback(() => {
    const notice = queue[index];
    if (!notice) return;
    if (process.env.NODE_ENV !== "development") rememberSeen(notice.id);

    setVisible(false);

    if (index + 1 < queue.length) {
      // Reveal the next popup after a short beat, so they do not flash.
      nextTimer.current = setTimeout(() => {
        setIndex((i) => i + 1);
        setVisible(true);
      }, NEXT_DELAY);
    } else {
      lastFocusRef.current?.focus();
    }
  }, [index, queue]);

  useEffect(() => {
    if (!current) return;
    lastFocusRef.current ??= document.activeElement as HTMLElement;
    closeRef.current?.focus();

    // Focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }
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
  }, [current, dismiss]);

  if (!current) return null;

  const hasCta = Boolean(current.cta_url && current.cta_label);
  const more = index + 1 < queue.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={current.title ? "popup-title" : undefined}
      aria-label={current.title ? undefined : "Notice"}
      id="nayan-popup"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        key={current.id}
        className={`w-full ${
          current.pdf_url ? "max-w-3xl" : current.image_url ? "max-w-lg" : "max-w-md"
        } bg-paper rounded-2xl shadow-xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto`}
      >
        <button
          ref={closeRef}
          onClick={dismiss}
          aria-label={more ? "Close notice and show the next" : "Close notice"}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate hover:text-ink hover:bg-sky transition-colors"
        >
          <X size={18} />
        </button>

        {current.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.image_url}
            alt={current.title || "Notice"}
            className="w-full h-auto rounded-lg mb-5"
          />
        )}
        {(current.title || current.body) && (
          <div className="w-8 h-0.5 bg-brass mb-5" />
        )}
        {current.title && (
          <h2
            id="popup-title"
            className="font-display text-h3 font-semibold text-ink mb-3"
          >
            {current.title}
          </h2>
        )}
        {current.body && (
          <p className="text-slate text-sm leading-relaxed mb-6">
            {current.body}
          </p>
        )}

        {current.pdf_url && (
          <div className="mb-6 rounded-lg overflow-hidden border border-sand bg-white">
            <iframe
              src={`${current.pdf_url}#toolbar=1&view=FitH`}
              title={current.title || "Notice PDF"}
              className="w-full h-[65vh]"
            />
            <a
              href={current.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-medium text-brand hover:text-ink py-2 border-t border-sand transition-colors"
            >
              Open PDF in a new tab
            </a>
          </div>
        )}

        {(hasCta || queue.length > 1) && (
          <div className="flex items-center justify-between gap-4">
            {hasCta ? (
              <Link
                href={current.cta_url as string}
                onClick={dismiss}
                className="inline-flex items-center px-5 py-2.5 rounded-md bg-brand text-paper text-sm font-medium hover:bg-ink transition-colors"
              >
                {current.cta_label}
              </Link>
            ) : (
              <span />
            )}
            {queue.length > 1 && (
              <span className="text-xs text-slate shrink-0">
                {index + 1} of {queue.length}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
