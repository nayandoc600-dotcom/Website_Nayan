"use client";

import { useState } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import Link from "next/link";
import type enMessages from "@/messages/en.json";

type Messages = typeof enMessages;

type Locale = "en" | "ja";

function JapanContent() {
  const t = useTranslations("japan");

  const highlights = t.raw("why.highlights") as Array<{
    title: string;
    body: string;
  }>;

  return (
    <>
      {/* Hero */}
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-5 mb-6">
            <span className="text-6xl" role="img" aria-label="Japan">
              🇯🇵
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-1">
                {t("hero.label")}
              </p>
              <h1 className="font-display text-h1 font-semibold text-ink leading-tight">
                {t("hero.heading")}
              </h1>
            </div>
          </div>
          <p className="text-slate text-lg leading-relaxed max-w-2xl">
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
    <>
      {/* Locale toggle bar */}
      <div className="bg-paper border-b border-sand px-6 py-2 flex justify-end">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setLocale("en")}
            className={`px-3 py-1 rounded-md transition-colors ${
              locale === "en"
                ? "bg-brand text-paper font-medium"
                : "text-slate hover:text-ink"
            }`}
            lang="en"
            aria-label="Switch to English"
          >
            English
          </button>
          <button
            onClick={() => setLocale("ja")}
            className={`px-3 py-1 rounded-md transition-colors ${
              locale === "ja"
                ? "bg-brand text-paper font-medium"
                : "text-slate hover:text-ink"
            }`}
            lang="ja"
            aria-label="Switch to Japanese"
          >
            日本語
          </button>
        </div>
      </div>

      <NextIntlClientProvider locale={locale} messages={messages}>
        <JapanContent />
      </NextIntlClientProvider>
    </>
  );
}
