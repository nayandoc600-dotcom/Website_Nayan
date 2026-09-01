// Gallery album categories. Shared between the admin upload form, the server
// action's validation, and the public gallery page. Kept out of any "use server"
// file so client components can import it.
export const GALLERY_CATEGORIES = [
  "Block A",
  "Block B",
  "Visa Success",
  "Program and Events",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(value);
}
