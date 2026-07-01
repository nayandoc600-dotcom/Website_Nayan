import type { Metadata } from "next";
import Image from "next/image";
import { getGalleryPhotos } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from Nayan Educational Consultancy — events, seminars, and student send-offs.",
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

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
            A look at life at Nayan — events, seminars, and student send-offs.
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
          )}
        </div>
      </section>
    </>
  );
}
