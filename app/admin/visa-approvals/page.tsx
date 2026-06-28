import Image from "next/image";
import { getAllVisaApprovals } from "@/lib/data/admin-visa-approvals";
import { deleteVisaApproval, uploadVisaApproval } from "@/lib/actions/visa-approvals";
import SubmitButton from "@/components/admin/SubmitButton";
import UploadForm from "./UploadForm";

export const dynamic = "force-dynamic";

export default async function VisaApprovalsAdminPage() {
  const approvals = await getAllVisaApprovals();
  const recent = approvals.filter(
    (a) =>
      new Date(a.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
  );

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">
        Visa Approvals
      </h1>
      <p className="text-slate text-sm mb-8">
        {recent.length} active (last 7 days) · {approvals.length} total
      </p>

      <UploadForm action={uploadVisaApproval} />

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate mb-4">
          All Uploads
        </h2>
        {approvals.length === 0 && (
          <p className="text-sm text-slate">No visa approvals uploaded yet.</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvals.map((a) => {
            const isActive =
              new Date(a.created_at).getTime() >
              Date.now() - 7 * 24 * 60 * 60 * 1000;
            return (
              <div
                key={a.id}
                className="rounded-xl border border-sand bg-sky p-4 flex flex-col gap-3 h-full"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-paper">
                  <Image
                    src={a.image_url}
                    alt={a.student ?? "Visa approval"}
                    fill
                    className="object-contain p-2"
                    sizes="300px"
                  />
                </div>
                {/* mt-auto pins this row to the bottom; items-end keeps the
                    Delete button on the same baseline across every card. */}
                <div className="mt-auto flex items-end justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    {a.student && (
                      <p className="font-medium text-ink truncate">{a.student}</p>
                    )}
                    <p className="text-slate">
                      {new Date(a.created_at).toLocaleDateString()}
                      {isActive && (
                        <span className="ml-2 text-green-600 font-medium">
                          Active
                        </span>
                      )}
                    </p>
                  </div>
                  <form
                    action={deleteVisaApproval.bind(null, a.id)}
                    className="shrink-0"
                  >
                    <SubmitButton
                      label="Delete"
                      pendingLabel="…"
                      variant="danger"
                      className="text-xs px-3 py-1.5"
                    />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
