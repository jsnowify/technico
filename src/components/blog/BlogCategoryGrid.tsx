"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ================================================================
   BLOG CATEGORY GRID
   ----------------------------------------------------------------
   The interactive half of the blog index: a row of category tabs
   ("All" + one tab per distinct `post.category`, each with a count)
   above a responsive card grid. Selecting a tab filters the grid
   client-side — no route change, no reload — which is the only
   reason this needs to be a client component; the page around it
   (hero panel, metadata, data fetching) stays a server component.
   ================================================================ */

interface BlogCardData {
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  readTime: string;
}

interface BlogCategoryGridProps {
  posts: BlogCardData[];
}

export default function BlogCategoryGrid({ posts }: BlogCategoryGridProps) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [posts]);

  const [active, setActive] = useState<string | null>(null);

  const visiblePosts =
    active === null ? posts : posts.filter((post) => post.category === active);

  return (
    <div className="flex flex-col gap-10">
      {/* ============================================================
          CATEGORY TABS
          ============================================================ */}
      <nav
        aria-label="Filter posts by category"
        className="flex flex-wrap items-center gap-x-6 gap-y-3"
      >
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          data-cursor="highlight"
          className={`tracking-heading text-[38px] transition-colors ${
            active === null
              ? "font-medium text-white"
              : "font-normal text-white/40 hover:text-white/70"
          }`}
        >
          explore all{" "}
          <span className="text-[18px] text-white/30">({posts.length})</span>
        </button>

        {categories.map(({ name, count }) => {
          const isActive = active === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setActive(name)}
              aria-pressed={isActive}
              data-cursor="highlight"
              className={`tracking-heading text-[38px] transition-colors ${
                isActive
                  ? "font-medium text-white"
                  : "font-normal text-white/40 hover:text-white/70"
              }`}
            >
              {name.toLowerCase()}{" "}
              <span className="text-[18px] text-white/30">({count})</span>
            </button>
          );
        })}
      </nav>

      {/* ============================================================
          CARD GRID
          ============================================================ */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            data-cursor="highlight"
            className="group flex flex-col gap-3"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#1A1B1E]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <span className="font-mono text-[11px] font-light tracking-[-0.01em] text-white/40 uppercase">
              {post.readTime}
            </span>

            <h3 className="text-base leading-snug font-semibold text-white">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
