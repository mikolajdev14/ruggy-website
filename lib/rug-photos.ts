import { getCategory, type GalleryPhoto } from "@/lib/gallery";

// Photos the owner uploads from /admin/dywany. They live in a public Storage
// bucket rather than /public, because a serverless deploy has no writable
// filesystem — see supabase/migrations/20260801_add_rug_photos.sql.
export const RUG_CATALOG_PHOTOS_BUCKET = "rug-catalog-photos";

export const MAX_RUG_PHOTO_SIZE = 5 * 1024 * 1024;

/** Row shape of public.rug_photos as every caller selects it. */
export type RugPhotoRow = {
  id: number | string;
  rug_type_id?: number | string | null;
  rug_variant_id?: number | string | null;
  storage_path: string;
  is_cover: boolean | null;
  display_order: number | string | null;
};

export type RugPhoto = {
  id: number;
  storagePath: string;
  url: string;
  isCover: boolean;
  displayOrder: number;
};

/**
 * True when a query failed only because public.rug_photos does not exist yet
 * (the migration has not been applied). Callers treat it as "no photos" rather
 * than as a broken page — the static gallery still covers every category that
 * shipped before uploads existed.
 */
export const isMissingRugPhotosTable = (
  error: { code?: string } | null | undefined,
) => error?.code === "42P01" || error?.code === "PGRST205";

export const buildRugPhotoUrl = (storagePath: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${RUG_CATALOG_PHOTOS_BUCKET}/${storagePath}`;

export const mapRugPhotos = (rows: RugPhotoRow[] | null | undefined): RugPhoto[] =>
  (rows ?? [])
    .map((row) => ({
      id: Number(row.id),
      storagePath: row.storage_path,
      url: buildRugPhotoUrl(row.storage_path),
      isCover: row.is_cover === true,
      displayOrder: Number(row.display_order ?? 0),
    }))
    .toSorted((first, second) => first.displayOrder - second.displayOrder);

// Mirrors the phrasing lib/gallery.ts uses for the curated photos, so uploaded
// and static realizations read the same to a screen reader.
const buildAlt = (categoryName: string) =>
  `Ręcznie tuftowany dywan Ruggy z kategorii ${categoryName}`;

const resolveUploadedPhotos = (photos: RugPhoto[], name: string) => {
  const cover = photos.find((photo) => photo.isCover) ?? photos[0];
  const alt = buildAlt(name);

  return {
    cover: cover
      ? { src: cover.url, alt, category: name }
      : undefined,
    realizations: cover
      ? photos
          .filter((photo) => photo.id !== cover.id)
          .map((photo) => ({ src: photo.url, alt, category: name }))
      : [],
  };
};

/**
 * Cover + realizations for one category.
 *
 * A category that has uploaded photos is described entirely by them; one with
 * none falls back to the curated set in lib/gallery.ts. Mixing the two sources
 * would make it impossible to tell why a photo is on the page.
 */
export function resolveCategoryPhotos({
  slug,
  name,
  photos,
}: {
  slug: string | null | undefined;
  name: string;
  photos: RugPhoto[];
}): { cover: GalleryPhoto | undefined; realizations: GalleryPhoto[] } {
  if (photos.length) {
    return resolveUploadedPhotos(photos, name);
  }

  const category = getCategory(slug);

  return {
    cover: category?.cover,
    realizations: category?.photos ?? [],
  };
}

/**
 * Resolve a variant gallery without changing the parent category gallery.
 * Variant uploads win; an empty variant falls back to the parent's full
 * resolver, including its uploaded or curated static photos.
 */
export function resolveVariantPhotos({
  variantName,
  variantPhotos,
  parentSlug,
  parentName,
  parentPhotos,
}: {
  variantName?: string | null;
  variantPhotos: RugPhoto[];
  parentSlug: string | null | undefined;
  parentName: string;
  parentPhotos: RugPhoto[];
}): { cover: GalleryPhoto | undefined; realizations: GalleryPhoto[] } {
  if (variantPhotos.length) {
    return resolveUploadedPhotos(
      variantPhotos,
      variantName?.trim() || parentName,
    );
  }

  return resolveCategoryPhotos({
    slug: parentSlug,
    name: parentName,
    photos: parentPhotos,
  });
}
