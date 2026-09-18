"use client";

import { useEffect, useRef, useState } from "react";

const READING_LINE_PX = 160;

export default function BlogContents({
  headings,
  readTime,
}: {
  headings: { id: string; text: string }[];
  readTime: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (!root || !desktop.matches || headings.length === 0) return;

    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;

    let tops: number[] = [];
    let articleEnd = 0;
    let frame = 0;
    let visible = false;
    const measure = () => {
      tops = elements.map(
        (element) => element.getBoundingClientRect().top + window.scrollY,
      );
      const last = elements[elements.length - 1];
      articleEnd =
        last.getBoundingClientRect().top + window.scrollY + last.offsetHeight;
    };
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      let current = elements[0];
      for (let index = 0; index < elements.length; index += 1) {
        if (tops[index] - READING_LINE_PX <= y) current = elements[index];
      }
      setActiveId(current.id);
      const span = Math.max(articleEnd - tops[0], 1);
      setProgress(
        Math.min(Math.max((y + READING_LINE_PX - tops[0]) / span, 0), 1),
      );
    };
    const schedule = () => {
      if (visible && !document.hidden && !frame) {
        frame = requestAnimationFrame(update);
      }
    };
    const resize = () => {
      measure();
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    measure();
    observer.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", schedule);
      cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div
      ref={rootRef}
      className="hidden self-start lg:sticky lg:top-32 lg:block"
    >
      <div className="border border-white/20">
        <div className="border-b border-white/20 p-5 font-mono text-xs tracking-[0.05em] text-content-muted uppercase">
          {"// Content"}
        </div>
        <nav className="flex flex-col">
          {headings.map(({ id, text }, index) => {
            const active = id === activeId;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active ? "location" : undefined}
                className={`border-b border-white/15 px-5 py-4 text-xs leading-[1.35] uppercase transition-colors last:border-b-0 ${
                  active
                    ? "bg-accent text-black-bg"
                    : "text-content hover:bg-accent-surface"
                }`}
              >
                <span className="mr-2 font-mono">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {text}
              </a>
            );
          })}
        </nav>
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-accent"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="p-5 font-mono text-xs text-content-muted uppercase">
          {readTime}
        </div>
      </div>
    </div>
  );
}
