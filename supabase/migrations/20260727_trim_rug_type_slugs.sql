-- Strip stray whitespace from rug type / variant text columns.
--
-- rug_types.slug for "herbodywany" carried a trailing newline, so the exact
-- match in getCategory() (lib/gallery.ts) missed and the category's
-- realizacje never rendered. The same slug also feeds usesDirectCheckout()
-- in lib/rug-order-mode.ts, so any dirty value silently changes the order
-- flow. Trimming everything at once keeps the columns comparable by value.

update public.rug_types
set
  slug = btrim(slug),
  name = btrim(name),
  description = btrim(description)
where
  slug is distinct from btrim(slug)
  or name is distinct from btrim(name)
  or description is distinct from btrim(description);

update public.rug_variants
set
  slug = btrim(slug),
  name = btrim(name)
where
  slug is distinct from btrim(slug)
  or name is distinct from btrim(name);
