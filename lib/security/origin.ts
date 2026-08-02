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
    normalizeOrigin(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined,
    ),
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
