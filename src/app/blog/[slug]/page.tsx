import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import JsonLd from "@/components/seo/JsonLd";
import BlogHero from "@/components/blog/BlogHero";
import BlogContents from "@/components/blog/BlogContents";
import BlogShare from "@/components/blog/BlogShare";
import { renderBlogBlock } from "@/components/blog/renderBlogBlock";
import FAQ from "@/components/ui/FAQ";
import { estimateReadingTime } from "@/lib/utils/reading-time";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { BlogBodyBlock, BlogContentBlock } from "@/lib/content/types";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.coverImage,
  });
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  const readTime = estimateReadingTime(post.content);

  // Headings become the ToC panel's topic list — a post with none
  // just renders without that panel (see BlogContents.tsx).
  const headings = post.content
    .filter((block) => block.type === "heading")
    .map(({ id, text }) => ({ id, text }));

  // "faq" blocks render full-width below the three-rail row (same
  // as ServiceFAQ elsewhere on the site) instead of squeezed into
  // the narrow article column — everything else stays inline.
  const bodyBlocks = post.content.filter(
    (block): block is BlogBodyBlock => block.type !== "faq",
  );
  const faqBlocks = post.content.filter(
    (block): block is Extract<BlogContentBlock, { type: "faq" }> =>
      block.type === "faq",
  );

  return (
    <article>
      <JsonLd data={articleJsonLd} />
      <BlogHero
        title={post.title}
        coverImage={post.coverImage}
        publishedAt={post.publishedAt}
        readTime={readTime}
        author={post.author}
      />
      {/* ==============================================================
          BODY — three-rail layout
          --------------------------------------------------------------
          Left rail: "CONTENT" table of contents (BlogContents) — its
          active-heading underline and progress bar are scroll-driven,
          computed client-side against the `id`s set on the <h2>s
          below. Right rail: the SHARE panel. Both use the same
          `lg:sticky lg:top-32` approach so they pin independently
          within this row and release once the row (i.e. the article)
          ends.

          This site's theme is dark (see Hero, ContactSection, and
          BlogHero right above this), so the article body stays on
          the same black background rather than breaking into its
          own white card — no bg class needed here since it now
          inherits the page's own bg-black-bg (see globals.css).
          Body copy uses text-white/70 (same convention as
          ContactSection) instead of the dark text-black-text color
          so it stays readable against black.
          ============================================================== */}
      <div className="container-x mx-auto grid w-full max-w-[1920px] grid-cols-1 items-start py-16 sm:py-20 lg:grid-cols-[220px_minmax(0,820px)_58px] lg:justify-between lg:gap-10 lg:py-24">
        <BlogContents headings={headings} readTime={readTime} />

        <div className="min-w-0 space-y-5 text-base leading-[1.75] text-content sm:text-lg">
          {bodyBlocks.map((block, i) => renderBlogBlock(block, i))}
        </div>

        <BlogShare url={`${SITE_URL}/blog/${slug}`} title={post.title} />
      </div>

      {faqBlocks.map((block, i) => (
        <FAQ
          key={i}
          heading={
            <>
              {block.headline[0]}
              <br />
              {block.headline[1]}
            </>
          }
          cta={block.cta}
          items={block.items}
          includeJsonLd={false}
        />
      ))}

      {post.disclaimer && (
        <div className="container-x mx-auto pb-16">
          <p className="font-mono text-sm leading-relaxed text-content-muted">
            {post.disclaimer}
          </p>
        </div>
      )}
    </article>
  );
}
