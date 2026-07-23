export const PIWODYWANY_SLUG = "piwodywany";
export const PAPADYWANY_SLUG = "papadywany";

export const DIRECT_CHECKOUT_RUG_SLUGS = [
  PIWODYWANY_SLUG,
  PAPADYWANY_SLUG,
] as const;

export function usesDirectCheckout(slug: string | null | undefined) {
  return DIRECT_CHECKOUT_RUG_SLUGS.some(
    (directCheckoutSlug) => directCheckoutSlug === slug,
  );
}
