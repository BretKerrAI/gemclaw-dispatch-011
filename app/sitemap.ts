import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://dispatch-011.gemclaw.click/",
      lastModified: new Date("2026-04-23"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
