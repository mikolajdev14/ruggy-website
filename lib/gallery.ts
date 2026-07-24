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
  photos: GalleryPhoto[];
};

const alt = (label: string, subject: string) =>
  `${subject} — ręcznie tuftowany dywan Ruggy z kategorii ${label}`;

/**
 * Five representative projects per category. Order matters: the first photo of
 * each category doubles as the category cover.
 */
export const categories: GalleryCategory[] = [
  {
    slug: "dywanyzwierzaki",
    label: "Zwierzaki",
    tagline: "Twój pupil w miękkiej, tuftowanej wersji.",
    photos: [
      "IMG_0857",
      "IMG_3439",
      "IMG_4803",
      "IMG_6559",
      "IMG_7746",
    ].map((id) => ({
      src: `${BASE}/dywanyzwierzaki/biale-tlo/${id}-white-bg.jpg`,
      alt: alt("Zwierzaki", "Dywan z motywem zwierzaka"),
      category: "Zwierzaki",
    })),
  },
  {
    slug: "custom",
    label: "Custom",
    tagline: "Każdy pomysł, dowolny kształt i kolor.",
    photos: [
      "IMG_1001",
      "IMG_3002",
      "IMG_3628",
      "IMG_4217",
      "PEPSIDYWAN",
    ].map((id) => ({
      src: `${BASE}/custom/biale-tlo/${id}-white-bg.jpg`,
      alt: alt("Custom", "Autorski dywan na zamówienie"),
      category: "Custom",
    })),
  },
  {
    slug: "autodywany",
    label: "Autodywany",
    tagline: "Motoryzacja, którą chcesz mieć pod stopami.",
    photos: [
      "IMG_0995",
      "IMG_2899",
      "IMG_3389",
      "IMG_3860",
      "IMG_4119",
    ].map((id) => ({
      src: `${BASE}/autodywany/biale-tlo/${id}-white-bg.jpg`,
      alt: alt("Autodywany", "Dywan o motywie motoryzacyjnym"),
      category: "Autodywany",
    })),
  },
  {
    slug: "papadywany",
    label: "Papadywany",
    tagline: "Kultowe motywy z przymrużeniem oka.",
    photos: [
      { project: "janpat-ii", id: "IMG_4955" },
      { project: "janpat-slubny-zwiazek", id: "IMG_6072" },
      { project: "papashrek", id: "IMG_0249" },
      { project: "papaslonko", id: "IMG_3154" },
      { project: "papastokrotka", id: "IMG_5145" },
    ].map(({ project, id }) => ({
      src: `${BASE}/papadywany/${project}/biale-tlo/${id}-white-bg.jpg`,
      alt: alt("Papadywany", "Dywan z kultowym motywem"),
      category: "Papadywany",
    })),
  },
  {
    slug: "herbodywany",
    label: "Herbowe",
    tagline: "Herby i symbole w miękkiej odsłonie.",
    photos: [
      "IMG_0509",
      "IMG_3515",
      "IMG_4284",
      "IMG_5213",
      "IMG_5607",
    ].map((id) => ({
      src: `${BASE}/herbodywany/biale-tlo/${id}-white-bg.jpg`,
      alt: alt("Herbowe", "Dywan z herbem lub symbolem"),
      category: "Herbowe",
    })),
  },
  {
    slug: "piwodywany",
    label: "Piwodywany",
    tagline: "Ulubione marki w formie dywanu.",
    photos: [
      "IMG_3329",
      "IMG_5523",
      "IMG_6653",
      "IMG_7201",
      "IMG_7727",
    ].map((id) => ({
      src: `${BASE}/piwodywany/biale-tlo/${id}-white-bg.jpg`,
      alt: alt("Piwodywany", "Dywan inspirowany ulubioną marką"),
      category: "Piwodywany",
    })),
  },
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

/** Cover photo (first realization) for a given category slug, if any. */
export function getCategoryCover(
  slug: string | null | undefined,
): GalleryPhoto | undefined {
  return getCategory(slug)?.photos[0];
}

/**
 * Flat pool of every category's realizations, spanning all categories.
 * Used to fill the 3D dome gallery on the homepage.
 */
export const allRugPhotos: GalleryPhoto[] = categories.flatMap(
  (category) => category.photos,
);
