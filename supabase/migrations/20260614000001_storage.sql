-- ─────────────────────────────────────────────────────────────────────────────
-- Storage buckets for Nayan Educational Consultancy
-- ─────────────────────────────────────────────────────────────────────────────

-- Visa approval images (public read, authenticated write/delete)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'visa-approvals',
  'visa-approvals',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
);

-- Study materials (public read via signed URL, authenticated write/delete)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'study-materials',
  'study-materials',
  false,
  26214400,  -- 25 MB
  array['application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- ─── Storage policies ─────────────────────────────────────────────────────────

-- Visa approvals: anyone can read (bucket is public, but explicit policy for clarity)
create policy "visa-approvals: public read"
  on storage.objects for select
  using (bucket_id = 'visa-approvals');

create policy "visa-approvals: authenticated insert"
  on storage.objects for insert
  with check (bucket_id = 'visa-approvals' and auth.role() = 'authenticated');

create policy "visa-approvals: authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'visa-approvals' and auth.role() = 'authenticated');

-- Study materials: public read (links are not guessable — UUIDs in path)
create policy "study-materials: public read"
  on storage.objects for select
  using (bucket_id = 'study-materials');

create policy "study-materials: authenticated insert"
  on storage.objects for insert
  with check (bucket_id = 'study-materials' and auth.role() = 'authenticated');

create policy "study-materials: authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'study-materials' and auth.role() = 'authenticated');
