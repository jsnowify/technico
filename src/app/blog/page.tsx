import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getAllPosts } from "@/lib/content/blog";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Insights on web development, SEO, and technology strategy.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-black-text">
        Blog
      </h1>
      <ul className="mt-12 space-y-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <h2 className="text-xl font-semibold text-black-text">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-purple-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-accent"
              >
                {post.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-black-text/50">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </p>
            <p className="mt-2 text-black-text/70">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
