import { forwardRef, type MouseEvent, type ReactNode } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  type LinkProps,
} from "react-router-dom";
import { gsap } from "gsap";
import { transitionCellRefs } from "../../lib/transitionCellRefs";
import { notifyPageReady } from "../../lib/pageReady";
import { transitionState } from "../../lib/transitionState";

type TransitionLinkProps = LinkProps & {
  children: ReactNode;
};

const STAGGER = {
  each: 0.02,
  grid: [5, 8] as [number, number],
  from: "start" as const,
  axis: "x" as const,
};

// forwardRef so consumers that need direct DOM access to the <a> — e.g.
// Header's NavItem, which measures pointer position against the link
// for its magnetic-hover effect — can attach a ref the same way they
// would to a plain react-router Link. Without this, `ref={...}` on a
// TransitionLink would silently do nothing (function components can't
// receive refs unless wrapped in forwardRef).
const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ children, to, onClick, ...props }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();

      const destination = typeof to === "string" ? to : (to.pathname ?? "/");

      if (destination === location.pathname || transitionState.isAnimating) {
        return;
      }

      const { purple1, black, purple2 } = transitionCellRefs;

      if (!purple1.length || !black.length || !purple2.length) {
        navigate(to);
        return;
      }

      transitionState.isAnimating = true;

      [purple1, black, purple2].forEach((cells) => {
        gsap.set(cells, { scaleY: 0, transformOrigin: "bottom" });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          transitionState.isAnimating = false;
          // The new page is now fully uncovered — let its usePageEnter
          // (registered while it was hidden behind the cover) run its
          // reveal animation now, same as the initial Loader does.
          notifyPageReady();
        },
      });

      // COVER — each layer's cubes grow up from the bottom of their own
      // cell, column-staggered for a smooth left-to-right wave.
      tl.to(
        purple1,
        { scaleY: 1, duration: 0.55, ease: "power4.inOut", stagger: STAGGER },
        0,
      )
        .to(
          black,
          { scaleY: 1, duration: 0.55, ease: "power4.inOut", stagger: STAGGER },
          0.18,
        )
        .to(
          purple2,
          { scaleY: 1, duration: 0.55, ease: "power4.inOut", stagger: STAGGER },
          0.36,
        )

        .call(() => navigate(to), [], 0.95)
        .to({}, { duration: 0.15 }) // brief hold, fully covered

        // Flip the anchor before shrinking, so cubes recede upward off the
        // top of their cell instead of back down where they came from —
        // keeps the motion reading as one continuous vertical direction.
        .call(() => {
          [purple2, black, purple1].forEach((cells) => {
            gsap.set(cells, { transformOrigin: "top" });
          });
        })

        // REVEAL — same wave, in reverse layer order, shrinking away.
        .to(
          purple2,
          { scaleY: 0, duration: 0.55, ease: "power4.inOut", stagger: STAGGER },
          "+=0",
        )
        .to(
          black,
          { scaleY: 0, duration: 0.55, ease: "power4.inOut", stagger: STAGGER },
          "-=0.4",
        )
        .to(
          purple1,
          { scaleY: 0, duration: 0.55, ease: "power4.inOut", stagger: STAGGER },
          "-=0.4",
        );
    };

    return (
      <Link ref={ref} to={to} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  },
);

TransitionLink.displayName = "TransitionLink";

export default TransitionLink;
