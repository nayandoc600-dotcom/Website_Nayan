import type { Metadata } from "next";
import { getStudyMaterials } from "@/lib/data/study-materials";
import StudyMaterialsList from "@/components/marketing/StudyMaterialsList";

export const metadata: Metadata = {
  title: "Study Materials",
  description:
    "Free study guides, brochures, and resources from Nayan Educational Consultancy to help you prepare for studying abroad.",
};

export const revalidate = 3600;

export default async function StudyMaterialsPage() {
  const materials = await getStudyMaterials();

  return (
    <>
      <section className="relative overflow-hidden bg-paper py-16 px-6 border-b border-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/study_materials.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-paper/40" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-3">
            Free Resources
          </p>
          <h1 className="font-display text-h1 font-semibold text-ink mb-4 leading-tight">
            Study Materials
          </h1>
          <p className="text-slate text-lg leading-relaxed">
            Guides, brochures, and preparation resources, <b>free to download</b>. New
            materials are added regularly.
          </p>
        </div>
      </section>

      <section className="bg-sky py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <StudyMaterialsList materials={materials} />
        </div>
      </section>
    </>
  );
}
