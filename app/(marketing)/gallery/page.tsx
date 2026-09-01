import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGalleryPhotos } from "@/lib/data/gallery";
import { GALLERY_CATEGORIES, isGalleryCategory } from "@/lib/gallery-categories";
import type { GalleryPhoto } from "@/lib/types";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from Nayan Educational Consultancy — Block A, Block B, visa successes, programs and events.",
};

export const revalidate = 3600;

function PhotoGrid({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((p) => (
        <figure
          key={p.id}
          className="relative aspect-[4/3] rounded-xl overflow-hidden bg-paper border border-sand"
        >
          <Image
            src={p.image_url}
            alt={p.caption ?? "Gallery photo"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {p.caption && (
            <figcaption className="absolute bottom-0 inset-x-0 bg-ink/70 backdrop-blur-sm px-3 py-2 text-paper text-xs">
              {p.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const photos = await getGalleryPhotos();

  // Only offer tabs for albums that actually contain photos.
  const presentCategories = GALLERY_CATEGORIES.filter((c) =>
    photos.some((p) => p.category === c),
  );

  const selected =
    sp.category && isGalleryCategory(sp.category) ? sp.category : null;

  const tabClass = (active: boolean) =>
    [
      "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
      active
        ? "bg-brand text-paper border-brand"
        : "bg-paper text-slate border-sand hover:text-ink hover:border-slate",
    ].join(" ");

  return (
    <>
      <section className="bg-paper py-16 px-6 border-b border-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Moments
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-4 leading-tight">
            Our Gallery
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            A look at life at Nayan — browse our albums below.
          </p>
        </div>
      </section>

      <section className="bg-sky py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {photos.length === 0 ? (
            <p className="text-slate text-sm text-center">
              Photos will be added here soon.
            </p>
          ) : (
            <>
              {/* Album tabs */}
              {presentCategories.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  <Link href="/gallery" className={tabClass(!selected)}>
                    All
                  </Link>
                  {presentCategories.map((c) => (
                    <Link
                      key={c}
                      href={`/gallery?category=${encodeURIComponent(c)}`}
                      className={tabClass(selected === c)}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}

              {selected ? (
                // Single album
                <PhotoGrid photos={photos.filter((p) => p.category === selected)} />
              ) : (
                // All albums, grouped into sections
                <div className="flex flex-col gap-14">
                  {presentCategories.map((c) => (
                    <div key={c}>
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <h2 className="font-display text-h3 font-semibold text-ink">
                          {c}
                        </h2>
                        <Link
                          href={`/gallery?category=${encodeURIComponent(c)}`}
                          className="text-sm font-medium text-brand hover:text-ink transition-colors shrink-0"
                        >
                          View album →
                        </Link>
                      </div>
                      <PhotoGrid photos={photos.filter((p) => p.category === c)} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
