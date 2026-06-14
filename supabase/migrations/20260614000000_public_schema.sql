-- ─────────────────────────────────────────────────────────────────────────────
-- Public schema for Nayan Educational Consultancy
-- ─────────────────────────────────────────────────────────────────────────────

-- Visa approvals
-- Each row is a single approval graphic uploaded by admin.
-- Public query filters to created_at > now() - 7 days (no cron, no deletion).
create table visa_approvals (
  id         uuid        primary key default gen_random_uuid(),
  image_url  text        not null,
  student    text,                        -- optional: "Priya S. — Japan"
  created_at timestamptz not null default now()
);
alter table visa_approvals enable row level security;
create policy "Public read visa_approvals"
  on visa_approvals for select using (true);

-- Testimonials
-- Admin approves before they appear publicly.
create table testimonials (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  role       text        not null,        -- e.g. "BSc Computer Science · Japan, 2024"
  body       text        not null,
  approved   boolean     not null default false,
  created_at timestamptz not null default now()
);
alter table testimonials enable row level security;
create policy "Public read approved testimonials"
  on testimonials for select using (approved = true);

-- Popup notice (only one active at a time)
create table popup_notice (
  id         uuid        primary key default gen_random_uuid(),
  title      text        not null,
  body       text        not null,
  cta_label  text,
  cta_url    text,
  active     boolean     not null default false,
  updated_at timestamptz not null default now()
);
alter table popup_notice enable row level security;
create policy "Public read active popup"
  on popup_notice for select using (active = true);

-- News posts (public listing)
create table news_posts (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        not null unique,
  excerpt      text        not null,
  body         text        not null,
  published    boolean     not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);
alter table news_posts enable row level security;
create policy "Public read published news"
  on news_posts for select using (published = true);

-- Study materials (downloadable by anyone with the link)
create table study_materials (
  id         uuid        primary key default gen_random_uuid(),
  title      text        not null,
  file_url   text        not null,
  country    text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);
alter table study_materials enable row level security;
create policy "Public read study_materials"
  on study_materials for select using (true);

-- Contact form submissions (write-only from public; admin reads via service role)
create table contact_submissions (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       text        not null,
  phone       text,
  country     text,
  message     text        not null,
  consented   boolean     not null default false,
  created_at  timestamptz not null default now()
);
alter table contact_submissions enable row level security;
create policy "Public insert contact_submissions"
  on contact_submissions for insert with check (true);
