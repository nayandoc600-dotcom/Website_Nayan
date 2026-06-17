"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // ── Esc closes the mobile menu ───────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // ── Focus trap for mobile menu ───────────────────────────────────────────
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !navRef.current) return;
    const focusable = navRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", trapFocus);
      requestAnimationFrame(() => {
        navRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
      });
    } else {
      document.removeEventListener("keydown", trapFocus);
    }
    return () => document.removeEventListener("keydown", trapFocus);
  }, [open, trapFocus]);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const linkBase =
    "relative text-sm font-medium transition-colors duration-[180ms] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded-sm";

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-sand shadow-sm">
      <div className="max-w-6xl mx-auto pl-2 pr-6 h-[80px] flex items-center justify-between">

        {/* ── LEFT: logo only ──────────────────────────────────────────── */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded-sm"
          aria-label="Nayan Educational Consultancy — home"
        >
          <Image
            src="/main-logo.png"
            alt="Nayan Educational"
            width={150}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── RIGHT: nav links + CTA + mobile button ───────────────────── */}
        <div className="flex items-center gap-7">
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    linkBase,
                    active ? "text-brand" : "text-slate hover:text-ink",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                  <span
                    className={[
                      "absolute -bottom-1 left-0 h-0.5 bg-brass transition-all duration-[180ms] ease-out",
                      active ? "w-full" : "w-0 group-hover:w-full",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Smaller booking button */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center px-3.5 py-1.5 rounded-md bg-brand text-white text-[13px] font-medium hover:bg-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Book a Session
          </Link>

          <button
            ref={toggleRef}
            className="md:hidden p-2 rounded-md text-slate hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile nav panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            ref={navRef}
            role="navigation"
            aria-label="Mobile navigation"
            initial={prefersReduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="md:hidden border-t border-sand bg-white px-6 py-4 flex flex-col gap-3 shadow-md"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={[
                  "text-sm font-medium py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm",
                  pathname === href ? "text-brand" : "text-slate hover:text-ink",
                ].join(" ")}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-ink transition-colors mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              onClick={() => setOpen(false)}
            >
              Book a Session
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}