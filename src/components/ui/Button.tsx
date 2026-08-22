import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PointerEvent as ReactPointerEvent,
  Ref,
  ReactNode,
} from "react";
import { useEffect, useRef } from "react";
import TransitionLink from "../layout/TransitionLink";
import type { LinkProps } from "react-router-dom";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  /** Off by default — none of the existing CTAs use an icon. */
  icon?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    to?: undefined;
    href?: undefined;
  };

type ButtonAsInternalLink = ButtonBaseProps &
  Omit<LinkProps, "className" | "children"> & {
    to: LinkProps["to"];
    href?: undefined;
  };

type ButtonAsExternalLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    to?: undefined;
  };

export type ButtonProps =
  | ButtonAsButton
  | ButtonAsInternalLink
  | ButtonAsExternalLink;

const BASE = [
  "group relative inline-flex items-center justify-center",
  "max-w-full",
  "font-semibold uppercase tracking-[0.08em]",
  "transition-colors duration-300",
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const SIZES: Record<Size, string> = {
  sm: "rounded-full px-4 py-2.5 text-[11px] sm:px-5 sm:py-3 sm:text-xs",
  md: "rounded-full px-5 py-3 text-[11px] sm:px-6 sm:py-3.5 sm:text-xs",
  lg: "rounded-full px-6 py-3.5 text-xs sm:px-7 sm:py-4 sm:text-sm",
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-white text-black hover:bg-[var(--color-accent)] hover:text-white",
  secondary:
    "border border-white/20 text-white hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  ghost: "text-white/60 hover:text-white",
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      aria-hidden="true"
    >
      <path
        d="M3 11L11 3M11 3H4.5M11 3V9.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/*
 * ============================================================
 * MAGNETIC HOVER
 *
 * Previously only Header's hand-rolled "Let's Talk" CTA had this
 * (its own ctaRef + quickTo wrapper living in Header.tsx) — every
 * other <Button> on the site (Contact, Introduction, etc.) had a
 * flat color-only hover, which read as inconsistent. Built in here
 * instead, so EVERY button gets the same pull automatically and
 * Header's duplicate wrapper can be retired.
 *
 * Same fix pattern documented elsewhere in this codebase (Header's
 * NavItem, TiltCard): reset goes through the SAME quickTo setters
 * as pointer-move, never a competing gsap.to — otherwise repeated
 * hover/leave cycles silently kill the internal quickTo tween via
 * GSAP's overwrite manager.
 *
 * IMPORTANT: magneticRef must be attached to the OUTER interactive
 * element (the <a>/<button>/TransitionLink itself), not to the
 * inner label span. The button — its full shape, background, and
 * border — is the magnetic object; the label just rides along
 * inside it. Attaching the transform to the inner span instead
 * makes the text drift independently while the button's visible
 * bounds stay put, which reads as broken.
 * ============================================================
 */
const MAGNETIC_STRENGTH = 0.3;
const MAGNETIC_DURATION = 0.45;

function useMagnetic<T extends HTMLElement>() {
  const magneticRef = useRef<T>(null);
  const moveX = useRef<((v: number) => void) | null>(null);
  const moveY = useRef<((v: number) => void) | null>(null);

  useEffect(() => {
    const el = magneticRef.current;
    if (!el || prefersReducedMotion) return;

    moveX.current = gsap.quickTo(el, "x", {
      duration: MAGNETIC_DURATION,
      ease: "power3.out",
    });
    moveY.current = gsap.quickTo(el, "y", {
      duration: MAGNETIC_DURATION,
      ease: "power3.out",
    });

    return () => {
      moveX.current = null;
      moveY.current = null;
      gsap.killTweensOf(el);
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    // Touch (and pen-as-touch) pointers fire pointermove during normal
    // scrolling/tapping — reacting to those would drag the button
    // toward whatever point the finger last touched and, since touch
    // rarely fires a matching pointerleave, can leave it stuck off-
    // center. Only real mouse input drives the magnetic pull; every
    // other pointer type is a no-op, so the button stays completely
    // normal (and easy to tap) on touch devices.
    if (
      prefersReducedMotion ||
      event.pointerType !== "mouse" ||
      !moveX.current ||
      !moveY.current
    ) {
      return;
    }

    // Pointer handlers and the magnetic ref now live on the same
    // element (the outer button), so currentTarget IS magneticRef.current
    // — this is just being explicit rather than relying on that always
    // being true.
    const target = magneticRef.current ?? event.currentTarget;
    const rect = target.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    moveX.current(offsetX * MAGNETIC_STRENGTH);
    moveY.current(offsetY * MAGNETIC_STRENGTH);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    moveX.current?.(0);
    moveY.current?.(0);
  };

  return { magneticRef, handlePointerMove, handlePointerLeave };
}

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon = false,
    className,
    children,
    ...rest
  } = props;

  const { magneticRef, handlePointerMove, handlePointerLeave } = useMagnetic<
    HTMLAnchorElement | HTMLButtonElement
  >();

  const classes = cx(
    BASE,
    // will-change-transform now lives on the element GSAP actually
    // animates (the outer button), not the inner label.
    "will-change-transform",
    variant === "ghost" ? "px-0 py-0" : SIZES[size],
    VARIANTS[variant],
    className,
  );

  // Purely structural now — no ref, no transform target. The label
  // and icon just sit in normal flow inside the (moving) button.
  const content = (
    <span className="inline-flex items-center gap-2">
      <span>{children}</span>
      {icon && <Arrow />}
    </span>
  );

  const pointerHandlers = {
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  };

  /*
   * FIX (cursor circle reverses direction on click/approach):
   * `data-cursor="highlight"` used to live on `magneticRef` itself —
   * the very element the magnetic effect drags toward the pointer
   * via a GSAP transform. CustomCursor re-reads that element's
   * getBoundingClientRect() every animation frame and eases its
   * circle toward it, so the circle ended up chasing a target that
   * was *also* chasing the mouse, on a different easing curve
   * (GSAP power3.out/0.45s vs. the cursor's own 0.22 lerp). The two
   * catch up to each other out of phase right as you move in to
   * click, which reads as the circle snapping backwards.
   *
   * `data-cursor` now lives on this inline-flex wrapper instead.
   * Being unstransformed and in normal flow, its rect always matches
   * the button's true (pre-magnetic) layout position/size — a
   * stable target, same pattern already used for Header's NavItem
   * and TiltCard. The actual interactive element still carries
   * magneticRef and still visually drifts inside it.
   */
  if ("to" in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest as ButtonAsInternalLink;
    return (
      <span className="inline-flex" data-cursor="highlight">
        <TransitionLink
          ref={magneticRef as Ref<HTMLAnchorElement>}
          to={to}
          className={classes}
          {...pointerHandlers}
          {...linkRest}
        >
          {content}
        </TransitionLink>
      </span>
    );
  }

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsExternalLink;
    return (
      <span className="inline-flex" data-cursor="highlight">
        <a
          ref={magneticRef as Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...pointerHandlers}
          {...anchorRest}
        >
          {content}
        </a>
      </span>
    );
  }

  const buttonRest = rest as ButtonAsButton;
  return (
    <span className="inline-flex" data-cursor="highlight">
      <button
        ref={magneticRef as Ref<HTMLButtonElement>}
        type={buttonRest.type ?? "button"}
        className={classes}
        {...pointerHandlers}
        {...buttonRest}
      >
        {content}
      </button>
    </span>
  );
}
