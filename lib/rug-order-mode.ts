export const DIRECT_CHECKOUT_RUG_SLUGS = [
  "piwodywany",
  "papadywany",
] as const;

export const PAPADYWANY_SLUG = "papadywany";

export function usesDirectCheckout(slug: string | null | undefined) {
  return DIRECT_CHECKOUT_RUG_SLUGS.some(
    (directCheckoutSlug) => directCheckoutSlug === slug,
  );
}
