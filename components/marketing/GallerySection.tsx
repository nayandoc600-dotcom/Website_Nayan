import Link from "next/link";
import type { GalleryPhoto } from "@/lib/types";
import GallerySlider from "./GallerySlider";

export default function GallerySection({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="bg-sky py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
              Moments
            </p>
            <h2 className="font-display text-h2 font-semibold text-ink">
              Our Gallery
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-medium text-brand hover:underline shrink-0"
          >
            See all
          </Link>
        </div>
        <GallerySlider photos={photos} />
      </div>
    </section>
  );
}
