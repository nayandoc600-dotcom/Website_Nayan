import Image from "next/image";
import { getAllGalleryPhotos } from "@/lib/data/admin-gallery";
import { deleteGalleryPhoto } from "@/lib/actions/gallery";
import SubmitButton from "@/components/admin/SubmitButton";
import GalleryUploadForm from "./GalleryUploadForm";
import CaptionForm from "./CaptionForm";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const photos = await getAllGalleryPhotos();

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">Gallery</h1>
      <p className="text-slate text-sm mb-8">{photos.length} photos</p>

      <GalleryUploadForm />

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate mb-4">
          All Photos
        </h2>
        {photos.length === 0 && (
          <p className="text-sm text-slate">No photos uploaded yet.</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-sand bg-sky p-4 flex flex-col gap-3 h-full"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-paper">
                <Image
                  src={p.image_url}
                  alt={p.caption ?? "Gallery photo"}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
              <CaptionForm id={p.id} caption={p.caption} />
              <div className="mt-auto flex items-center justify-between gap-2 text-xs">
                <span className="text-slate">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
                <form action={deleteGalleryPhoto.bind(null, p.id)} className="shrink-0">
                  <SubmitButton
                    label="Delete"
                    pendingLabel="…"
                    variant="danger"
                    className="text-xs px-3 py-1.5"
                  />
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
