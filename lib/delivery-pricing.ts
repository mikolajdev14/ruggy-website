import { formatPriceCents } from "@/lib/custom-rug-price";

// Delivery is a flat rate per method, and it drops to zero once the rug crosses
// the free-delivery threshold. The threshold looks at the rug price alone — not
// the anti-slip mat — so the cost shown next to the delivery options is the one
// the customer ends up paying, no matter what they answer in the add-on dialog.
export type DeliveryMethod = "parcel_locker" | "courier";

export const DELIVERY_PRICE_CENTS: Record<DeliveryMethod, number> = {
  parcel_locker: 1700,
  courier: 1900,
};

export const DELIVERY_LABEL: Record<DeliveryMethod, string> = {
  parcel_locker: "Paczkomat InPost",
  courier: "Kurier InPost",
};

export const FREE_DELIVERY_THRESHOLD_CENTS = 80000;

export const FREE_DELIVERY_HINT = `Dostawa gratis przy zamówieniu od ${formatPriceCents(
  FREE_DELIVERY_THRESHOLD_CENTS,
)}`;

export function qualifiesForFreeDelivery(
  rugPriceCents: number | null | undefined,
) {
  return rugPriceCents != null && rugPriceCents >= FREE_DELIVERY_THRESHOLD_CENTS;
}

export function calculateDeliveryCostCents(
  deliveryMethod: DeliveryMethod | "" | null | undefined,
  rugPriceCents: number | null | undefined,
) {
  if (!deliveryMethod) return null;

  return qualifiesForFreeDelivery(rugPriceCents)
    ? 0
    : DELIVERY_PRICE_CENTS[deliveryMethod];
}

export function formatDeliveryCostCents(costCents: number) {
  return costCents === 0 ? "Gratis" : formatPriceCents(costCents);
}

export function formatDeliveryLineItemName(deliveryMethod: DeliveryMethod) {
  return `Dostawa · ${DELIVERY_LABEL[deliveryMethod]}`;
}
