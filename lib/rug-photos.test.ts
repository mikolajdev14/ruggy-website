import { describe, expect, it } from "vitest";
import {
  mapRugPhotos,
  resolveCategoryPhotos,
  resolveVariantPhotos,
  type RugPhoto,
} from "./rug-photos";

const photo = (id: number, isCover = false, displayOrder = id): RugPhoto => ({
  id,
  storagePath: `photos/${id}.jpg`,
  url: `https://storage.example/photos/${id}.jpg`,
  isCover,
  displayOrder,
});

describe("mapRugPhotos", () => {
  it("sorts uploaded photos by display order and normalizes database values", () => {
    // AC-1: uploaded rows are stable gallery inputs regardless of database types.
    const result = mapRugPhotos([
      {
        id: "2",
        storage_path: "photos/2.jpg",
        is_cover: true,
        display_order: "2",
      },
      {
        id: 1,
        storage_path: "photos/1.jpg",
        is_cover: false,
        display_order: 1,
      },
    ]);

    expect(result.map((item) => item.id)).toEqual([1, 2]);
    expect(result[1]).toMatchObject({ id: 2, isCover: true, displayOrder: 2 });
  });
});

describe("resolveVariantPhotos", () => {
  const parentPhotos = [photo(10, true), photo(11)];

  it("uses the variant gallery and keeps its cover separate from the parent", () => {
    // AC-5: a variant gallery must not change the parent category gallery.
    const result = resolveVariantPhotos({
      variantName: "Papashrek",
      variantPhotos: [photo(20, true), photo(21)],
      parentSlug: "papadywany",
      parentName: "Papadywany",
      parentPhotos,
    });

    expect(result.cover).toMatchObject({
      src: "https://storage.example/photos/20.jpg",
      category: "Papashrek",
    });
    expect(result.realizations).toHaveLength(1);
    expect(result.realizations[0].src).toContain("/21.jpg");
  });

  it("falls back to the parent uploaded gallery when the variant is empty", () => {
    // AC-4 and AC-5: empty variants inherit the parent gallery.
    const result = resolveVariantPhotos({
      variantName: "Papashrek",
      variantPhotos: [],
      parentSlug: "papadywany",
      parentName: "Papadywany",
      parentPhotos,
    });

    expect(result.cover?.src).toContain("/10.jpg");
    expect(result.cover?.category).toBe("Papadywany");
    expect(result.realizations[0].src).toContain("/11.jpg");
  });

  it("falls back to the curated static category gallery when no uploads exist", () => {
    // AC-4: existing categories keep working before any upload is made.
    const result = resolveVariantPhotos({
      variantName: "Papashrek",
      variantPhotos: [],
      parentSlug: "papadywany",
      parentName: "Papadywany",
      parentPhotos: [],
    });

    expect(result.cover?.src).toContain("/ruggy/kategorie/papadywany/");
    expect(result.realizations.length).toBeGreaterThan(0);
  });
});

describe("resolveCategoryPhotos", () => {
  it("chooses the first uploaded photo as cover when none is marked", () => {
    const result = resolveCategoryPhotos({
      slug: "new-category",
      name: "Nowa kategoria",
      photos: [photo(30), photo(31)],
    });

    expect(result.cover?.src).toContain("/30.jpg");
    expect(result.realizations).toHaveLength(1);
  });
});
