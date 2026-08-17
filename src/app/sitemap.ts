import type { MetadataRoute } from "next";

const baseUrl = "https://www.nepalwoodexpo.com";

const routes = [
  "",
  "/about-organizers",
  "/about-show",
  "/venue",
  "/exhibitor-profile",
  "/exhibitor-registration",
  "/visitor-profile",
  "/visitor-registration",
  "/gallery",
  "/contact",
  "/privacy-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
