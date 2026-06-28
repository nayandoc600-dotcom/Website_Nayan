-- ─────────────────────────────────────────────────────────────────────────────
-- Study-material lead capture
-- Every download is gated behind a lead form. Each download attempt is recorded
-- here (the same person, identified by phone, may download many files — one row
-- per download so per-file counts are accurate).
-- ─────────────────────────────────────────────────────────────────────────────

create table study_material_leads (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  email             text        not null,
  phone             text        not null,
  preferred_country text,
  qualification     text,
  material_id       uuid        references study_materials(id) on delete set null,
  material_title    text,
  ip_hash           text,
  user_agent        text,
  created_at        timestamptz not null default now()
);

alter table study_material_leads enable row level security;
-- No public policies: leads are private. Reads/writes go through the server
-- (service-role) only — never directly from the browser.

create index study_material_leads_created_at_idx
  on study_material_leads (created_at desc);
create index study_material_leads_phone_idx
  on study_material_leads (phone);
create index study_material_leads_material_id_idx
  on study_material_leads (material_id);

grant select, insert, update, delete on table study_material_leads to service_role;

-- Store the storage object path so the server can mint fresh, short-lived signed
-- URLs on demand instead of exposing a long-lived one. Existing rows fall back
-- to their stored file_url.
alter table study_materials add column storage_path text;
