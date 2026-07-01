"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import { DESTINATIONS } from "@/lib/destinations";
import TurnstileWidget from "./TurnstileWidget";

const INITIAL: ContactState = { status: "idle" };

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, INITIAL);
  const [turnstileToken, setTurnstileToken] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="font-display text-h3 font-semibold text-ink mb-2">
          Message received!
        </p>
        <p className="text-slate text-sm">
          Thank you for reaching out. A counsellor will get back to you within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-5">
      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className={LABEL}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={FIELD}
            placeholder="Priya Sharma"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={LABEL}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={FIELD}
            placeholder="nayan@example.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className={LABEL}>Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={FIELD}
            placeholder="+977 98XXXXXXXX"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className={LABEL}>Country of Interest</label>
          <select id="country" name="country" className={FIELD}>
            <option value="">Select a country…</option>
            {DESTINATIONS.map((d) => (
              <option key={d.slug} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={LABEL}>
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${FIELD} resize-y`}
          placeholder="Tell us about your study goals, preferred intake year, any specific questions…"
        />
      </div>

      {/* Turnstile hidden token */}
      <input type="hidden" name="cf-turnstile-response" value={turnstileToken} />
      <TurnstileWidget
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
        onError={() => setTurnstileToken("")}
      />

      {/* Privacy consent */}
      <label className="flex items-start gap-3 text-sm text-slate cursor-pointer">
        <input
          type="checkbox"
          name="consented"
          required
          className="mt-0.5 accent-brand shrink-0"
        />
        <span>
          I agree to the collection and use of my personal information as described
          in the{" "}
          <a href="/privacy" className="text-brand hover:underline">
            Privacy Notice
          </a>
          . Nayan Educational Consultancy will use this data solely to respond to
          my enquiry.
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !turnstileToken}
        className="self-start rounded-md bg-brand text-paper text-sm font-medium px-6 py-3 hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
