"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

const INITIAL: LoginState = { status: "idle" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, INITIAL);

  return (
    <div className="w-full max-w-sm">
      <div className="bg-paper rounded-2xl border border-sand shadow-sm p-8">
        <div className="mb-8">
          <p className="font-display text-2xl font-semibold text-ink">
            <em>Nayan</em> Admin
          </p>
          <p className="text-slate text-sm mt-1">Sign in to manage content.</p>
        </div>

        <form action={action} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate uppercase tracking-wide"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="rounded-md border border-sand bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              placeholder="admin@nayanedu.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-slate uppercase tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-md border border-sand bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          {state.status === "error" && (
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-md bg-brand text-paper text-sm font-medium py-2.5 hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
