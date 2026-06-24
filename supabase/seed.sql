-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data for local development
-- ─────────────────────────────────────────────────────────────────────────────

-- Testimonials
insert into testimonials (name, role, body, approved) values
  (
    'Priya Sharma',
    'BSc Computer Science · Japan, 2024',
    'Nayan''s counsellors guided me through every step — from shortlisting universities to preparing my visa documents. I got my student visa approved in under three weeks. Couldn''t have done it without them.',
    true
  ),
  (
    'Arjun Thapa',
    'MEng Mechanical Engineering · UK, 2023',
    'I was overwhelmed by the UK application process, but the team broke it down so clearly. They even helped me write a personal statement that stood out. I''m now at my dream university.',
    true
  ),
  (
    'Sita Gurung',
    'Foundation Year · Australia, 2024',
    'The visa approval came faster than I expected. Nayan kept me informed at every stage and was always available to answer my questions — even late in the evening. Truly exceptional service.',
    true
  ),
  (
    'Bikram Rai',
    'BBA International Business · Canada, 2023',
    'From IELTS prep advice to accommodation tips, Nayan went beyond just the paperwork. They genuinely care about students'' futures, not just the application fee.',
    true
  );

-- Popup notice
insert into popup_notice (title, body, cta_label, cta_url, active) values
  (
    'September 2026 Intake — Applications Open',
    'Applications for the September 2026 intake are now open, with limited slots for the January 2027 intake. Book a free counselling session before deadlines approach.',
    'Book a Session',
    '/contact',
    true
  );
