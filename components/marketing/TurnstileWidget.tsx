"use client";

import Script from "next/script";
import { useRef, useEffect } from "react";
import { env } from "@/env";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback": () => void;
          "expired-callback": () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        },
      ) => string;
      reset: (id: string) => void;
    };
  }
}

type Props = {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
};

export default function TurnstileWidget({ onVerify, onExpire, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  function mount() {
    if (!containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current) return; // already mounted
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
      callback: onVerify,
      "expired-callback": onExpire,
      "error-callback": onError,
      theme: "light",
      size: "normal",
    });
  }

  useEffect(() => {
    // If turnstile loaded before the component, mount immediately
    if (window.turnstile) mount();
    // Otherwise wait for the onLoad callback on the Script component
  });

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={mount}
      />
      <div ref={containerRef} />
    </>
  );
}
