import { getPopupNotice } from "@/lib/data/admin-popup";
import { upsertPopup } from "@/lib/actions/popup";
import PopupForm from "./PopupForm";

export const dynamic = "force-dynamic";

export default async function PopupAdminPage() {
  const notice = await getPopupNotice();

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink mb-1">
        Popup Notice
      </h1>
      <p className="text-slate text-sm mb-8">
        {notice?.active
          ? "A popup is currently active and showing to visitors."
          : "No popup is currently active."}
      </p>
      {/* key on updated_at forces the form to remount with fresh defaults
          after each save, so the radio/fields reflect the saved state. */}
      <PopupForm
        key={notice?.updated_at ?? "new"}
        action={upsertPopup}
        notice={notice}
      />
    </div>
  );
}
