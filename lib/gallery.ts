// Real workshop photos live under public/ruggy/kategorie/<slug>/biale-tlo (and
// nested project folders for papadywany). We reference them by public URL path
// so filenames with spaces/emoji never have to be imported.

const BASE = "/ruggy/kategorie";

export type GalleryPhoto = {
  src: string;
  alt: string;
  category: string;
};

export type GalleryCategory = {
  slug: string;
  label: string;
  tagline: string;
  cover: GalleryPhoto;
  photos: GalleryPhoto[];
};

const alt = (label: string, subject: string) =>
  `${subject} — ręcznie tuftowany dywan Ruggy z kategorii ${label}`;

type CategoryPhotoSource = {
  id: string;
  folder?: string;
};

const makePhotos = ({
  defaultFolder,
  label,
  subject,
  sources,
}: {
  defaultFolder: string;
  label: string;
  subject: string;
  sources: CategoryPhotoSource[];
}): GalleryPhoto[] =>
  sources.map(({ id, folder }) => ({
    src: `${BASE}/${folder ?? defaultFolder}/biale-tlo/${id}-white-bg.jpg`,
    alt: alt(label, subject),
    category: label,
  }));

const makeCategory = ({
  slug,
  label,
  tagline,
  subject,
  sources,
}: {
  slug: string;
  label: string;
  tagline: string;
  subject: string;
  sources: [CategoryPhotoSource, ...CategoryPhotoSource[]];
}): GalleryCategory => {
  const [cover, ...photos] = makePhotos({
    defaultFolder: slug,
    label,
    subject,
    sources,
  });

  return { slug, label, tagline, cover, photos };
};

// Papadywany do not have a curated Drive subfolder yet, so their existing
// selection remains unchanged, including the cover in the realizations pool.
const papadywanyPhotos = makePhotos({
  defaultFolder: "papadywany",
  label: "Papadywany",
  subject: "Dywan z kultowym motywem",
  sources: [
    { folder: "papadywany/janpat-ii", id: "IMG_4955" },
    {
      folder: "papadywany/janpat-slubny-zwiazek",
      id: "IMG_6072",
    },
    { folder: "papadywany/papashrek", id: "IMG_0249" },
    { folder: "papadywany/papaslonko", id: "IMG_3154" },
    { folder: "papadywany/papastokrotka", id: "IMG_5145" },
  ],
});

/**
 * Curated Drive folders provide six photos per category: the first is the card
 * cover and the remaining five are shown as example realizations.
 */
export const categories: GalleryCategory[] = [
  makeCategory({
    slug: "dywanyzwierzaki",
    label: "Zwierzaki",
    tagline: "Twój pupil w miękkiej, tuftowanej wersji.",
    subject: "Dywan z motywem zwierzaka",
    sources: [
      { id: "IMG_7746" },
      { id: "IMG_7289" },
      { id: "IMG_6820" },
      { id: "IMG_6559" },
      { id: "IMG_6561" },
      { id: "IMG_4938" },
    ],
  }),
  makeCategory({
    slug: "custom",
    label: "Custom",
    tagline: "Każdy pomysł, dowolny kształt i kolor.",
    subject: "Autorski dywan na zamówienie",
    sources: [
      { id: "IMG_6890" },
      { id: "IMG_6777" },
      { folder: "dywanyzwierzaki", id: "IMG_6624" },
      { id: "IMG_3376" },
      { id: "IMG_1287" },
      { id: "IMG_1001" },
    ],
  }),
  makeCategory({
    slug: "autodywany",
    label: "Autodywany",
    tagline: "Motoryzacja, którą chcesz mieć pod stopami.",
    subject: "Dywan o motywie motoryzacyjnym",
    sources: [
      { id: "IMG_8097" },
      { id: "IMG_6410" },
      { id: "IMG_5250" },
      { id: "IMG_3449" },
      { id: "IMG_9121" },
      { id: "IMG_9064" },
    ],
  }),
  {
    slug: "papadywany",
    label: "Papadywany",
    tagline: "Kultowe motywy z przymrużeniem oka.",
    cover: papadywanyPhotos[0],
    photos: papadywanyPhotos,
  },
  makeCategory({
    slug: "herbodywany",
    label: "Herbowe",
    tagline: "Herby i symbole w miękkiej odsłonie.",
    subject: "Dywan z herbem lub symbolem",
    sources: [
      { id: "IMG_7623" },
      { folder: "autodywany", id: "IMG_6818" },
      { id: "IMG_5607" },
      { id: "IMG_5213" },
      { id: "IMG_4284" },
      { id: "IMG_0509" },
    ],
  }),
  makeCategory({
    slug: "piwodywany",
    label: "Alkodywany",
    tagline: "Ulubione marki w formie dywanu.",
    subject: "Dywan inspirowany ulubioną marką",
    sources: [
      { id: "IMG_8806" },
      { id: "IMG_7728" },
      { id: "IMG_7201" },
      { id: "IMG_6653" },
      { id: "IMG_5523" },
      { id: "IMG_3331" },
    ],
  }),
];

const categoriesBySlug = new Map(
  categories.map((category) => [category.slug, category]),
);

/** Look up a category by its rug_types slug (e.g. "papadywany").
 * Slugs are trimmed because some rows carry stray whitespace/newlines. */
export function getCategory(
  slug: string | null | undefined,
): GalleryCategory | undefined {
  return slug ? categoriesBySlug.get(slug.trim()) : undefined;
}

/** Curated cover photo for a given category slug, if any. */
export function getCategoryCover(
  slug: string | null | undefined,
): GalleryPhoto | undefined {
  return getCategory(slug)?.cover;
}

// Each papadywany subrodzaj lives in its own project folder whose name matches
// the rug_variants slug (the same slugs POPULAR_PAPADYWAN_SIZE_BY_VARIANT uses).
// This maps a subrodzaj to its cover photo — the first realization in its folder,
// unless `project` points at another shoot the cover is borrowed from.
const papadywanyVariantCovers: Record<
  string,
  { id: string; project?: string }
> = {
  "janpat-chlopaki-z-barakow": { id: "IMG_6678", project: "janpat-ii" },
  "janpat-ii": { id: "IMG_4955" },
  "janpat-slubny-zwiazek": { id: "IMG_6074" },
  papaharnas: { id: "IMG_4639" },
  paparzaba: { id: "IMG_8965" },
  papashrek: { id: "IMG_0249" },
  papaslonko: { id: "IMG_3154" },
  papastokrotka: { id: "IMG_5145" },
};

/** Cover photo for a papadywany subrodzaj (by rug_variants slug), if any. */
export function getPapadywanyVariantCover(
  variantSlug: string | null | undefined,
): GalleryPhoto | undefined {
  const slug = variantSlug?.trim();
  const cover = slug ? papadywanyVariantCovers[slug] : undefined;
  if (!slug || !cover) return undefined;

  return {
    src: `${BASE}/papadywany/${cover.project ?? slug}/biale-tlo/${cover.id}-white-bg.jpg`,
    alt: alt("Papadywany", "Dywan z kultowym motywem"),
    category: "Papadywany",
  };
}

/**
 * Flat pool of every category's cover and realizations, spanning all categories.
 * Used to fill the 3D dome gallery on the homepage.
 */
export const allRugPhotos: GalleryPhoto[] = categories.flatMap(
  (category) => [category.cover, ...category.photos],
);
