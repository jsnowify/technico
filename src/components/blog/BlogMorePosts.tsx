import Link from "next/link";
import Button from "@/components/ui/Button";
import GridCorners from "@/components/ui/GridCorners";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import PixelRevealImage from "@/components/home/PixelRevealImage";
import { formatPostDate } from "@/lib/utils/date";

export interface MorePostCard {
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
}

/**
 * "More posts" strip shown at the very end of a blog post, after the FAQ
 * and before the footer. Cards match the ones on the /blog index; the
 * caller decides which posts to pass in (see app/blog/[slug]/page.tsx).
 */
export default function BlogMorePosts({ posts }: { posts: MorePostCard[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="blog-more-posts-title"
      className="bg-black-bg py-16 sm:py-20 lg:py-24"
    >
      <div className="container-x mx-auto w-full max-w-[1920px]">
        <header className="flex flex-col gap-6 border-t border-white/20 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:text-xs">
              <span aria-hidden="true">/</span>
              <span>Keep reading</span>
            </p>
            <h2
              id="blog-more-posts-title"
              className="h2-section mt-5 max-w-[22ch] leading-[1.08] font-medium tracking-heading text-white-text"
            >
              More posts from the blog
            </h2>
          </div>
          <Button to="/blog" variant="underline">
            View all posts
          </Button>
        </header>

        <div className="relative mt-10 grid grid-cols-1 border-t border-l border-white/20 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          <GridCorners />
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-stagger-hover
              data-cursor="highlight"
              className="group relative flex min-w-0 flex-col overflow-hidden border-r border-b border-white/20"
            >
              <HorizontalStaggerRows />
              <div className="relative aspect-[4/3] overflow-hidden border-b border-white/20">
                <PixelRevealImage
                  src={post.coverImage}
                  alt={post.title}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  revealId={`blog-more-${post.slug}`}
                />
              </div>
              <div className="relative flex min-h-44 flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.04em] uppercase">
                  <span className="text-content-muted">
                    <time dateTime={post.publishedAt}>
                      {formatPostDate(post.publishedAt)}
                    </time>{" "}
                    · {post.readTime}
                  </span>
                  <span className="text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="h3-section mt-auto max-w-[26ch] pt-8 leading-[1.15] font-medium tracking-heading text-white-text">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
