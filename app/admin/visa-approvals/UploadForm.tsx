"use client";

import { useActionState, useRef, useEffect } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import type { uploadVisaApproval } from "@/lib/actions/visa-approvals";

type UploadAction = typeof uploadVisaApproval;

export default function UploadForm({ action }: { action: UploadAction }) {
  const [state, formAction] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-sky rounded-xl border border-sand p-6"
      encType="multipart/form-data"
    >
      <h2 className="font-semibold text-ink text-sm mb-4">
        Upload New Approval
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="image" className="text-xs font-medium text-slate uppercase tracking-wide">
            Image (JPEG, PNG, WebP · max 5 MB)
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="text-sm text-slate file:mr-3 file:rounded-md file:border-0 file:bg-brand file:text-paper file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-ink file:transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="student" className="text-xs font-medium text-slate uppercase tracking-wide">
            Student name (optional)
          </label>
          <input
            id="student"
            name="student"
            type="text"
            placeholder="e.g. Priya S. — Japan"
            className="rounded-md border border-sand bg-paper px-3 py-2 text-sm text-ink placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        {state !== null && !state.ok && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p role="status" className="text-sm text-green-600">
            Uploaded successfully.
          </p>
        )}

        <SubmitButton label="Upload" pendingLabel="Uploading…" />
      </div>
    </form>
  );
}
