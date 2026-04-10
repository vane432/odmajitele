import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://odmajitele.com";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/chat`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/kategorie/nemovitosti`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/kategorie/auta`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/kategorie/firmy`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/pruvodce/od-majitele-brno`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pruvodce/jak-prodat-nemovitost-od-majitele`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pruvodce/jak-koupit-auto-od-majitele`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/admin`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
}
