"use client";

import { useActionState } from "react";
import { submitTestimonial, type TestimonialSubmitState } from "@/lib/actions/testimonials";

const INITIAL: TestimonialSubmitState = { status: "idle" };

const FIELD =
  "rounded-md border border-sand bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent";
const LABEL = "text-xs font-medium text-slate uppercase tracking-wide";

export default function TestimonialSubmitForm() {
  const [state, action, pending] = useActionState(submitTestimonial, INITIAL);

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
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
    <form action={action} className="flex flex-col gap-4">
      {/* Honeypot */}
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
          <label htmlFor="t-name" className={LABEL}>
            Your Name <span className="text-red-500">*</span>
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
        <div className="flex flex-col gap-1.5">
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="t-body" className={LABEL}>
          Your Experience <span className="text-red-500">*</span>
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
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-brand text-paper text-sm font-medium px-6 py-3 hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
}
