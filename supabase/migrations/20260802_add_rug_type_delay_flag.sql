-- Per-category "opóźnienie" flag, toggled from /admin/dywany.
--
-- When the owner is behind on a rug type, the shop shows an overlay on that
-- category instead of pretending the standard lead time still holds. It is a
-- plain boolean, not a date: the panel flips it on and off by hand.

alter table public.rug_types
  add column if not exists has_delay boolean not null default false;

comment on column public.rug_types.has_delay is
  'Gdy true, na karcie i stronie kategorii pokazuje się nakładka „opóźnienie”.';
