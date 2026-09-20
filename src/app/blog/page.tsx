import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/content/blog";
import { estimateReadingTime } from "@/lib/utils/reading-time";
import BlogCategoryGrid from "@/components/blog/BlogCategoryGrid";
import BlogIndexHero from "@/components/blog/BlogIndexHero";
import BlogIndexHeroReveal from "@/components/blog/BlogIndexHeroReveal";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Insights on web development, SEO, and technology strategy.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const cards = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    coverImage: post.coverImage,
    readTime: estimateReadingTime(post.content),
  }));

  return (
    <div className="bg-black-bg">
      <div className="home-hero-stack relative isolate h-[200svh] bg-black-bg">
        <div className="home-hero-panel absolute inset-x-0 top-0 z-10 h-[100svh]">
          <BlogIndexHero />
        </div>
        <div className="home-reveal-panel sticky top-0 z-0 h-[100svh]">
          <BlogIndexHeroReveal />
        </div>
      </div>

      <section id="blog-journal" className="bg-black-bg py-16 sm:py-20 lg:py-24">
        <div className="container-x mx-auto w-full max-w-[1920px]">
          <BlogCategoryGrid posts={cards} />
        </div>
      </section>
    </div>
  );
}
