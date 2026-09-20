"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Persistent desktop CTA using the same connected-grid language as the site. */
export default function StickyConnectCTA() {
  const pathname = usePathname();
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const main = document.querySelector("main");
    if (!link || !main) return;

    let frame = 0;
    let hidden = false;

    const update = () => {
      frame = 0;
      const mainBottom = main.offsetTop + main.offsetHeight;
      const nextHidden = window.scrollY + window.innerHeight > mainBottom + 1;
      if (nextHidden === hidden) return;
      hidden = nextHidden;
      link.style.pointerEvents = hidden ? "none" : "";

      if (prefersReducedMotion) {
        gsap.set(link, { autoAlpha: hidden ? 0 : 1, y: hidden ? 14 : 0 });
        return;
      }

      gsap.to(link, {
        autoAlpha: hidden ? 0 : 1,
        y: hidden ? 14 : 0,
        duration: hidden ? 0.28 : 0.42,
        ease: hidden ? "power2.in" : "power3.out",
        overwrite: true,
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(link);
      link.style.pointerEvents = "";
    };
  }, [pathname]);

  if (pathname === "/contact") return null;

  return (
    <Link
      ref={linkRef}
      href="/contact"
      aria-label="Let's Connect"
      data-stagger-hover
      data-stagger-static
      className="group !fixed right-6 bottom-6 z-[95] hidden h-28 w-28 grid-rows-[30px_1fr_30px] overflow-hidden border border-black-bg/30 bg-accent text-black-bg shadow-[6px_6px_0_rgba(0,0,0,0.28)] sm:grid lg:right-8 lg:bottom-8 lg:h-32 lg:w-32"
    >
      <HorizontalStaggerRows />

      <span className="relative z-[1] flex items-center justify-between border-b border-black-bg/25 px-2.5 font-mono text-[8px] tracking-[0.05em] uppercase">
        <span>/ CTA</span>
        <span>+</span>
      </span>

      <span className="relative z-[1] flex items-center px-3 font-mono text-[15px] font-bold leading-[0.95] tracking-[-0.06em] uppercase lg:text-[17px]">
        Let&apos;s
        <br />
        connect
      </span>

      <span className="relative z-[1] flex items-center border-t border-black-bg/25 px-2.5 font-mono text-[9px] uppercase">
        <span>Start</span>
      </span>
    </Link>
  );
}
