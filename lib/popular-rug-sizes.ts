import {
  PAPADYWANY_SLUG,
  PIWODYWANY_SLUG,
} from "@/lib/rug-order-mode";

const POPULAR_PAPADYWAN_SIZE_BY_VARIANT: Record<string, string> = {
  papashrek: "60 cm",
  papaharnas: "60 cm",
  papaslonko: "50 cm",
  "janpat-ii": "50 cm",
  papastokrotka: "60 cm",
  "janpat-slubny-zwiazek": "70 cm",
  "janpat-chlopaki-z-barakow": "60 cm",
  paparzaba: "60 cm",
};

export function getPopularRugSizeLabel(
  rugTypeSlug: string,
  rugVariantSlug?: string,
) {
  if (rugTypeSlug === PIWODYWANY_SLUG) {
    return "70 cm";
  }

  if (rugTypeSlug === PAPADYWANY_SLUG && rugVariantSlug) {
    return POPULAR_PAPADYWAN_SIZE_BY_VARIANT[rugVariantSlug] ?? null;
  }

  return null;
}
