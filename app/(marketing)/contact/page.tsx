import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";

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
                <p className="text-ink">Kathmandu, Nepal</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Phone
                </p>
                <a href="tel:+97714XXXXXXX" className="text-brand hover:underline">
                  +977 1-XXXXXXX
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Email
                </p>
                <a
                  href="mailto:info@nayaneducational.com"
                  className="text-brand hover:underline"
                >
                  info@nayaneducational.com
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                  Office Hours
                </p>
                <p className="text-ink">Sun – Fri: 9:00 AM – 6:00 PM NPT</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
