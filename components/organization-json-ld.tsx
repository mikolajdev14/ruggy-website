import { absoluteUrl, siteConfig } from "@/lib/site-config";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl("/icon"),
    image: absoluteUrl("/opengraph-image"),
    sameAs: [siteConfig.instagram],
    areaServed: {
      "@type": "Country",
      name: "Polska",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
