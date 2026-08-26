import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/el-coro", changeFrequency: "monthly", priority: 0.9 },
  { path: "/ciclo", changeFrequency: "monthly", priority: 0.9 },
  { path: "/agenda", changeFrequency: "weekly", priority: 0.9 },
  { path: "/archivo", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contacto", changeFrequency: "yearly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }));
}
