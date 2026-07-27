-- Rename the "PIWODYWANY" rug type to "ALKODYWANY".
--
-- Only the customer-facing name changes. The slug stays "piwodywany" because
-- it keys the gallery lookup in lib/gallery.ts, the direct-checkout list in
-- lib/rug-order-mode.ts and the public image paths under
-- /public/ruggy/kategorie/piwodywany/ — renaming it would need those moved too.

update public.rug_types
set name = 'ALKODYWANY'
where slug = 'piwodywany';
