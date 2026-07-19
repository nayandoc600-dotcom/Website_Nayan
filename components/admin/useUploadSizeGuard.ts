"use client";

import { useCallback, useState, type ChangeEvent } from "react";
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_MB, formatMb } from "@/lib/upload-limits";

/**
 * Client-side guard for file inputs. Wire `onChange` onto a file input and it
 * validates the selected file(s) against the max upload size, exposing a warning
 * message and a `tooBig` flag you can use to disable the submit button — so the
 * admin gets instant feedback instead of a silent server rejection.
 *
 * Use one guard per file input (call the hook once for each input).
 */
export function useUploadSizeGuard() {
  const [error, setError] = useState<string | null>(null);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const oversized = files.find((f) => f.size > MAX_UPLOAD_BYTES);
    setError(
      oversized
        ? `"${oversized.name}" is ${formatMb(oversized.size)} — please choose a file under ${MAX_UPLOAD_MB} MB.`
        : null,
    );
  }, []);

  return { error, tooBig: error !== null, onChange };
}
