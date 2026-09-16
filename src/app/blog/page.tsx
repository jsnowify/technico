import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/content/blog";
import { estimateReadingTime } from "@/lib/utils/reading-time";
import BlogCategoryGrid from "@/components/blog/BlogCategoryGrid";

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
      <div className="container-x mx-auto flex flex-col gap-16 pt-24 pb-24 sm:pt-28">
        <div className="relative aspect-[1272/500] w-full">
          <svg
            viewBox="0 0 1272 500"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <clipPath id="blogHeroNotch">
                <path d="M-4.10887e-05 30.0001C-4.25372e-05 13.4316 13.4314 0.000110028 30 0.000108579L322 8.30516e-05C338.569 8.16032e-05 352 13.4315 352 30.0001L352 62.0001C352 78.5686 365.431 92.0001 382 92.0001L890 92C906.568 92 920 78.5686 920 62L920 30C920 13.4315 933.431 2.95986e-05 950 2.81501e-05L1242 2.62268e-06C1258.57 1.17421e-06 1272 13.4315 1272 30L1272 470C1272 486.569 1258.57 500 1242 500L30 500C13.4315 500 -1.17422e-06 486.569 -2.62268e-06 470L-4.10887e-05 30.0001Z" />
              </clipPath>
            </defs>
            <image
              href="https://res.cloudinary.com/dp9bjis3z/image/upload/v1789361404/temporary-placeholder/blog_k83lrr.jpg"
              x="0"
              y="0"
              width="1272"
              height="500"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#blogHeroNotch)"
            />
          </svg>

          <div
            className="absolute top-0 flex items-center justify-center"
            style={{ left: "27.673%", width: "44.654%", height: "18.4%" }}
          >
            <h1 className="h1-hero leading-[0.98] font-medium tracking-[-0.04em] text-white">
              Explore our blog
            </h1>
          </div>
        </div>

        <BlogCategoryGrid posts={cards} />
      </div>
    </div>
  );
}
