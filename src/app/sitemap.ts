import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content/blog";
import { getAllServices } from "@/lib/content/services";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services] = await Promise.all([
    getAllPosts(),
    getAllServices(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/services",
    "/about",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...serviceRoutes];
}
