"use client";

import { useActionState } from "react";
import { submitTestimonial, type TestimonialSubmitState } from "@/lib/actions/testimonials";

const INITIAL: TestimonialSubmitState = { status: "idle" };

const FIELD =
  "w-full rounded-lg border border-sand bg-paper px-4 py-3 text-sm text-ink placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand transition-colors duration-150";

const LABEL = "block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5";

export default function TestimonialSubmitForm() {
  const [state, action, pending] = useActionState(submitTestimonial, INITIAL);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <p className="font-display text-xl font-semibold text-ink mb-2">
          Thank you!
        </p>
        <p className="text-slate text-sm">
          Your feedback has been received. It will appear here once reviewed by our team.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sand bg-white shadow-sm p-8">
      <form action={action} className="flex flex-col gap-5">
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
          <div>
            <label htmlFor="t-name" className={LABEL}>
              Your Name{" "}
              <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="t-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className={FIELD}
              placeholder="Priya Sharma"
            />
          </div>
          <div>
            <label htmlFor="t-role" className={LABEL}>
              Programme & Destination
            </label>
            <input
              id="t-role"
              name="role"
              type="text"
              className={FIELD}
              placeholder="BSc Computer Science · Japan, 2024"
            />
          </div>
        </div>

        <div>
          <label htmlFor="t-body" className={LABEL}>
            Your Experience{" "}
            <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <textarea
            id="t-body"
            name="body"
            rows={4}
            required
            className={`${FIELD} resize-y`}
            placeholder="Tell us about your experience studying abroad and how Nayan helped you get there…"
          />
        </div>

        {state.status === "error" && (
          <p
            role="alert"
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-lg bg-brand text-paper text-sm font-semibold px-7 py-3 shadow-sm hover:bg-ink hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-sm"
        >
          {pending ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
