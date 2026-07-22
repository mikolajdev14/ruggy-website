export const CUSTOM_RUG_MIN_PRICE_CENTS = 24900;
export const CUSTOM_RUG_RATE_CENTS_PER_HEIGHT_CM = 420;
export const CUSTOM_RUG_MIN_DIMENSION_CM = 20;
export const CUSTOM_RUG_MAX_DIMENSION_CM = 300;

export function calculateCustomRugPriceCents(
  heightCm: number | null | undefined,
) {
  if (
    !Number.isFinite(heightCm) ||
    heightCm == null ||
    heightCm < CUSTOM_RUG_MIN_DIMENSION_CM ||
    heightCm > CUSTOM_RUG_MAX_DIMENSION_CM
  ) {
    return null;
  }

  const rawPriceCents =
    CUSTOM_RUG_MIN_PRICE_CENTS +
    heightCm * CUSTOM_RUG_RATE_CENTS_PER_HEIGHT_CM;

  return Math.ceil(rawPriceCents / 1000) * 1000;
}

export function formatPriceCents(priceCents: number | null) {
  if (priceCents == null) return "Cena pojawi się po wpisaniu wysokości";

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
