import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server's HMR/JS chunks to load when the site is opened over
  // the local network (e.g. another device on Wi-Fi) instead of localhost.
  // Without this, Next.js blocks cross-origin dev resources and interactive
  // components (slider, popup ads) silently fail to hydrate.
  allowedDevOrigins: ["172.27.240.1", "192.168.*.*", "10.0.*.*"],
  // Admin file uploads (visa approvals, team/gallery images, popup media) run
  // through Server Actions, which cap the request body at 1 MB by default —
  // that silently rejected real uploads in production. Raise it to cover our
  // image uploads. (Vercel's own serverless request-body ceiling is ~4.5 MB,
  // so very large files still need a direct-to-storage flow.)
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  images: {
    // In local dev, Supabase Storage runs on 127.0.0.1 — a private IP that
    // Next.js refuses to optimize (SSRF protection). Skip optimization in dev;
    // in production Supabase is on a public *.supabase.co domain and optimizes
    // normally.
    unoptimized: process.env.NODE_ENV === "development",
    // Visa approval images are served from Supabase Storage. Allow the local
    // dev stack (127.0.0.1 / localhost :54321) and any Supabase project domain
    // in production. flagcdn flags and popup images use plain <img>, so they
    // don't need to be listed here.
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "54321",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
