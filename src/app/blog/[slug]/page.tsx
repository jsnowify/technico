import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts, getPostBySlug } from "@/lib/content/blog";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd data={articleJsonLd} />
      <h1 className="text-4xl font-semibold tracking-tight text-black-text">
        {post.title}
      </h1>
      <p className="mt-2 text-sm text-black-text/50">
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {" · "}
        {post.author}
      </p>
      <div className="mt-8 space-y-4 text-lg leading-8 text-black-text/70">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
