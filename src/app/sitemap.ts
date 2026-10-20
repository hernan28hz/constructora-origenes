import type { MetadataRoute } from "next";
import { pages, siteUrl, type PagePath } from "@/content/seo";

// Solo entran las páginas con `indexable: true` (ver src/content/seo.ts).
export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(pages) as PagePath[])
    .filter((path) => pages[path].indexable)
    .map((path) => ({
      url: path === "/" ? siteUrl : `${siteUrl}${path}`,
      priority: path === "/" ? 1 : 0.7,
    }));
}
