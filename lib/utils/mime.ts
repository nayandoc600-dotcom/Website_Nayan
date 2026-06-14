// Magic-byte MIME detection — validates by file content, not extension.
// Only checks the first 12 bytes, so it's fast and allocation-minimal.

type AllowedMime =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type MimeResult =
  | { ok: true; mime: AllowedMime }
  | { ok: false; error: string };

const SIGNATURES: Record<string, number[][]> = {
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]], // %PDF
  "application/msword": [[0xd0, 0xcf, 0x11, 0xe0]], // OLE compound doc (old .doc)
  // DOCX and PDF both use zip — DOCX is detected by PK header
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    [0x50, 0x4b, 0x03, 0x04], // PK zip
  ],
};

export async function detectMime(
  file: File,
  allowed: AllowedMime[],
): Promise<MimeResult> {
  const buf = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buf);

  for (const mime of allowed) {
    // WebP: starts with RIFF (4 bytes), then 4-byte size, then WEBP
    if (mime === "image/webp") {
      const riff = [0x52, 0x49, 0x46, 0x46];
      const webp = [0x57, 0x45, 0x42, 0x50];
      if (
        riff.every((b, i) => bytes[i] === b) &&
        webp.every((b, i) => bytes[i + 8] === b)
      ) {
        return { ok: true, mime };
      }
      continue;
    }

    const sigs = SIGNATURES[mime];
    if (!sigs) continue;
    for (const sig of sigs) {
      if (sig.every((b, i) => bytes[i] === b)) {
        return { ok: true, mime };
      }
    }
  }

  return {
    ok: false,
    error: `Invalid file type. Accepted formats: ${allowed.join(", ")}`,
  };
}
