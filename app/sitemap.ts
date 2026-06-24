import type { MetadataRoute } from "next";
import { DESTINATIONS } from "@/lib/destinations";

const BASE = "https://www.nayanedu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/destinations`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/study-materials`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const destinationPages: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
    url: `${BASE}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...destinationPages];
}
