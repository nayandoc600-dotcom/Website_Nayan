import { getPopupNotices } from "@/lib/data/admin-popup";
import { upsertPopup, deletePopup } from "@/lib/actions/popup";
import SubmitButton from "@/components/admin/SubmitButton";
import PopupForm from "./PopupForm";

export const dynamic = "force-dynamic";

function labelFor(notice: { title: string; image_url: string | null; pdf_url: string | null }) {
  if (notice.title) return notice.title;
  if (notice.image_url) return "Image popup";
  if (notice.pdf_url) return "PDF popup";
  return "Untitled popup";
}

export default async function PopupAdminPage() {
  const notices = await getPopupNotices();
  const activeCount = notices.filter((n) => n.active).length;

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">
        Popup Notices
      </h1>
      <p className="text-slate text-sm mb-8">
        {activeCount === 0
          ? "No popup is currently active."
          : activeCount === 1
            ? "1 popup is showing to visitors."
            : `${activeCount} popups are active — visitors see them one after another, lowest order first.`}
      </p>

      <details
        className="rounded-xl border border-sand bg-sky p-5 mb-10"
        open={notices.length === 0}
      >
        <summary className="cursor-pointer text-sm font-medium text-ink">
          Add a new popup
        </summary>
        <div className="mt-5">
          {/* Remounts once a popup is added, so the fields reset for the next one. */}
          <PopupForm key={`new-${notices.length}`} action={upsertPopup} notice={null} />
        </div>
      </details>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate mb-4">
          All Popups
        </h2>

        {notices.length === 0 ? (
          <p className="text-sm text-slate">No popups yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {notices.map((n) => (
              <details key={n.id} className="rounded-xl border border-sand bg-sky p-5">
                <summary className="cursor-pointer text-sm">
                  <span className="inline-flex items-center gap-3 flex-wrap align-middle">
                    <span className="text-xs text-slate tabular-nums">#{n.sort_order}</span>
                    <span className="font-medium text-ink">{labelFor(n)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full border text-xs ${
                        n.active
                          ? "bg-green-50 border-green-200 text-green-700"
                          : "bg-paper border-sand text-slate"
                      }`}
                    >
                      {n.active ? "Active" : "Hidden"}
                    </span>
                  </span>
                </summary>

                <div className="mt-5">
                  {/* key on updated_at forces the form to remount with fresh defaults
                      after each save, so the radio/fields reflect the saved state. */}
                  <PopupForm key={n.updated_at} action={upsertPopup} notice={n} />

                  <form
                    action={deletePopup.bind(null, n.id)}
                    className="mt-5 pt-5 border-t border-sand"
                  >
                    <SubmitButton
                      label="Delete popup"
                      pendingLabel="Deleting…"
                      variant="danger"
                      className="text-xs px-3 py-1.5"
                    />
                  </form>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
