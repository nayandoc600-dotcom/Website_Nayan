-- Gallery photos are grouped into category "albums" (Block A, Block B,
-- Visa Success, Program and Events). Existing rows default to the general
-- "Program and Events" album. Category values are validated in the app layer
-- (Zod) so the set can evolve without a migration.
alter table gallery_photos
  add column category text not null default 'Program and Events';

create index gallery_photos_category_idx
  on gallery_photos (category, sort_order, created_at);
