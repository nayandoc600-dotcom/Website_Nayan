import Link from "next/link";

const LINKS = {
  Pages: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Destinations", href: "/destinations" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Study Materials", href: "/study-materials" },
    { label: "Visa Approvals", href: "/#visa-approvals" },
    { label: "News & Updates", href: "/news" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <p className="font-display text-2xl text-paper font-semibold mb-3">
            <span className="italic">Nayan</span> Educational
          </p>
          <p className="text-sm leading-relaxed max-w-xs">
            Helping students in Nepal see their future clearly — and reach it.
            Study abroad with confidence.
          </p>
          <address className="not-italic mt-6 text-sm space-y-1 text-paper/60">
            <p>Kathmandu, Nepal</p>
            <p>
              <a href="tel:+97714XXXXXXX" className="hover:text-paper transition-colors">
                +977 1-XXXXXXX
              </a>
            </p>
            <p>
              <a href="mailto:info@nayaneducational.com" className="hover:text-paper transition-colors">
                info@nayaneducational.com
              </a>
            </p>
          </address>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-paper/40 mb-4">
              {group}
            </h3>
            <ul className="space-y-2">
              {items.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm hover:text-paper transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-paper/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-paper/40">
          <p>© {new Date().getFullYear()} Nayan Educational Consultancy. All rights reserved.</p>
          <p>Kathmandu, Nepal</p>
        </div>
      </div>
    </footer>
  );
}
