import type { MetadataRoute } from "next";
import { providers } from "@/lib/data/providers";
import { programmes } from "@/lib/data/programs";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/find", priority: 0.9 },
    { path: "/education", priority: 0.9 },
    { path: "/content-studio", priority: 0.8 },
    { path: "/list-business", priority: 0.7 },
    { path: "/submit-correction", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route.priority,
    })),
    ...programmes.map((programme) => ({
      url: absoluteUrl(`/programs/${programme.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...providers
      .filter((provider) => provider.status === "published")
      .map((provider) => ({
        url: absoluteUrl(`/providers/${provider.slug}`),
        lastModified: new Date(provider.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
