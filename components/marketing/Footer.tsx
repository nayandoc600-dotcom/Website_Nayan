import Link from "next/link";
import Image from "next/image";
import { Globe, MessageCircle, Rss, Mail, Phone, MapPin } from "lucide-react";

const PAGES = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Destinations", href: "/destinations" },
  { label: "Contact", href: "/contact" },
];

const RESOURCES = [
  { label: "Study Materials", href: "/study-materials" },
  { label: "Visa Approvals", href: "/#visa-approvals" },
  { label: "News & Updates", href: "/news" },
];

// lucide-react v1.x removed brand icons; swap hrefs + labels when you add
// real social links (Instagram, Facebook, YouTube, etc.)
const SOCIALS = [
  { Icon: Globe, label: "Website", href: "#" },
  { Icon: MessageCircle, label: "Facebook", href: "#" },
  { Icon: Rss, label: "YouTube", href: "#" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80">
      {/* ── Tagline banner ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2 text-center">
        <p className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-paper leading-tight">
          A Decade Long Quest <em>For Excellence</em>
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">

        {/* ── Brand block ───────────────────────────────────────────────── */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" aria-label="Nayan Educational Consultancy — home" className="inline-flex mb-3">
            <span className="bg-paper/90 rounded-md px-2 py-1 inline-flex">
              <Image
                src="/logo.jpeg"
                alt="Nayan Educational Consultancy"
                width={90}
                height={30}
                className="h-7 w-auto object-contain"
              />
            </span>
          </Link>

          <p className="text-sm leading-relaxed mb-3 max-w-xs">
            Helping students in Nepal see their future clearly — and reach it.
            Study abroad with confidence.
          </p>

          <address className="not-italic space-y-1 text-sm text-paper/60 mb-3">
            <p className="flex items-start gap-2">
              <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
              Kathmandu, Nepal
            </p>
            <p className="flex items-center gap-2">
              <Phone size={13} className="shrink-0" aria-hidden="true" />
              <a href="tel:+97714XXXXXXX" className="hover:text-paper transition-colors">
                +977 1-XXXXXXX
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={13} className="shrink-0" aria-hidden="true" />
              <a href="mailto:info@nayaneducational.com" className="hover:text-paper transition-colors">
                info@nayaneducational.com
              </a>
            </p>
          </address>

          {/* Social icons */}
          <div className="flex gap-1.5" role="list" aria-label="Social media links">
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                role="listitem"
                aria-label={label}
                className="p-1.5 rounded-md text-paper/50 hover:text-paper hover:bg-paper/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Pages ──────────────────────────────────────────────────────── */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-paper/40 mb-3">
            Pages
          </h3>
          <ul className="space-y-2">
            {PAGES.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded-sm"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Resources ──────────────────────────────────────────────────── */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-paper/40 mb-3">
            Resources
          </h3>
          <ul className="space-y-2">
            {RESOURCES.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded-sm"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── CTA block ──────────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-paper/40 mb-3">
            Begin Your Journey
          </h3>
          <p className="text-sm text-paper/60 leading-relaxed mb-4">
            A free 30-minute counselling session with one of our advisors.
            No pressure — just clarity.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-brass text-paper text-sm font-semibold hover:bg-paper hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            Book a Free Session
          </Link>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-paper/10">
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-paper/40">
          <p>© {new Date().getFullYear()} Nayan Educational Consultancy. All rights reserved.</p>
          <p>Kathmandu, Nepal · Built with care</p>
        </div>
      </div>
    </footer>
  );
}
