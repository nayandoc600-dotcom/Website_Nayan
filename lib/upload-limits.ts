// Admin uploads go through Server Actions, which on Vercel are capped at a
// ~4.5 MB request body. We warn the admin client-side before they try to submit
// a file that would be rejected, leaving headroom for multipart overhead.
export const MAX_UPLOAD_MB = 4;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export function formatMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
