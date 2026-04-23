import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/scenes", "/a/"] },
    ],
    sitemap: "https://dispatch-011.gemclaw.click/sitemap.xml",
    host: "https://dispatch-011.gemclaw.click",
  };
}
