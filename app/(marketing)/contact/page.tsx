import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";

const SOCIALS = [
  { src: "/fb.svg", label: "Facebook", href: "https://www.facebook.com/nayan.education" },
  { src: "/insta.svg", label: "Instagram", href: "https://www.instagram.com/nayaneducational" },
  { src: "/tiktok.svg", label: "TikTok", href: "https://www.tiktok.com/@nayaneducation" },
] as const;

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Book a free counselling session or send us a message. Nayan Educational Consultancy, Kathmandu, Nepal.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Get in Touch
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-4 leading-tight">
            We&apos;d love to hear from you.
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            Book a free 30-minute counselling session, or just send us a message.
            Our team responds within one business day.
          </p>
        </div>
      </section>

      <section className="bg-sky py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div className="bg-paper rounded-xl p-8 border border-sand">
            <h2 className="font-display text-h3 font-semibold text-ink mb-6">
              Send a Message
            </h2>
            <ContactForm />
          </div>

          {/* Map + contact details */}
          <div className="flex flex-col gap-8">
            {/* Google Maps embed
                Replace the src value below with your own Google Maps embed URL:
                Maps → Share → Embed a map → copy the src attribute from the iframe
            */}
            <div className="rounded-xl overflow-hidden border border-sand aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3229.350493155745!2d85.33573147508!3d27.687487676193935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1995836c22e9%3A0xfe98ece2374f1e1d!2sNAYAN%20EDUCATIONAL%20CONSULTANCY!5e1!3m2!1sen!2snp!4v1781427898188!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nayan Educational Consultancy location"
              />
            </div>

            {/* Contact details */}
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Address
                </p>
                <p className="text-ink">
                  Minbhawan, Kathmandu, Nepal
                  <br />
                  <span className="text-slate">Near Civil Hospital</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Phone
                </p>
                <div className="flex flex-col gap-1">
                  <a href="tel:+97714797183" className="text-brand hover:underline">
                    +977-1-4797183
                  </a>
                  <a href="tel:+97714794328" className="text-brand hover:underline">
                    +977-1-4794328
                  </a>
                  <a
                    href="https://wa.me/9779763424429"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand hover:underline"
                    aria-label="WhatsApp 9763424429"
                  >
                    <span
                      className="block h-[18px] w-[18px]"
                      style={{
                        backgroundColor: "currentColor",
                        WebkitMaskImage: "url(/whatsapp.svg)",
                        maskImage: "url(/whatsapp.svg)",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                      }}
                      aria-hidden="true"
                    />
                    9763424429
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Email
                </p>
                <a
                  href="mailto:info@nayanedu.com"
                  className="text-brand hover:underline"
                >
                  info@nayanedu.com
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Website
                </p>
                <a
                  href="https://www.nayanedu.com"
                  className="text-brand hover:underline"
                >
                  www.nayanedu.com
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Office Hours
                </p>
                <p className="text-ink">Sun – Fri: 8:00 AM – 5:00 PM NPT</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
                  Follow Us On
                </p>
                <div className="flex items-center gap-3" role="list" aria-label="Social media links">
                  {SOCIALS.map(({ src, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="listitem"
                      aria-label={label}
                      className="text-brand hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                    >
                      <span
                        className="block h-7 w-7"
                        style={{
                          backgroundColor: "currentColor",
                          WebkitMaskImage: `url(${src})`,
                          maskImage: `url(${src})`,
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                        }}
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
