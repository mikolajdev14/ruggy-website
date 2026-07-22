import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

const publicPages = [
  "",
  "/realizacje",
  "/zamow",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPages.map((path, index) => ({
    url: absoluteUrl(path || "/"),
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path === "/zamow" ? 0.9 : 0.8,
  }));
}
