import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content/blog";
import { getAllServices } from "@/lib/content/services";
import { SITE_URL } from "@/lib/constants";
import { IS_PRODUCTION } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Preview/staging must not advertise a discovery list of production URLs.
  if (!IS_PRODUCTION) return [];

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
  }));

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter(
      (post) =>
        post.seo?.index !== false &&
        (!post.seo?.canonicalPath ||
          post.seo.canonicalPath === `/blog/${post.slug}`),
    )
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    }));

  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter(
      (service) =>
        service.seo?.index !== false &&
        (!service.seo?.canonicalPath ||
          service.seo.canonicalPath === `/services/${service.slug}`),
    )
    .map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
    }));

  return [...staticRoutes, ...postRoutes, ...serviceRoutes];
}
