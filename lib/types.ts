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
  active: boolean;
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
  country: string | null;
  size_bytes: number | null;
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
