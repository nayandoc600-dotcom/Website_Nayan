"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-sand">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-semibold text-ink tracking-tight hover:text-brand transition-colors"
          onClick={() => setOpen(false)}
        >
          <span className="italic">Nayan</span>
          <span className="text-slate font-normal"> Educational</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                "text-sm font-medium transition-colors",
                pathname === href
                  ? "text-brand"
                  : "text-slate hover:text-ink",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-md bg-brand text-paper text-sm font-medium hover:bg-ink transition-colors"
        >
          Book a Session
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-slate hover:text-ink transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          className="md:hidden border-t border-sand bg-paper px-6 py-4 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={[
                "text-sm font-medium py-1 transition-colors",
                pathname === href ? "text-brand" : "text-slate hover:text-ink",
              ].join(" ")}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-brand text-paper text-sm font-medium hover:bg-ink transition-colors mt-2"
            onClick={() => setOpen(false)}
          >
            Book a Session
          </Link>
        </nav>
      )}
    </header>
  );
}
