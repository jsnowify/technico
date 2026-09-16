"use client";

import { useEffect, useState } from "react";

/* ================================================================
   BLOG CONTENTS — sticky left-rail table of contents
   ----------------------------------------------------------------
   Blog-specific UI, mirrors BlogShare's sticky approach on the
   opposite rail: a dark pill, a small "CONTENT" label, the post's
   headings as links, a horizontal reading-progress bar, and the
   estimated read time.

   Unlike BlogShare, this ONE part genuinely needs JS: which topic
   is "active" and how far the purple bar should fill both depend
   on the live scroll position relative to each heading in the
   article, which plain `position: sticky` / CSS has no way to
   express. The panel's own pinned-in-place behavior is still plain
   CSS sticky (`lg:sticky lg:top-32`), same as BlogShare — only the
   active-heading + progress-bar values are computed from scroll.

   Renders nothing if the post has no heading blocks (see
   BlogContentBlock in lib/content/types.ts) — a ToC with zero
   topics isn't useful.
   ================================================================ */

interface BlogContentsProps {
  headings: { id: string; text: string }[];
  readTime: string;
}

/** How far from the top of the viewport counts as "currently reading". */
const READING_LINE_PX = 160;

export default function BlogContents({
  headings,
  readTime,
}: BlogContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingEls = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    const lastEl = headingEls[headingEls.length - 1];

    // Cached absolute (document-relative) positions — measured once
    // up front and again on resize, never inside the scroll handler
    // itself. Reading `getBoundingClientRect()` for every heading on
    // every scroll frame forces a synchronous layout each time, which
    // is the main source of scroll jank on a long article; once
    // cached, the scroll handler below only does plain arithmetic
    // against `window.scrollY`.
    let tops: number[] = [];
    let articleEnd = 0;

    const measure = () => {
      tops = headingEls.map(
        (el) => el.getBoundingClientRect().top + window.scrollY,
      );
      articleEnd =
        lastEl.getBoundingClientRect().top +
        window.scrollY +
        lastEl.offsetHeight;
    };

    let rafId = 0;

    const update = () => {
      rafId = 0;
      const y = window.scrollY;

      // Active topic: the last heading whose (cached) top has
      // scrolled up past the reading line.
      let current = headingEls[0];
      for (let i = 0; i < headingEls.length; i++) {
        if (tops[i] - READING_LINE_PX <= y) {
          current = headingEls[i];
        }
      }
      setActiveId(current.id);

      // Reading progress across the span from the first heading to
      // the end of the article, clamped to [0, 1].
      const start = tops[0];
      const span = Math.max(articleEnd - start, 1);
      const scrolled = y + READING_LINE_PX - start;
      setProgress(Math.min(Math.max(scrolled / span, 0), 1));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    // A resize can change every heading's position (reflow, font
    // load, viewport width change), so re-measure there — this is
    // the only place `getBoundingClientRect()` runs after mount.
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden self-start lg:sticky lg:top-32 lg:block lg:h-fit lg:w-[220px]">
      <div className="flex flex-col gap-5 rounded-[20px] bg-[#1A1B1E] p-6">
        <span className="font-mono text-[11px] font-light tracking-[0.14em] text-white/50 uppercase">
          Content
        </span>

        <nav className="flex flex-col gap-3">
          {headings.map(({ id, text }) => {
            const isActive = id === activeId;
            return (
              <a
                key={id}
                href={`#${id}`}
                data-cursor="highlight"
                aria-current={isActive ? "location" : undefined}
                className={`text-[12px] leading-snug uppercase transition-colors ${
                  isActive
                    ? "font-semibold text-white underline underline-offset-4"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {text}
              </a>
            );
          })}
        </nav>

        <div className="h-px w-full bg-white/10">
          <div
            className="h-px bg-purple-secondary"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <span className="font-mono text-[11px] font-light tracking-[-0.01em] text-white/50 uppercase">
          {readTime}
        </span>
      </div>
    </div>
  );
}
