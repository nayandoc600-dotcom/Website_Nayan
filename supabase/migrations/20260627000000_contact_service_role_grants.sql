-- The contact form writes through the service_role client (server action), but
-- service_role was never granted privileges on contact_submissions — so every
-- insert failed with "permission denied for table contact_submissions" (42501),
-- surfacing to the user as "Something went wrong. Please try again."
-- RLS still applies as the backstop; service_role bypasses RLS by design.
grant select, insert, update, delete
  on table public.contact_submissions
  to service_role;
