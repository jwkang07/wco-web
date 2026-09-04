import type { MetadataRoute } from "next";
import { absoluteUrl, sitemapPaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/contact" ? 0.8 : 0.7,
  }));
}
