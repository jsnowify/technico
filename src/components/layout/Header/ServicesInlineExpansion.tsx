"use client";

import type { RefObject } from "react";
import Link from "next/link";
import type { Service } from "@/lib/content/types";

interface ServicesInlineExpansionProps {
  wrapRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  columns: Service[][];
  navExpanded: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

/**
 * The "connected" services expansion — the grid that grows out of the
 * bottom of the pill header itself once scrolled (as opposed to the
 * floating dropdown panel used before scrolling; see
 * ServicesDropdownPanel). Height/visibility are driven by GSAP in
 * Header/index.tsx via wrapRef/contentRef — this component only owns
 * markup.
 */
export default function ServicesInlineExpansion({
  wrapRef,
  contentRef,
  columns,
  navExpanded,
  onPointerEnter,
  onPointerLeave,
}: ServicesInlineExpansionProps) {
  return (
    <div
      ref={wrapRef}
      aria-hidden={!navExpanded}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="relative z-10 hidden w-full overflow-hidden lg:block"
      style={{ height: 0, opacity: 0 }}
    >
      <div
        ref={contentRef}
        className="grid grid-cols-1 gap-x-10 gap-y-6 px-2 pb-8 pt-2 sm:grid-cols-3"
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-3">
            {column.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                data-cursor="highlight"
                className="text-sm text-black/80 transition-colors hover:text-black"
              >
                {service.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
