"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { isSiteReady } from "@/lib/site-ready";

/**
 * CLIENT-SIDE PAGE TRANSITION
 *
 * This is intentionally separate from PreLoader. First arrival still belongs
 * to PreLoader; this persistent layout component only runs on internal route
 * changes. Horizontal stripes wipe over the OLD route, display the TARGET
 * page name, and wipe away after Next.js commits the NEW route.
 *
 * No square fill, counter, router replacement, or experimental View
 * Transitions API. One GSAP owner per overlay; no animation of page children.
 */
const STRIPE_COUNT = 4;
const NAVIGATION_TIMEOUT_MS = 5_000;
// Four staggered compositor-only stripes: ~0.55s to cover, a short readable
// page-name hold, ~0.57s to reveal. Navigation is prefetched during the cover
// but only committed AFTER the old page is fully hidden; this prevents the
// destination hero from popping into view through unfinished stripes.
const COVER_DURATION = 0.4;
const REVEAL_DURATION = 0.42;
const STRIPE_STAGGER = 0.05;
const LABEL_HOLD_DURATION = 0.22;
const MARK_DURATION = 0.22;
const TRANSITION_EASE = "power3.inOut";

type Phase = "idle" | "covering" | "waiting" | "revealing";

type PendingNavigation = {
  phase: Phase;
  history: boolean;
  committed: boolean;
};

const PAGE_NAMES: Record<string, string> = {
  "": "HOME",
  services: "SERVICES",
  about: "ABOUT",
  blog: "BLOG",
  contact: "CONTACT US",
};

