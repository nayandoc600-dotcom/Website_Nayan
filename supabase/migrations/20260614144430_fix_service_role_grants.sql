-- service_role powers the admin panel; it needs full data access on app tables.
-- RLS still applies as the backstop; service_role bypasses RLS by design.
grant select, insert, update, delete
  on table
    public.testimonials,
    public.visa_approvals,
    public.popup_notice,
    public.news_posts,
    public.study_materials
  to service_role;