import type { MetadataRoute } from "next";

import { SITE } from "@/constants/site";

const routes = ["", "/courses", "/projects", "/blog", "/videos", "/shop", "/portfolio", "/ai"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
