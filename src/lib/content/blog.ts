import type { BlogPost } from "@/lib/content/types";

/**
 * Hardcoded for now. Swap the array below for a CMS/markdown fetch later —
 * getAllPosts() and getPostBySlug() are already async so calling code
 * (sitemap.ts, app/blog/**) won't need to change.
 */
const posts: BlogPost[] = [
  {
    slug: "why-seo-ready-architecture-matters",
    title: "Why SEO-Ready Architecture Matters From Day One",
    excerpt:
      "Metadata, sitemaps, and structured data are far cheaper to build in from the start than to retrofit.",
    content: [
      "Retrofitting SEO into an existing app usually means auditing every route for missing metadata, broken canonical URLs, and an out-of-date sitemap — work that's largely avoidable.",
      "Building the metadata and content layer alongside the routes themselves means every new page inherits the same conventions automatically.",
    ],
    coverImage: "/og-image.jpg",
    publishedAt: "2026-01-15",
    updatedAt: "2026-01-15",
    author: "Technico Digital Solutions",
    tags: ["seo", "architecture"],
  },
];

export async function getAllPosts(): Promise<BlogPost[]> {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  return posts.find((p) => p.slug === slug);
}
