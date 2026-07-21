import Image from "next/image";
import type { VisaApproval } from "@/lib/types";
import VisaCarousel from "./VisaCarousel";

export default function VisaApprovalsSection({
  approvals,
}: {
  approvals: VisaApproval[];
}) {
  if (approvals.length === 0) return null;

  return (
    <section id="visa-approvals" className="bg-sky py-14 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass mb-2">
            Recent Success
          </p>
          <h2 className="font-display text-h2 font-semibold text-ink mb-4">
            Visa Approvals
          </h2>
          <p className="text-slate leading-relaxed max-w-sm">
            Every visa approved is a student's dream made real. These are our
            recent approvals which are updated weekly so you can see how active our
            students are.
          </p>
        </div>

        {/* Single image or carousel */}
        <div>
          {approvals.length === 1 ? (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-paper">
              <Image
                src={approvals[0].image_url}
                alt={
                  approvals[0].student
                    ? `Visa approval — ${approvals[0].student}`
                    : "Visa approval"
                }
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {approvals[0].student && (
                <div className="absolute bottom-0 inset-x-0 bg-ink/70 backdrop-blur-sm px-5 py-3 text-paper text-base font-medium text-center">
                  {approvals[0].student}
                </div>
              )}
            </div>
          ) : (
            <VisaCarousel approvals={approvals} />
          )}
        </div>
      </div>
    </section>
  );
}
