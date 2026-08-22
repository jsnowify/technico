import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { onPageReady } from "../lib/pageReady";

const TITLE_SELECTOR = "[data-reveal-title] [data-reveal-line]";
const STAGGER_SELECTOR = "[data-reveal-stagger] > *";

export function usePageEnter(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const titleEls = Array.from(
      root.querySelectorAll<HTMLElement>(TITLE_SELECTOR),
    );
    const staggerEls = Array.from(
      root.querySelectorAll<HTMLElement>(STAGGER_SELECTOR),
    );

    // Hide immediately so there's no flash of fully-visible content
    // while we wait for whatever is covering the screen right now
    // (Loader on first load, PageTransition's cube wave on navigation)
    // to finish. Guard each set independently — a page may use only
    // one of the two reveal patterns, and calling gsap.set/to with an
    // empty target list logs a "target not found" console warning.
    if (titleEls.length) gsap.set(titleEls, { yPercent: 100 });
    if (staggerEls.length) gsap.set(staggerEls, { autoAlpha: 0, y: 16 });

    if (!titleEls.length && !staggerEls.length) return;

    let ctx: gsap.Context | undefined;

    const unsubscribe = onPageReady(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        if (titleEls.length) {
          tl.to(titleEls, {
            yPercent: 0,
            duration: 0.75,
            ease: "power4.out",
            stagger: 0.06,
          });
        }

        if (staggerEls.length) {
          tl.to(
            staggerEls,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.05,
            },
            titleEls.length ? "-=0.35" : 0,
          );
        }
      }, root);
    });

    return () => {
      unsubscribe();
      ctx?.revert();
    };
  }, [containerRef]);
}
