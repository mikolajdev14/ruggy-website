-- Security baseline for the public catalog and private customer data.
-- Apply this migration after the existing catalog and photo migrations.

alter table public.bookings enable row level security;
alter table public.rug_types enable row level security;
alter table public.rug_sizes enable row level security;
alter table public.rug_variants enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.rug_photos enable row level security;

-- Public clients only need to read the active catalog and blocked dates.
revoke all on public.bookings from anon, authenticated;
revoke all on public.rug_types from anon, authenticated;
revoke all on public.rug_sizes from anon, authenticated;
revoke all on public.rug_variants from anon, authenticated;
revoke all on public.blocked_dates from anon, authenticated;
revoke all on public.rug_photos from anon, authenticated;

grant select on public.rug_types to anon, authenticated;
grant select on public.rug_sizes to anon, authenticated;
grant select on public.rug_variants to anon, authenticated;
grant select on public.blocked_dates to anon, authenticated;
grant select on public.rug_photos to anon, authenticated;

drop policy if exists "Public can read active rug types" on public.rug_types;
create policy "Public can read active rug types"
  on public.rug_types
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Public can read active rug sizes" on public.rug_sizes;
create policy "Public can read active rug sizes"
  on public.rug_sizes
  for select
  to anon, authenticated
  using (
    is_active = true
    and (
      (
        rug_type_id is not null
        and exists (
          select 1
          from public.rug_types
          where rug_types.id = rug_sizes.rug_type_id
            and rug_types.is_active = true
        )
      )
      or (
        rug_variant_id is not null
        and exists (
          select 1
          from public.rug_variants
          join public.rug_types on rug_types.id = rug_variants.rug_type_id
          where rug_variants.id = rug_sizes.rug_variant_id
            and rug_variants.is_active = true
            and rug_types.is_active = true
        )
      )
    )
  );

drop policy if exists "Public can read active rug variants" on public.rug_variants;
create policy "Public can read active rug variants"
  on public.rug_variants
  for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1
      from public.rug_types
      where rug_types.id = rug_variants.rug_type_id
        and rug_types.is_active = true
    )
  );

drop policy if exists "Public can read rug photos" on public.rug_photos;
create policy "Public can read rug photos"
  on public.rug_photos
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.rug_types
      where rug_types.id = rug_photos.rug_type_id
        and rug_types.is_active = true
    )
  );

drop policy if exists "Public can read blocked dates" on public.blocked_dates;
create policy "Public can read blocked dates"
  on public.blocked_dates
  for select
  to anon, authenticated
  using (true);

-- Reference images and generated previews contain customer supplied data.
-- Keep that bucket private. The admin panel uses short lived signed URLs.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'booking-reference-images',
  'booking-reference-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Browser clients never upload directly to Storage. Server actions use the
-- service role, so public write privileges are not needed.
revoke insert, update, delete on storage.objects from anon, authenticated;
