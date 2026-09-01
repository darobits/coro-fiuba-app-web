import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified: string;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1, lastModified: "2026-08-27" },
  { path: "/el-coro", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-08-26" },
  { path: "/ciclo", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-08-26" },
  { path: "/agenda", changeFrequency: "weekly", priority: 0.9, lastModified: "2026-08-26" },
  { path: "/archivo", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-09-01" },
  { path: "/archivo/compartir", changeFrequency: "yearly", priority: 0.7, lastModified: "2026-09-01" },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.8, lastModified: "2026-08-26" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${lastModified}T00:00:00-03:00`),
    changeFrequency,
    priority,
  }));
}
