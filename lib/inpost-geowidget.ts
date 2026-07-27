// InPost Geowidget v5 — the official parcel-locker map, embedded as a custom
// element that InPost serves from its own CDN.
//
// The token is generated in Manager Paczek (Moje Konto → API → Geowidget) and
// is bound to the domain given there, so it is safe to expose in the browser —
// it is not the ShipX API key. Without it the widget refuses to render, which
// is why the checkout only offers the map when the token is configured and
// otherwise falls back to typing the code by hand.
//
// Environment variables:
//   NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN — token from Manager Paczek
//   NEXT_PUBLIC_INPOST_GEOWIDGET_ENV   — "sandbox" for localhost testing
//
// A sandbox token only works against the sandbox host and vice versa, so the
// host is picked from the same env that produced the token.
const PRODUCTION_HOST = "https://geowidget.inpost.pl";
const SANDBOX_HOST = "https://sandbox-easy-geowidget-sdk.easypack24.net";

// Next inlines NEXT_PUBLIC_* at build time, so they have to be read as whole
// static expressions — no dynamic process.env[key] lookups.
const token = process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN?.trim() ?? "";
const host =
  process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_ENV?.trim() === "sandbox"
    ? SANDBOX_HOST
    : PRODUCTION_HOST;

export const GEOWIDGET_TOKEN = token;
export const GEOWIDGET_SCRIPT_URL = `${host}/inpost-geowidget.js`;
export const GEOWIDGET_STYLE_URL = `${host}/inpost-geowidget.css`;

/** Points that hand out prepaid parcels — Ruggy orders are paid up front. */
export const GEOWIDGET_CONFIG = "parcelCollect";

export const isGeowidgetConfigured = token.length > 0;

/**
 * The widget posts the picked point from its iframe and forwards whatever the
 * API returned, so treat every field as optional: the payload shape is not
 * part of a versioned contract.
 */
export type GeowidgetPoint = {
  name?: string;
  address?: { line1?: string; line2?: string };
  address_details?: {
    street?: string;
    building_number?: string;
    flat_number?: string;
    post_code?: string;
    city?: string;
  };
  location_description?: string;
};

const joinParts = (parts: Array<string | undefined>, separator: string) =>
  parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(separator);

/** Human-readable address of a picked point, for the courier label. */
export const formatGeowidgetPointAddress = (point: GeowidgetPoint) => {
  const preformatted = joinParts(
    [point.address?.line1, point.address?.line2],
    ", ",
  );

  if (preformatted) {
    return preformatted;
  }

  const details = point.address_details;
  const building = joinParts(
    [details?.building_number, details?.flat_number],
    "/",
  );

  return joinParts(
    [
      joinParts([details?.street, building], " "),
      joinParts([details?.post_code, details?.city], " "),
    ],
    ", ",
  );
};
