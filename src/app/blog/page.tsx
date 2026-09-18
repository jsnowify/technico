import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/content/blog";
import { estimateReadingTime } from "@/lib/utils/reading-time";
import BlogCategoryGrid from "@/components/blog/BlogCategoryGrid";
import EditorialHeader from "@/components/ui/EditorialHeader";
import GridCorners from "@/components/ui/GridCorners";
import PixelRevealImage from "@/components/home/PixelRevealImage";

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
      <div className="container-x mx-auto w-full max-w-[1920px] pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28">
        <EditorialHeader
          label="Blog"
          headingLevel="h1"
          title="Explore our blog"
        />
        <figure className="relative mt-10 aspect-[4/3] overflow-hidden border border-white/20 sm:mt-14 sm:aspect-[16/7]">
          <GridCorners />
          <PixelRevealImage
            src="https://res.cloudinary.com/dp9bjis3z/image/upload/v1789361404/temporary-placeholder/blog_k83lrr.jpg"
            alt=""
            sizes="(min-width: 1920px) 1740px, 100vw"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex justify-between bg-black-bg/85 p-4 font-mono text-[10px] tracking-[0.06em] text-content uppercase backdrop-blur-sm sm:p-5 sm:text-xs">
            <span>{"// Insights"}</span>
            <span>Journal / 00</span>
          </figcaption>
        </figure>
        <div className="mt-16 sm:mt-20">
          <BlogCategoryGrid posts={cards} />
        </div>
      </div>
    </div>
  );
}
