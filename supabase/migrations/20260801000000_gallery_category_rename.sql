-- Rename gallery albums: "Block A" → "Counselling", "Block B" → "Classes"
-- (the sections are used for counselling and class photos). Category values are
-- validated in the app layer (no DB constraint), so this only needs to re-tag
-- existing rows to match the new labels. "Visa Success" and "Program and Events"
-- are unchanged.
update gallery_photos set category = 'Counselling' where category = 'Block A';
update gallery_photos set category = 'Classes'     where category = 'Block B';
