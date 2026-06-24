-- Popup notice: support an uploaded PDF in addition to the existing image.
alter table popup_notice add column pdf_url text;

-- Storage bucket for popup media (images + PDFs), public read.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'popup-media',
  'popup-media',
  true,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

create policy "popup-media: public read"
  on storage.objects for select
  using (bucket_id = 'popup-media');

create policy "popup-media: authenticated insert"
  on storage.objects for insert
  with check (bucket_id = 'popup-media' and auth.role() = 'authenticated');

create policy "popup-media: authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'popup-media' and auth.role() = 'authenticated');
