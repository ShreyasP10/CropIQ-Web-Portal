import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changefreq: "weekly" as const },
    { path: "/features", priority: 0.9, changefreq: "weekly" as const },
    { path: "/download", priority: 0.9, changefreq: "weekly" as const },
    { path: "/about", priority: 0.8, changefreq: "monthly" as const },
    { path: "/support", priority: 0.8, changefreq: "monthly" as const },
    { path: "/privacy-policy", priority: 0.5, changefreq: "yearly" as const },
    { path: "/terms", priority: 0.5, changefreq: "yearly" as const },
  ];

  return routes.map(({ path, priority, changefreq }) => ({
    url: `${SITE_CONFIG.url}${path}`,
    lastModified: new Date(),
    changeFrequency: changefreq,
    priority,
  }));
}