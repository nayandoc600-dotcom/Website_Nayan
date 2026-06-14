import { getAllTestimonials } from "@/lib/data/admin-testimonials";
import {
  approveTestimonial,
  hideTestimonial,
  deleteTestimonial,
} from "@/lib/actions/testimonials";
import SubmitButton from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await getAllTestimonials();
  const pending = testimonials.filter((t) => !t.approved);
  const approved = testimonials.filter((t) => t.approved);

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">
        Testimonials
      </h1>
      <p className="text-slate text-sm mb-8">
        {pending.length} pending · {approved.length} approved
      </p>

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-4">
            Awaiting Approval
          </h2>
          <div className="flex flex-col gap-4">
            {pending.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-amber-200 bg-amber-50 p-5"
              >
                <p className="font-semibold text-ink text-sm">{t.name}</p>
                <p className="text-xs text-slate mb-3">{t.role}</p>
                <p className="text-sm text-ink leading-relaxed mb-4 line-clamp-3">
                  {t.body}
                </p>
                <div className="flex gap-3">
                  <form action={approveTestimonial.bind(null, t.id)}>
                    <SubmitButton label="Approve" pendingLabel="Approving…" />
                  </form>
                  <form action={deleteTestimonial.bind(null, t.id)}>
                    <SubmitButton
                      label="Delete"
                      pendingLabel="Deleting…"
                      variant="danger"
                    />
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate mb-4">
          Published ({approved.length})
        </h2>
        <div className="flex flex-col gap-3">
          {approved.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-sand bg-sky p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink text-sm">{t.name}</p>
                <p className="text-xs text-slate mb-1">{t.role}</p>
                <p className="text-sm text-slate line-clamp-2">{t.body}</p>
              </div>
              <form action={hideTestimonial.bind(null, t.id)} className="shrink-0">
                <SubmitButton label="Hide" pendingLabel="Hiding…" />
              </form>
            </div>
          ))}
          {approved.length === 0 && (
            <p className="text-sm text-slate">No approved testimonials yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
