export type VisaApproval = {
  id: string;
  image_url: string;
  student: string | null;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  body: string;
  approved: boolean;
  created_at: string;
};

export type PopupNotice = {
  id: string;
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string | null;
  pdf_url: string | null;
  active: boolean;
  sort_order: number;
  updated_at: string;
};

export type NewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export type StudyMaterial = {
  id: string;
  title: string;
  file_url: string;
  storage_path: string | null;
  country: string | null;
  size_bytes: number | null;
  created_at: string;
};

// Public-facing study material — never exposes the file URL/path. The download
// URL is minted server-side only after a lead form is completed.
export type PublicStudyMaterial = {
  id: string;
  title: string;
  country: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type StudyMaterialLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_country: string | null;
  qualification: string | null;
  material_id: string | null;
  material_title: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
};

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
  consented: boolean;
};

// Team members + Gallery photos. `*_path` is the Supabase Storage object path
// stored in the DB; `*_url` is the public URL resolved by the data layer via
// getPublicUrl() and is not a column.
export type TeamMember = {
  id: string;
  name: string;
  title: string;
  photo_path: string;
  photo_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryPhoto = {
  id: string;
  image_path: string;
  image_url: string;
  caption: string | null;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// A stored contact_submissions row, as read by the admin panel.
export type ContactSubmissionRow = ContactSubmission & {
  id: string;
  created_at: string;
};
