// Checkout collects the courier address in separate fields so each part can be
// validated on its own and prefilled by the browser, but a booking stores one
// ready-to-copy line — that is what the admin panel shows and what goes onto a
// shipping label. Both the paid (Stripe metadata) and the quote path compose it
// here so the stored format never drifts between them.
export type DeliveryAddressParts = {
  deliveryStreet?: string | null;
  deliveryBuildingNumber?: string | null;
  deliveryPostalCode?: string | null;
  deliveryCity?: string | null;
};

export const formatDeliveryAddress = (parts: DeliveryAddressParts) => {
  const street = [parts.deliveryStreet, parts.deliveryBuildingNumber]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const locality = [parts.deliveryPostalCode, parts.deliveryCity]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return [street, locality].filter(Boolean).join(", ");
};

export const POSTAL_CODE_PATTERN = /^\d{2}-\d{3}$/;

// A locker code alone ("KRA01A") says nothing about where to drive, so when the
// customer picked the point on the map we keep its address next to the code.
// Typed-in codes have no address and stay as they were.
export const formatParcelLocker = (parts: {
  parcelLockerCode?: string | null;
  parcelLockerAddress?: string | null;
}) =>
  [parts.parcelLockerCode, parts.parcelLockerAddress]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
