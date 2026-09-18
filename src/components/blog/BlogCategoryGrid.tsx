"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PixelRevealImage from "@/components/home/PixelRevealImage";
import GridCorners from "@/components/ui/GridCorners";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";

interface BlogCardData {
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  readTime: string;
}

export default function BlogCategoryGrid({ posts }: { posts: BlogCardData[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return Array.from(counts.entries());
  }, [posts]);
  const [active, setActive] = useState<string | null>(null);
  const visiblePosts = active
    ? posts.filter((post) => post.category === active)
    : posts;

  return (
    <section aria-label="Blog posts">
      <nav
        aria-label="Filter posts by category"
        className="flex flex-wrap border-y border-white/20"
      >
        <FilterButton
          label="Explore all"
          count={posts.length}
          active={active === null}
          onClick={() => setActive(null)}
        />
        {categories.map(([name, count]) => (
          <FilterButton
            key={name}
            label={name}
            count={count}
            active={active === name}
            onClick={() => setActive(name)}
          />
        ))}
      </nav>

      <div className="relative mt-12 grid grid-cols-1 border-t border-l border-white/20 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        <GridCorners />
        {visiblePosts.map((post, index) => (
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
              />
            </div>
            <div className="relative flex min-h-44 flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.04em] uppercase">
                <span className="text-content-muted">{post.readTime}</span>
                <span className="text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="h3-section mt-auto max-w-[26ch] pt-8 leading-[1.15] font-medium tracking-heading text-white-text">
                {post.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border-r border-white/20 px-4 py-4 text-left font-mono text-xs tracking-[0.035em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent sm:px-5 ${
        active
          ? "bg-accent text-black-bg"
          : "text-content hover:bg-accent-surface"
      }`}
    >
      {label} <span aria-hidden="true">({count})</span>
    </button>
  );
}
