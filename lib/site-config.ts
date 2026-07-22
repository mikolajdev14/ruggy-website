const normalizeSiteUrl = (value: string | undefined) => {
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
};

const configuredUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL) ??
  "http://localhost:3000";

export const siteConfig = {
  name: "Ruggy",
  alternateName: "Wujek Dywaniarz",
  title: "Ruggy | Ręcznie tuftowane dywany na zamówienie",
  description:
    "Ręcznie tuftowane dywany na zamówienie, tworzone w Polsce na podstawie zdjęcia, szkicu lub własnego pomysłu.",
  url: configuredUrl,
  locale: "pl_PL",
  instagram: "https://www.instagram.com/ruggy.pl/",
} as const;

export const absoluteUrl = (path = "/") =>
  new URL(path, `${siteConfig.url}/`).toString();
