-- Multiple popups may now be active at the same time. Visitors see them one
-- after another (each is dismissed to reveal the next), so popups need a
-- deterministic order: `sort_order` ascending, ties broken by most recently
-- updated. Existing rows keep working — they all default to 0.
alter table popup_notice add column sort_order int not null default 0;

create index popup_notice_active_idx
  on popup_notice (active, sort_order, updated_at);
