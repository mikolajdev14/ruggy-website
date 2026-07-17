export const CUSTOM_RUG_MIN_PRICE_CENTS = 24900;
export const CUSTOM_RUG_RATE_CENTS_PER_SQUARE_METER = 42000;
export const CUSTOM_RUG_MIN_DIMENSION_CM = 20;
export const CUSTOM_RUG_MAX_DIMENSION_CM = 300;

export function calculateCustomRugPriceCents(
  widthCm: number | null | undefined,
  heightCm: number | null | undefined,
) {
  if (
    !Number.isFinite(widthCm) ||
    !Number.isFinite(heightCm) ||
    widthCm == null ||
    heightCm == null ||
    widthCm < CUSTOM_RUG_MIN_DIMENSION_CM ||
    heightCm < CUSTOM_RUG_MIN_DIMENSION_CM ||
    widthCm > CUSTOM_RUG_MAX_DIMENSION_CM ||
    heightCm > CUSTOM_RUG_MAX_DIMENSION_CM
  ) {
    return null;
  }

  const areaSquareMeters = (widthCm * heightCm) / 10000;
  const rawPriceCents =
    CUSTOM_RUG_MIN_PRICE_CENTS +
    areaSquareMeters * CUSTOM_RUG_RATE_CENTS_PER_SQUARE_METER;

  return Math.ceil(rawPriceCents / 1000) * 1000;
}

export function formatPriceCents(priceCents: number | null) {
  if (priceCents == null) return "Cena pojawi się po wpisaniu wymiarów";

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
