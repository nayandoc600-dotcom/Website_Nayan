-- ─────────────────────────────────────────────────────────────────────────────
-- Team members + Gallery photos
-- Two admin-managed content types with public read. Writes go through the
-- service-role admin path only (RLS backstop). Mirrors the visa_approvals /
-- study_materials tables + storage buckets.
-- ─────────────────────────────────────────────────────────────────────────────

-- Team members
create table team_members (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  title       text        not null,
  photo_path  text        not null,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table team_members enable row level security;
create policy "Public read team_members"
  on team_members for select using (true);
-- Postgres needs BOTH a GRANT and a passing RLS policy before a row is returned.
grant select on table team_members to anon, authenticated;
grant select, insert, update, delete on table team_members to service_role;
create index team_members_sort_idx on team_members (sort_order, created_at);

-- Gallery photos
create table gallery_photos (
  id          uuid        primary key default gen_random_uuid(),
  image_path  text        not null,
  caption     text,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table gallery_photos enable row level security;
create policy "Public read gallery_photos"
  on gallery_photos for select using (true);
grant select on table gallery_photos to anon, authenticated;
grant select, insert, update, delete on table gallery_photos to service_role;
create index gallery_photos_sort_idx on gallery_photos (sort_order, created_at);

-- ─── Storage buckets (public read, 5 MB, images only) — mirrors visa-approvals ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('team',    'team',    true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('gallery', 'gallery', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- ─── Storage policies (public read, authenticated insert/delete) ───────────────
create policy "team: public read"
  on storage.objects for select
  using (bucket_id = 'team');

create policy "team: authenticated insert"
  on storage.objects for insert
  with check (bucket_id = 'team' and auth.role() = 'authenticated');

create policy "team: authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'team' and auth.role() = 'authenticated');

create policy "gallery: public read"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "gallery: authenticated insert"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "gallery: authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'gallery' and auth.role() = 'authenticated');
