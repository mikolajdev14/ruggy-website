const normalizeOrigin = (value: string | undefined) => {
  if (!value) return null;

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );

    if (
      process.env.NODE_ENV === "production" &&
      url.protocol !== "https:"
    ) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
};

const getConfiguredOrigins = () =>
  [
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL),
    normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL),
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    // Vercel exposes the current deployment and branch URLs as trusted server
    // environment variables. This keeps preview checkouts working without
    // trusting an arbitrary Origin header.
    normalizeOrigin(process.env.VERCEL_URL),
    normalizeOrigin(process.env.VERCEL_BRANCH_URL),
    // Local development can use production values in the shared .env file.
    // Never add these origins in a production build.
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : ["https://ruggy.pl"]),
  ].filter((origin): origin is string => Boolean(origin));

/** Returns a configured origin, never an arbitrary request supplied origin. */
export const getTrustedAppOrigin = (requestOrigin: string | null) => {
  const configuredOrigins = getConfiguredOrigins();
  const fallbackOrigin = configuredOrigins[0];

  if (!requestOrigin) {
    return fallbackOrigin ?? null;
  }

  const candidate = normalizeOrigin(requestOrigin);

  return candidate && configuredOrigins.includes(candidate) ? candidate : null;
};

/**
 * Stripe return URLs always use an application-owned origin. A matching
 * request origin keeps the customer on the current deployment. A missing or
 * unexpected origin is ignored in favour of the configured canonical origin,
 * so it can never become an open redirect or block a legitimate checkout.
 */
export const getCheckoutReturnOrigin = (requestOrigin: string | null) =>
  getTrustedAppOrigin(requestOrigin) ?? getTrustedAppOrigin(null);