function normalizePath(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

function getPageName(path: string): string {
  const segments = normalizePath(path).split("/").filter(Boolean);
  if (!segments.length) return PAGE_NAMES[""];

  // Detail pages show the page that was opened rather than only "SERVICES"
  // or "BLOG". For example /services/search-engine-optimization ->
  // "SEARCH ENGINE OPTIMIZATION".
  const last = segments[segments.length - 1];
  if (segments.length === 1)
    return PAGE_NAMES[last] ?? last.replace(/-/g, " ").toUpperCase();

  try {
    return decodeURIComponent(last).replace(/[-_]/g, " ").toUpperCase();
  } catch {
    return last.replace(/[-_]/g, " ").toUpperCase();
  }
}

function shouldAnimateLink(
  event: MouseEvent,
  anchor: HTMLAnchorElement,
): URL | null {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    anchor.hasAttribute("download") ||
    anchor.hasAttribute("data-no-page-transition") ||
    (anchor.target !== "" && anchor.target !== "_self") ||
    anchor.rel.split(/\s+/).includes("external")
  ) {
    return null;
  }

  let destination: URL;
  try {
    destination = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }

  if (destination.origin !== window.location.origin) return null;
  if (destination.protocol !== "http:" && destination.protocol !== "https:")
    return null;
  if (destination.pathname.startsWith("/api/")) return null;
  if (/\.(?:pdf|png|jpe?g|webp|svg|gif|mp4|zip)$/i.test(destination.pathname))
    return null;

  // Leave same-page hashes/search changes to Next/browser. No visual wipe
  // when clicking an anchor inside the already-open page.
  if (
    normalizePath(destination.pathname) ===
    normalizePath(window.location.pathname)
  ) {
    return null;
  }

  return destination;
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const routerRef = useRef(router);
  const overlayRef = useRef<HTMLDivElement>(null);
  const marksRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const unlockRef = useRef<(() => void) | null>(null);
  const lastPathRef = useRef(pathname);
  const transitionControllerRef = useRef<{
    revealPage: () => void;
    hideOverlay: () => void;
  } | null>(null);
  const pendingRef = useRef<PendingNavigation>({
    phase: "idle",
    history: false,
    committed: false,
  });

  // Keep the router fresh while the event listeners remain mounted once.
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // Mounted once in app/layout.tsx. These refs survive every App Router page.
  useEffect(() => {
    const overlay = overlayRef.current;
    const marks = marksRef.current;
    const label = labelRef.current;
    if (!overlay || !marks || !label) return;

    const stripes = Array.from(
      overlay.querySelectorAll<HTMLElement>("[data-page-transition-stripe]"),
    );

    const cancelTimeout = () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };

    const unlockScroll = () => {
      unlockRef.current?.();
      unlockRef.current = null;
    };

    const lockScroll = () => {
      // The brief overlay itself intercepts taps; avoid toggling root
      // overflow (a forced layout and iOS scroll-position jump) on phones.
      if (window.matchMedia("(pointer: coarse)").matches) return;
      if (unlockRef.current) return;
      const html = document.documentElement;
      const previousHtmlOverflow = html.style.overflow;
      html.style.overflow = "hidden";

      // Only own the root lock. MobileNav independently owns body overflow;
      // restoring its temporary "hidden" value here could leave the new page
      // permanently locked after the menu has already closed.
      unlockRef.current = () => {
        html.style.overflow = previousHtmlOverflow;
      };
    };

    const hideOverlay = () => {
      cancelTimeout();
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(marks, { autoAlpha: 0 });
      gsap.set(stripes, { scaleX: 0, clearProps: "willChange" });
      overlay.setAttribute("aria-hidden", "true");
      unlockScroll();
      pendingRef.current = {
        phase: "idle",
        history: false,
        committed: false,
      };
    };

    const showOverlay = (destination: string) => {
      const pageName = getPageName(destination);
      label.textContent = pageName;
      overlay.setAttribute("aria-label", `Opening ${pageName}`);
      overlay.setAttribute("aria-hidden", "false");
      gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(stripes, { willChange: "transform" });
    };

    const revealPage = () => {
      if (pendingRef.current.phase !== "waiting") return;
      pendingRef.current.phase = "revealing";
      cancelTimeout();

      // The destination has committed beneath the fully covered overlay.
      // Hold its label briefly, then reveal without animating page children.
      timelineRef.current?.kill();
      timelineRef.current = gsap.timeline({ onComplete: hideOverlay });
      timelineRef.current
        .to(
          marks,
          { autoAlpha: 0, y: -10, duration: 0.2, ease: "power2.in" },
          LABEL_HOLD_DURATION,
        )
        .to(
          stripes,
          {
            scaleX: 0,
            duration: REVEAL_DURATION,
            ease: TRANSITION_EASE,
            stagger: { each: STRIPE_STAGGER, from: "start" },
          },
          LABEL_HOLD_DURATION,
        );
    };

    const animateCover = (onCovered: () => void) => {
      timelineRef.current?.kill();
      timelineRef.current = gsap.timeline({ onComplete: onCovered });
      timelineRef.current
        // One batched transform tween keeps all stripes on the compositor.
        .to(stripes, {
          scaleX: 1,
          duration: COVER_DURATION,
          ease: TRANSITION_EASE,
          stagger: { each: STRIPE_STAGGER, from: "start" },
        })
        .fromTo(
          marks,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: MARK_DURATION, ease: "power2.out" },
          0.3,
        );
    };

    const coverPage = (destination: URL) => {
      const pending = pendingRef.current;
      if (pending.phase !== "idle") return;

      pendingRef.current = {
        phase: "covering",
        history: false,
        committed: false,
      };
      lockScroll();
      showOverlay(destination.pathname);
      gsap.set(marks, { autoAlpha: 0 });
      gsap.set(stripes, { scaleX: 0 });

      const href = `${destination.pathname}${destination.search}${destination.hash}`;

      // Prefetch while the cover moves, but do NOT commit the new route yet.
      // An immediate router.push can display the new hero through stripes
      // that have not finished covering the previous page.
      try {
        routerRef.current.prefetch(href);
      } catch {
        // Prefetch is only a performance hint; navigation still works.
      }

      animateCover(() => {
        if (pendingRef.current.phase !== "covering") return;
        pendingRef.current.phase = "waiting";

        try {
          routerRef.current.push(href, { scroll: true });
        } catch {
          hideOverlay();
          return;
        }

        if (pendingRef.current.committed) {
          revealPage();
          return;
        }
        timeoutRef.current = window.setTimeout(() => {
          if (pendingRef.current.phase === "waiting") hideOverlay();
        }, NAVIGATION_TIMEOUT_MS);
      });
    };

    const onClick = (event: MouseEvent) => {
      if (prefersReducedMotion || !isSiteReady()) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const destination = shouldAnimateLink(event, anchor);
      if (!destination) return;

      if (pendingRef.current.phase !== "idle") {
        event.preventDefault();
        return;
      }

      // Capture-phase preventDefault lets existing next/link and the mobile
      // menu's onClick callbacks run, without Next navigating prematurely.
      event.preventDefault();
      coverPage(destination);
    };

    const onPopState = () => {
      if (prefersReducedMotion || !isSiteReady()) return;
      const destination = normalizePath(window.location.pathname);
      if (destination === normalizePath(lastPathRef.current)) return;

      cancelTimeout();
      timelineRef.current?.kill();
      pendingRef.current = {
        phase: "covering",
        history: true,
        committed: false,
      };
      lockScroll();
      showOverlay(destination);
      gsap.set(stripes, { scaleX: 0 });
      gsap.set(marks, { autoAlpha: 0 });

      // Popstate changes history before it can be intercepted. Cover the new
      // route with the same eased wipe, then reveal once both animation and
      // the App Router commit are complete.
      animateCover(() => {
        const pending = pendingRef.current;
        if (pending.phase !== "covering" || !pending.history) return;
        pending.phase = "waiting";

        if (pending.committed) {
          revealPage();
          return;
        }

        timeoutRef.current = window.setTimeout(
          hideOverlay,
          NAVIGATION_TIMEOUT_MS,
        );
      });
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    // usePathname's separate effect below handles completion. Registering
    // listeners only once avoids killing in-flight animations on route renders.
    const controller = { revealPage, hideOverlay };
    transitionControllerRef.current = controller;
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      if (transitionControllerRef.current === controller) {
        transitionControllerRef.current = null;
      }
      hideOverlay();
    };
  }, []);

  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;
    const pending = pendingRef.current;
    pending.committed = true;
    if (pending.phase === "waiting") {
      // If Next unexpectedly redirected, still reveal the resolved page.
      transitionControllerRef.current?.revealPage();
    }
    // For un-intercepted programmatic redirects, no overlay was started.
    // We deliberately don't replay the loader after page changes.
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-hidden="true"
      aria-live="polite"
      className="fixed inset-0 z-[99998] invisible overflow-hidden pointer-events-none text-black-text"
      style={{ height: "100dvh", visibility: "hidden", pointerEvents: "none" }}
    >
      {Array.from({ length: STRIPE_COUNT }, (_, index) => (
        <span
          key={index}
          data-page-transition-stripe
          aria-hidden="true"
          className="absolute left-0 w-full bg-white-bg"
          style={{
            top: `${(index * 100) / STRIPE_COUNT}%`,
            height: `calc(${100 / STRIPE_COUNT}% + 2px)`,
            transform: "scaleX(0)",
            transformOrigin: index % 2 === 0 ? "left center" : "right center",
            backgroundColor: "var(--color-white-bg, #fbfbfe)",
          }}
        />
      ))}

      {/* PreLoader's registration-mark language, minus its filling square.
          The page name replaces the first-load 000–100 counter. */}
      <div
        ref={marksRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0"
      >
        <div className="relative flex h-[clamp(152px,18vw,210px)] w-[clamp(152px,18vw,210px)] items-center justify-center border border-black-text/20">
          {[
            "-left-2 -top-3",
            "-right-2 -top-3",
            "-left-2 -bottom-3",
            "-right-2 -bottom-3",
          ].map((position) => (
            <span
              key={position}
              aria-hidden="true"
              className={`absolute ${position} font-mono text-xl font-light leading-none`}
            >
              +
            </span>
          ))}
          <span
            ref={labelRef}
            className="max-w-[92%] break-words px-2 text-center font-mono text-[clamp(0.8rem,2vw,1.05rem)] font-medium leading-snug tracking-[0.1em] uppercase"
          />
        </div>
      </div>
    </div>
  );
}
