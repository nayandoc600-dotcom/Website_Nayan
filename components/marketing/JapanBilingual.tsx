"use client";

import { useState } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Flag from "./Flag";
import type enMessages from "@/messages/en.json";

type Messages = typeof enMessages;

type Locale = "en" | "ja";

function JapanContent({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
}) {
  const t = useTranslations("japan");

  const highlights = t.raw("why.highlights") as Array<{
    title: string;
    body: string;
  }>;

  return (
    <>
      {/* Hero — photo background with overlay */}
      <section className="relative px-6 py-20 overflow-hidden">
        <Image
          src="/japan.jpg"
          alt="Study in Japan"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(12,42,68,0.95) 0%, rgba(12,42,68,0.7) 55%, rgba(12,42,68,0.5) 100%)",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Top row: back link + language toggle */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-sm text-paper/80 hover:text-paper transition-colors"
            >
              <ArrowLeft size={15} /> All destinations
            </Link>
            <div className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-sm p-1 text-xs">
              <button
                onClick={() => onLocaleChange("en")}
                lang="en"
                aria-label="Switch to English"
                className={`px-3 py-1 rounded-full transition-colors ${
                  locale === "en"
                    ? "bg-paper text-ink font-medium"
                    : "text-paper/90 hover:bg-white/10"
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLocaleChange("ja")}
                lang="ja"
                aria-label="Switch to Japanese"
                className={`px-3 py-1 rounded-full transition-colors ${
                  locale === "ja"
                    ? "bg-paper text-ink font-medium"
                    : "text-paper/90 hover:bg-white/10"
                }`}
              >
                日本語
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 mb-6">
            <Flag
              code="jp"
              name="Japan"
              className="h-12 w-auto rounded shadow-md ring-1 ring-white/30"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                {t("hero.label")}
              </p>
              <h1
                className="font-display text-h1 font-semibold leading-tight"
                style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
              >
                {t("hero.heading")}
              </h1>
            </div>
          </div>
          <p className="text-paper/90 text-lg leading-relaxed max-w-2xl">
            {t("hero.body")}
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-sky py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-h2 font-semibold text-ink mb-8">
            {t("why.heading")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="bg-paper rounded-xl p-5 border border-sand"
              >
                <div className="w-6 h-0.5 bg-brass mb-3" />
                <p className="font-semibold text-ink text-sm mb-1.5">{h.title}</p>
                <p className="text-slate text-xs leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-ink rounded-xl p-8 text-center">
            <h3 className="font-display text-xl font-semibold text-paper mb-3">
              {t("cta.heading")}
            </h3>
            <p className="text-paper/70 text-sm mb-6">{t("cta.body")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-md bg-brass text-paper font-medium hover:bg-paper hover:text-ink transition-colors text-sm"
            >
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

type Props = {
  enMessages: Messages;
  jaMessages: Messages;
};

export default function JapanBilingual({ enMessages, jaMessages }: Props) {
  const [locale, setLocale] = useState<Locale>("en");
  const messages = locale === "en" ? enMessages : jaMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JapanContent locale={locale} onLocaleChange={setLocale} />
    </NextIntlClientProvider>
  );
}
