-- Grant table-level privileges to the anon and authenticated roles.
-- RLS policies alone are not enough — Postgres requires both a GRANT
-- (table privilege) and a passing policy before a row is returned.

grant usage on schema public to anon, authenticated;

grant select on table visa_approvals   to anon, authenticated;
grant select on table testimonials     to anon, authenticated;
grant select on table popup_notice     to anon, authenticated;
grant select on table news_posts       to anon, authenticated;
grant select on table study_materials  to anon, authenticated;
grant insert on table contact_submissions to anon;
grant select on table contact_submissions to authenticated;
