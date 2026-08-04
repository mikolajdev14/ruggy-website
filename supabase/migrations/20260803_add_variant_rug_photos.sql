-- Allow catalog photos to belong to either a rug type or one of its variants.
-- Existing rows keep rug_type_id and remain valid.

alter table public.rug_photos
  alter column rug_type_id drop not null;

alter table public.rug_photos
  add column if not exists rug_variant_id bigint
    references public.rug_variants(id) on delete cascade;

create index if not exists rug_photos_rug_variant_id_idx
  on public.rug_photos (rug_variant_id, display_order);

create unique index if not exists rug_photos_one_cover_per_variant_idx
  on public.rug_photos (rug_variant_id)
  where rug_variant_id is not null and is_cover;

alter table public.rug_photos
  drop constraint if exists rug_photos_exactly_one_owner;

alter table public.rug_photos
  add constraint rug_photos_exactly_one_owner
  check (num_nonnulls(rug_type_id, rug_variant_id) = 1);

drop policy if exists "Public can read rug photos" on public.rug_photos;
create policy "Public can read rug photos"
  on public.rug_photos
  for select
  to anon, authenticated
  using (
    (
      rug_type_id is not null
      and exists (
        select 1
        from public.rug_types
        where rug_types.id = rug_photos.rug_type_id
          and rug_types.is_active = true
      )
    )
    or (
      rug_variant_id is not null
      and exists (
        select 1
        from public.rug_variants
        join public.rug_types on rug_types.id = rug_variants.rug_type_id
        where rug_variants.id = rug_photos.rug_variant_id
          and rug_variants.is_active = true
          and rug_types.is_active = true
      )
    )
  );
