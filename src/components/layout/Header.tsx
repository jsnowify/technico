import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import TransitionLink from "./TransitionLink";
import Button from "../../components/ui/Button";
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
  supportsFinePointer,
} from "../../lib/gsap";

const NAV_LINKS = [
  { label: "SERVICES", href: "/services", hasDropdown: true },
  { label: "ABOUT", href: "/about", hasDropdown: false },
  { label: "BLOG", href: "/blog", hasDropdown: false },
  { label: "CONTACT US", href: "/contact", hasDropdown: false },
] as const;

const SERVICE_CATEGORIES = [
  {
    label: "Branding & Creative",
    items: ["Branding", "Creative Design", "Copywriting"],
  },
  {
    label: "Websites",
    items: [
      "Website Design & Development",
      "Ecommerce",
      "Platforms & Web Apps",
      "SEO",
      "PPC",
    ],
  },
  {
    label: "Strategic Marketing",
    items: [
      "Social Media",
      "Email Marketing",
      "Media Buying & Digital Advertising",
      "Social Media Management",
    ],
  },
] as const;

const SCROLL_THRESHOLD = 80;

const TOP_STATE = {
  maxWidth: 1280,
  marginTop: 0,
  marginLeft: 0,
  marginRight: 0,
  paddingLeft: 24,
  paddingRight: 24,
  borderRadius: 0,
  height: 80,
};

const PILL_STATE = {
  maxWidth: 760,
  marginTop: 16,
  // Side inset so the pill actually floats off the screen edges on
  // narrow viewports instead of stretching full-bleed (it has no
  // max-width headroom to shrink into below ~760px wide, so without
  // this it just reads as a squashed full-width bar).
  marginLeft: 16,
  marginRight: 16,
  paddingLeft: 28,
  paddingRight: 28,
  borderRadius: 15,
  height: 60,
};

const DROPDOWN_RADIUS = 20;

/* ================================================================
    SLIDING TEXT
    ================================================================

    IMPORTANT:

    This component has NO pointer handlers.

    The parent <a> is the only hover hit target.

    This prevents the animated text from accidentally firing
    pointer-enter / pointer-leave events and fighting with the
    navigation's global hoveredNav state.

    The animation itself is VERTICAL.

    Idle:

      ABOUT
      -----

    Hover:

      ABOUT
        ↓
      ABOUT

    Two identical layers slide through an overflow-hidden viewport.
    GSAP controls the transforms directly; React only controls the
    semantic `isHovered` state.
    ================================================================ */

interface SlidingTextProps {
  text: string;
  isHovered: boolean;
}

const SlidingText = ({ text, isHovered }: SlidingTextProps) => {
  const viewportRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const viewport = viewportRef.current;
      const current = currentRef.current;
      const next = nextRef.current;

      if (!viewport || !current || !next) return;

      if (prefersReducedMotion) {
        gsap.set(current, {
          yPercent: 0,
          opacity: 1,
        });

        gsap.set(next, {
          yPercent: 100,
          opacity: 1,
        });

        return;
      }

      /*
       * Hover:
       *
       * current:  0% -> -100%
       * next:     100% -> 0%
       *
       * This gives the vertical editorial slide.
       *
       * Leave:
       *
       * current:  -100% -> 0%
       * next:       0% -> 100%
       *
       * Everything is overwritten instead of queued.
       */
      if (isHovered) {
        gsap.killTweensOf([current, next]);

        gsap.to(current, {
          yPercent: -100,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });

        gsap.to(next, {
          yPercent: 0,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.killTweensOf([current, next]);

        gsap.to(current, {
          yPercent: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });

        gsap.to(next, {
          yPercent: 100,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
      }
    },
    {
      dependencies: [isHovered],
    },
  );

  return (
    <span
      ref={viewportRef}
      aria-hidden="true"
      className="
          relative
          inline-block
          h-[1.15em]
          min-w-0
          overflow-hidden
          align-middle
        "
    >
      {/* Original label */}
      <span
        ref={currentRef}
        className="
            block
            whitespace-nowrap
            will-change-transform
          "
      >
        {text}
      </span>

      {/* Replacement label */}
      <span
        ref={nextRef}
        className="
            absolute
            inset-x-0
            top-0
            block
            whitespace-nowrap
            will-change-transform
          "
      >
        {text}
      </span>
    </span>
  );
};

/* ================================================================
    NAV ITEM
    ================================================================ */

const BRACKET_IDLE_OFFSET = 5;
const BRACKET_HOVER_OFFSET = 8;

/*
  * Magnetic tuning.

  * The previous values were technically working but the pull was
  * subtle enough that it could disappear behind the text animation.

  * These values make the effect noticeably magnetic without making
  * the navigation feel loose or floaty.
  */
const MAGNETIC_MAX_X = 10;
const MAGNETIC_MAX_Y = 7;
const MAGNETIC_STRENGTH = 0.42;
const MAGNETIC_RADIUS = 110;

const MAGNETIC_PULL_DURATION = 0.22;

const clamp = (value: number, max: number) =>
  Math.max(-max, Math.min(max, value));

interface NavItemProps {
  label: string;
  href: string;
  active: boolean;
  dimmed: boolean;
  scrolled: boolean;
  ariaExpanded?: boolean;

  onHoverStart?: () => void;
  onHoverEnd?: () => void;

  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem = ({
  label,
  href,
  active,
  dimmed,
  scrolled,
  ariaExpanded,
  onHoverStart,
  onHoverEnd,
  onClick,
}: NavItemProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const magneticRef = useRef<HTMLSpanElement>(null);

  const leftBracketRef = useRef<HTMLSpanElement>(null);
  const rightBracketRef = useRef<HTMLSpanElement>(null);

  const magneticXRef = useRef<((value: number) => void) | null>(null);
  const magneticYRef = useRef<((value: number) => void) | null>(null);

  /* ==============================================================
      MAGNETIC SETUP

      FIX (repeated-hover bug):

      quickTo() holds a single persistent internal tween per
      target+property for the lifetime of these closures. Any
      OTHER tween created later that touches the same properties
      on the same element (e.g. a separate gsap.to(..., { x: 0 })
      with overwrite: true) will kill that internal tween via
      GSAP's overwrite manager — even though it isn't the tween
      that was actually running at that moment.

      Once that internal tween is killed, the quickTo setters
      (magneticXRef/magneticYRef) are left driving a dead tween.
      This degrades silently over repeated hover cycles instead of
      failing immediately, which is why the bug only appears after
      several hovers on the SAME item and never affects a
      previously-unused item.

      The fix is below, in resetMagnetic(): reset now goes through
      the SAME quickTo setters instead of creating a competing
      tween, so there is only ever one tween instance owning
      x/y on this element for its entire mounted life.
      ============================================================== */

  useGSAP(() => {
    const magnetic = magneticRef.current;

    // Coarse-pointer devices (phones, and tablets like landscape iPad
    // that are wide enough to hit the desktop nav layout) never get a
    // real hover — skip setting up the magnetic quickTo tweens
    // entirely rather than let a touch tap register as a hover.
    if (!magnetic || prefersReducedMotion || !supportsFinePointer) return;

    const moveX = gsap.quickTo(magnetic, "x", {
      duration: MAGNETIC_PULL_DURATION,
      ease: "power3.out",
      overwrite: true,
    });

    const moveY = gsap.quickTo(magnetic, "y", {
      duration: MAGNETIC_PULL_DURATION,
      ease: "power3.out",
      overwrite: true,
    });

    magneticXRef.current = moveX;
    magneticYRef.current = moveY;

    return () => {
      magneticXRef.current = null;
      magneticYRef.current = null;

      gsap.killTweensOf(magnetic);
    };
  }, []);

  /* ==============================================================
      BRACKET ANIMATION
      ============================================================== */

  useGSAP(
    () => {
      const left = leftBracketRef.current;
      const right = rightBracketRef.current;

      if (!left || !right) return;

      const offset = active ? BRACKET_HOVER_OFFSET : BRACKET_IDLE_OFFSET;

      if (prefersReducedMotion) {
        gsap.set(left, {
          x: -offset,
        });

        gsap.set(right, {
          x: offset,
        });

        return;
      }

      gsap.to(left, {
        x: -offset,
        duration: 0.26,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(right, {
        x: offset,
        duration: 0.26,
        ease: "power3.out",
        overwrite: true,
      });
    },
    {
      dependencies: [active],
    },
  );

  /* ==============================================================
      MAGNETIC POINTER MOVE

      VERY IMPORTANT:

      The pointer position is always measured against the stationary
      <a>, never against magneticRef.

      magneticRef is the element that moves.

      linkRef is the stable coordinate system.
      ============================================================== */

  const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    // Matches Button.tsx's useMagnetic fix: touch (and pen-as-touch)
    // pointers fire pointermove during ordinary scrolling/tapping, so
    // reacting to those would drag the link toward wherever the
    // finger last was and, since touch rarely fires a matching
    // pointerleave, leave it stuck off-center. Only real mouse input
    // drives the pull.
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !magneticXRef.current ||
      !magneticYRef.current ||
      !linkRef.current
    ) {
      return;
    }

    const rect = linkRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = event.clientX - centerX;
    const offsetY = event.clientY - centerY;

    const distance = Math.hypot(offsetX, offsetY);

    const linear = Math.max(0, 1 - distance / MAGNETIC_RADIUS);

    /*
     * Smootherstep.
     *
     * This makes the magnetic force strong around the item center
     * while naturally disappearing near the edge of the field.
     */
    const falloff = linear * linear * (3 - 2 * linear);

    const targetX = clamp(
      offsetX * MAGNETIC_STRENGTH * falloff,
      MAGNETIC_MAX_X,
    );

    const targetY = clamp(
      offsetY * MAGNETIC_STRENGTH * falloff,
      MAGNETIC_MAX_Y,
    );

    magneticXRef.current(targetX);
    magneticYRef.current(targetY);
  };

  /* ==============================================================
      MAGNETIC RESET

      FIX (repeated-hover bug):

      This previously created an independent gsap.to(magnetic, {
      x: 0, y: 0, ..., overwrite: true }) tween. Because it targets
      the same element and properties as the quickTo setters above,
      its overwrite: true would end up killing the internal tween
      that quickTo relies on, silently breaking the setters after
      enough hover/leave cycles.

      Routing the reset through the SAME quickTo setters means
      there is only ever one tween instance controlling x/y on
      this element, so nothing can overwrite it out from under
      itself. quickTo remains valid indefinitely.
      ============================================================== */

  const resetMagnetic = () => {
    if (!magneticXRef.current || !magneticYRef.current) return;

    magneticXRef.current(0);
    magneticYRef.current(0);
  };

  /* ==============================================================
      RENDER

      NOTE:

      There are intentionally NO pointer events on SlidingText.

      The <a> owns the entire interaction.

      TEXT COLOR:

      Normal state (not scrolled, transparent top bar)   -> text-white
      Scrolled / white pill state                        -> text-black

      The "dimmed" hover-fade behavior is preserved in both states,
      it just fades toward the appropriate base color.

      CURSOR:

      data-cursor="highlight" goes on THIS <a>, not on magneticRef.
      linkRef/this element is the stable coordinate system the
      magnetic pull is measured against, so it's also the correct
      stable target for the custom cursor to snap onto — the box
      stays put around the whole link slot while the text inside
      does its own independent magnetic drift.
      ============================================================== */

  return (
    <TransitionLink
      ref={linkRef}
      to={href}
      data-cursor="highlight"
      aria-expanded={ariaExpanded}
      onClick={onClick}
      onPointerEnter={() => {
        onHoverStart?.();
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        resetMagnetic();
        onHoverEnd?.();
      }}
      className={`
          relative
          inline-flex
          items-center
          font-mono
          text-sm
          tracking-wide
          transition-colors
          duration-300
          ${
            scrolled
              ? dimmed
                ? "text-black/35"
                : "text-black"
              : dimmed
                ? "text-white/40"
                : "text-white"
          }
        `}
    >
      <span
        ref={magneticRef}
        className="
            inline-flex
            items-center
            will-change-transform
          "
      >
        {/* LEFT BRACKET */}

        <span
          ref={leftBracketRef}
          aria-hidden="true"
          className="
              inline-block
              will-change-transform
            "
          style={{
            transform: `translateX(-${BRACKET_IDLE_OFFSET}px)`,
          }}
        >
          [
        </span>

        {/* TEXT */}

        <SlidingText text={label} isHovered={active} />

        {/* RIGHT BRACKET */}

        <span
          ref={rightBracketRef}
          aria-hidden="true"
          className="
              inline-block
              will-change-transform
            "
          style={{
            transform: `translateX(${BRACKET_IDLE_OFFSET}px)`,
          }}
        >
          ]
        </span>
      </span>
    </TransitionLink>
  );
};

/* ================================================================
    MOBILE MENU BUTTON
    ================================================================ */

interface MobileMenuButtonProps {
  open: boolean;
  onClick: () => void;
}

const MobileMenuButton = ({ open, onClick }: MobileMenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="
          relative
          z-[120]
          flex
          h-11
          w-11
          items-center
          justify-center
          lg:hidden
        "
    >
      <span className="relative block h-5 w-6">
        <span
          className={`
              absolute
              left-0
              top-0
              block
              h-[1.5px]
              w-full
              bg-current
              transition-all
              duration-500
              ease-[cubic-bezier(0.77,0,0.175,1)]
              ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}
            `}
        />

        <span
          className={`
              absolute
              left-0
              top-1/2
              block
              h-[1.5px]
              w-full
              -translate-y-1/2
              bg-current
              transition-all
              duration-300
              ${open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"}
            `}
        />

        <span
          className={`
              absolute
              bottom-0
              left-0
              block
              h-[1.5px]
              w-full
              bg-current
              transition-all
              duration-500
              ease-[cubic-bezier(0.77,0,0.175,1)]
              ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}
            `}
        />
      </span>
    </button>
  );
};

/* ================================================================
    HEADER
    ================================================================ */

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [servicesOpen, setServicesOpen] = useState(false);

  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  /*
   * The only global desktop navigation hover state.
   *
   * NavItem does not mutate this state directly.
   * It only calls setNavHover / service handlers supplied by
   * Header.
   */
  const navExpanded = servicesOpen && scrolled && !mobileOpen;

  const wrapperRef = useRef<HTMLDivElement>(null);

  const glassRef = useRef<HTMLDivElement>(null);

  const topRowRef = useRef<HTMLDivElement>(null);

  const servicesTriggerRef = useRef<HTMLDivElement>(null);

  const servicesPanelRef = useRef<HTMLDivElement>(null);

  const categoriesWrapRef = useRef<HTMLDivElement>(null);

  const categoriesContentRef = useRef<HTMLDivElement>(null);

  const servicesCloseTimerRef = useRef<number | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const mobileInnerRef = useRef<HTMLDivElement>(null);

  /* ================================================================
      SERVICES TIMER
      ================================================================ */

  const cancelServicesClose = () => {
    if (servicesCloseTimerRef.current !== null) {
      window.clearTimeout(servicesCloseTimerRef.current);

      servicesCloseTimerRef.current = null;
    }
  };

  /* ================================================================
      POSITION SERVICES PANEL
      ================================================================ */

  const positionServicesPanel = () => {
    const trigger = servicesTriggerRef.current;

    const panel = servicesPanelRef.current;

    if (!trigger || !panel) return;

    const rect = trigger.getBoundingClientRect();

    panel.style.top = `${rect.bottom + 8}px`;

    panel.style.left = `${rect.left + rect.width / 2}px`;
  };

  /* ================================================================
      CENTRAL NAV HOVER STATE

      THIS IS THE IMPORTANT FIX.

      Every desktop nav item comes through here.

      There is no separate "hoveredNav = null" logic inside NavItem.

      Therefore an old leave event cannot randomly wipe out a newer
      hover state.
      ============================================================== */

  const setNavHover = (label: string | null) => {
    cancelServicesClose();

    if (label !== "SERVICES") {
      setServicesOpen(false);
    }

    setHoveredNav(label);
  };

  /* ================================================================
      OPEN SERVICES
      ============================================================== */

  const openServices = () => {
    cancelServicesClose();

    positionServicesPanel();

    setHoveredNav("SERVICES");
    setServicesOpen(true);
  };

  /* ================================================================
      CLOSE SERVICES

      The delayed close ONLY closes Services if the timer survives.

      Crucially, it does not blindly clear hoveredNav.

      This prevents:

        SERVICES
        ↓
        ABOUT
        ↓
        old timer fires
        ↓
        hoveredNav = null

      ============================================================== */

  const closeServices = (delay = 120) => {
    cancelServicesClose();

    servicesCloseTimerRef.current = window.setTimeout(() => {
      setServicesOpen(false);

      /*
          * Only clear hoveredNav if SERVICES is still the active item.

          * If the user already moved to ABOUT/BLOG/CONTACT US,
          * the newer hover state remains authoritative.
          */
      setHoveredNav((current) => (current === "SERVICES" ? null : current));

      servicesCloseTimerRef.current = null;
    }, delay);
  };

  useEffect(() => {
    return () => {
      cancelServicesClose();
    };
  }, []);

  /* ================================================================
      SCROLL
      ============================================================== */

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      start: SCROLL_THRESHOLD,
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  /* ================================================================
      HEADER MORPH
      ============================================================== */

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;

      const glass = glassRef.current;

      const topRow = topRowRef.current;

      const categoriesWrap = categoriesWrapRef.current;

      const categoriesContent = categoriesContentRef.current;

      if (!wrapper || !glass || !topRow) {
        return;
      }

      const baseTarget = mobileOpen
        ? TOP_STATE
        : scrolled
          ? PILL_STATE
          : TOP_STATE;

      const glassVisible = !mobileOpen && scrolled;

      const showCategories = !mobileOpen && navExpanded;

      const categoriesHeight =
        showCategories && categoriesContent
          ? categoriesContent.scrollHeight
          : 0;

      const wrapperTarget = {
        maxWidth: baseTarget.maxWidth,

        marginTop: baseTarget.marginTop,

        marginLeft: baseTarget.marginLeft,

        marginRight: baseTarget.marginRight,

        paddingLeft: baseTarget.paddingLeft,

        paddingRight: baseTarget.paddingRight,

        borderRadius: baseTarget.borderRadius,

        height: baseTarget.height + categoriesHeight,
      };

      if (prefersReducedMotion) {
        gsap.set(wrapper, wrapperTarget);

        gsap.set(topRow, {
          height: baseTarget.height,
        });

        gsap.set(glass, {
          opacity: glassVisible ? 1 : 0,
        });

        if (categoriesWrap) {
          gsap.set(categoriesWrap, {
            height: categoriesHeight,

            autoAlpha: showCategories ? 1 : 0,
          });
        }

        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.inOut",
        },
      });

      tl.to(
        wrapper,
        {
          ...wrapperTarget,
          duration: 0.65,
          overwrite: true,
        },
        0,
      );

      tl.to(
        topRow,
        {
          height: baseTarget.height,

          duration: 0.65,

          overwrite: true,
        },
        0,
      );

      tl.to(
        glass,
        {
          opacity: glassVisible ? 1 : 0,

          duration: 0.5,

          overwrite: true,
        },
        0.08,
      );

      if (categoriesWrap) {
        tl.to(
          categoriesWrap,
          {
            height: categoriesHeight,

            autoAlpha: showCategories ? 1 : 0,

            duration: 0.5,

            ease: showCategories ? "power3.out" : "power3.inOut",

            overwrite: true,
          },
          showCategories ? 0.12 : 0,
        );
      }

      return () => {
        tl.kill();
      };
    },
    {
      dependencies: [scrolled, mobileOpen, navExpanded],
    },
  );

  /* ================================================================
      MOBILE BODY LOCK
      ============================================================== */

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";

      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ================================================================
      MOBILE MENU ANIMATION
      ============================================================== */

  useGSAP(
    () => {
      const menu = mobileMenuRef.current;

      const inner = mobileInnerRef.current;

      if (!menu || !inner) return;

      const items = inner.querySelectorAll("[data-mobile-item]");

      if (prefersReducedMotion) {
        gsap.set(menu, {
          autoAlpha: mobileOpen ? 1 : 0,
        });

        gsap.set(items, {
          y: 0,

          opacity: mobileOpen ? 1 : 0,
        });

        return;
      }

      if (mobileOpen) {
        gsap.set(menu, {
          display: "block",
        });

        const tl = gsap.timeline();

        tl.fromTo(
          menu,
          {
            clipPath: "inset(0 0 100% 0)",

            autoAlpha: 1,
          },
          {
            clipPath: "inset(0 0 0% 0)",

            duration: 0.75,

            ease: "power4.inOut",
          },
        );

        tl.fromTo(
          items,
          {
            y: 32,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,

            duration: 0.7,

            stagger: 0.065,

            ease: "power3.out",
          },
          "-=0.4",
        );

        return () => {
          tl.kill();
        };
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(menu, {
            display: "none",
          });
        },
      });

      tl.to(items, {
        y: -15,
        opacity: 0,

        duration: 0.28,

        stagger: 0.025,

        ease: "power2.in",
      });

      tl.to(
        menu,
        {
          clipPath: "inset(0 0 100% 0)",

          autoAlpha: 1,

          duration: 0.55,

          ease: "power4.inOut",
        },
        "-=0.1",
      );

      return () => {
        tl.kill();
      };
    },
    {
      dependencies: [mobileOpen],
    },
  );

  /* ================================================================
      SERVICES DROPDOWN MORPH
      ============================================================== */

  useGSAP(
    () => {
      const panel = servicesPanelRef.current;

      if (!panel) return;

      const open = servicesOpen && !navExpanded;

      if (prefersReducedMotion) {
        gsap.set(panel, {
          autoAlpha: open ? 1 : 0,

          scale: 1,

          y: open ? 0 : -6,
        });

        return;
      }

      gsap.to(panel, {
        autoAlpha: open ? 1 : 0,

        scaleX: open ? 1 : 0.98,

        scaleY: open ? 1 : 0.92,

        y: open ? 0 : -10,

        duration: open ? 0.38 : 0.24,

        ease: open ? "power2.out" : "power2.inOut",

        overwrite: "auto",
      });
    },
    {
      dependencies: [servicesOpen, navExpanded],
    },
  );

  /* ================================================================
      SERVICES POSITIONING
      ============================================================== */

  useEffect(() => {
    if (!servicesOpen || navExpanded) {
      return;
    }

    let frame: number | null = null;

    const scheduleUpdate = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        positionServicesPanel();
        frame = null;
      });
    };

    scheduleUpdate();

    window.addEventListener("resize", scheduleUpdate);

    window.addEventListener("scroll", scheduleUpdate, true);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);

      window.removeEventListener("scroll", scheduleUpdate, true);

      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [servicesOpen, navExpanded]);

  /* ================================================================
      ESCAPE
      ============================================================== */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      cancelServicesClose();

      setServicesOpen(false);
      setMobileOpen(false);
      setMobileServicesOpen(false);
      setHoveredNav(null);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ================================================================
      RENDER
      ============================================================== */

  return (
    <>
      {/* ============================================================
            DESKTOP / BASE HEADER
            ============================================================ */}

      <header className="sticky top-0 z-[110] flex h-24 items-start justify-center">
        <div
          ref={wrapperRef}
          className={`
              relative
              isolate
              mx-auto
              flex
              w-full
              flex-col
              overflow-hidden
              transition-none
              ${mobileOpen ? "lg:pointer-events-auto" : ""}
            `}
          style={TOP_STATE}
        >
          {/* GLASS — liquid white morph pill.
              Lower base opacity + heavier blur/saturation so light
              from whatever's behind it actually bleeds through
              (that's what reads as "liquid" instead of flat/solid
              white), plus a second offset blob so the highlight
              looks like it's pooling unevenly rather than sitting
              as a uniform tint. */}

          <div
            ref={glassRef}
            aria-hidden="true"
            className="
                pointer-events-none
                absolute
                inset-0
                z-0
                overflow-hidden
                opacity-0
              "
            style={{
              borderRadius: "inherit",

              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.22) 40%, rgba(255, 255, 255, 0.38) 100%)",

              backdropFilter: "blur(24px) saturate(180%) brightness(1.08)",

              WebkitBackdropFilter:
                "blur(24px) saturate(180%) brightness(1.08)",

              border: "1px solid rgba(255, 255, 255, 0.35)",

              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.65), inset 0 -1px 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              className="
                  absolute
                  inset-x-0
                  top-0
                  h-1/2
                  rounded-[inherit]
                  opacity-60
                "
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
              }}
            />

            <div
              className="
                  absolute
                  -left-16
                  -top-24
                  h-48
                  w-72
                  rounded-full
                  opacity-50
                "
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            <div
              className="
                  absolute
                  -bottom-16
                  -right-10
                  h-40
                  w-56
                  rounded-full
                  opacity-40
                "
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            <div
              className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-1/2
                  opacity-25
                "
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.09), transparent)",
              }}
            />
          </div>

          {/* ========================================================
                TOP ROW
                ======================================================== */}

          <div
            ref={topRowRef}
            className="
                relative
                z-10
                flex
                w-full
                shrink-0
                items-center
                justify-between
              "
            style={{
              height: TOP_STATE.height,
            }}
          >
            {/* LOGO
                The source file ships as flat gray, so instead of an
                <img> (which can't be recolored with CSS) the mark is
                used as a CSS mask over a solid-color box. That lets
                its color track header state purely in CSS:
                  normal (top, transparent bar) -> always white,
                                                    no hover shift
                  scrolled (white pill)         -> black idle,
                                                    accent purple on
                                                    hover

                SIZE: mark is 36px on phones, 40px on small tablets,
                and only reaches its original 48px from lg: up — a
                fixed 48px square was eating a large share of the
                bar's width on narrow phones. The wordmark is hidden
                below sm: (640px) for the same reason: mark-only on
                the smallest screens, full lockup from sm: up.

                NOTE: update the url() below to match whatever you
                actually named the file in /public — this assumes
                "technico-logo.svg". */}

            <TransitionLink
              to="/"
              data-cursor="highlight"
              className="
                  group
                  relative
                  z-10
                  flex
                  items-center
                  gap-2
                  sm:gap-3
                "
            >
              <span
                aria-hidden="true"
                className={`
                    block
                    h-9
                    w-9
                    shrink-0
                    transition-colors
                    duration-300
                    sm:h-10
                    sm:w-10
                    lg:h-12
                    lg:w-12
                    ${
                      scrolled
                        ? "bg-black group-hover:bg-[var(--color-accent)]"
                        : "bg-white"
                    }
                  `}
                style={{
                  WebkitMaskImage: "url(/technico-logo.svg)",
                  maskImage: "url(/technico-logo.svg)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />

              {/* WORDMARK — only exists in the normal (unscrolled)
                  state, and only there. Visible by default from
                  sm: up; on hover of the lockup it fades out (mark
                  color stays white — no color shift in this state,
                  only in the scrolled/pill state). Disappears
                  entirely once the header morphs into the pill,
                  leaving just the mark. */}

              {!scrolled && (
                <span className="hidden overflow-hidden sm:inline-block">
                  <span
                    className="
                        block
                        translate-x-0
                        font-mono
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        text-white
                        opacity-100
                        transition-all
                        duration-300
                        ease-out
                        group-hover:-translate-x-2
                        group-hover:opacity-0
                        sm:text-sm
                        sm:tracking-[0.14em]
                      "
                  >
                    TECHNICO
                  </span>
                </span>
              )}
            </TransitionLink>

            {/* ======================================================
                  DESKTOP NAV
                  ====================================================== */}

            <nav
              className="
                  relative
                  z-10
                  hidden
                  items-center
                  gap-8
                  lg:flex
                "
              aria-label="Main navigation"
              onPointerLeave={() => {
                /*
                 * The nav itself is the final authority for leaving
                 * the complete navigation region.
                 */
                closeServices(120);

                setHoveredNav(null);
              }}
            >
              {NAV_LINKS.map((link) => {
                const isHovered = hoveredNav === link.label;

                const hasActiveHover = hoveredNav !== null;

                /* ==================================================
                      SERVICES
                      ================================================== */

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      ref={servicesTriggerRef}
                      className="
                            relative
                          "
                      onPointerEnter={() => {
                        openServices();
                      }}
                      onPointerLeave={() => {
                        /*
                         * Grace period gives the pointer enough
                         * time to travel into the dropdown.
                         */
                        closeServices(160);
                      }}
                    >
                      <NavItem
                        label={link.label}
                        href={link.href}
                        active={isHovered}
                        dimmed={hasActiveHover && !isHovered}
                        scrolled={scrolled}
                        ariaExpanded={servicesOpen}
                        onHoverStart={() => {
                          openServices();
                        }}
                        onHoverEnd={() => {
                          closeServices(160);
                        }}
                      />
                    </div>
                  );
                }

                /* ==================================================
                      NORMAL NAV ITEM
                      ================================================== */

                return (
                  <NavItem
                    key={link.label}
                    label={link.label}
                    href={link.href}
                    active={isHovered}
                    dimmed={hasActiveHover && !isHovered}
                    scrolled={scrolled}
                    onHoverStart={() => {
                      /*
                       * This is now the ONLY path for changing from
                       * one ordinary nav item to another.
                       */
                      setNavHover(link.label);
                    }}
                    onHoverEnd={() => {
                      /*
                       * IMPORTANT:
                       *
                       * Do NOT blindly set hoveredNav(null) here.
                       *
                       * The pointer may already be entering another
                       * nav item.
                       *
                       * The parent <nav> handles the actual complete
                       * navigation exit.
                       */
                    }}
                  />
                );
              })}
            </nav>

            {/* DESKTOP CTA */}

            {/*
             * FIX (CTA cursor jump/desync on click): this div used to
             * carry ref={ctaRef} + data-cursor="highlight" and run its
             * own legacy GSAP quickTo magnetic effect directly on
             * itself (from back when Button had no magnetic behavior
             * of its own). Button now has that pull built in (see
             * Button.tsx's MAGNETIC HOVER section), applied to its own
             * inner anchor, with data-cursor living on Button's own
             * untransformed wrapper span.
             *
             * Leaving the old effect running here meant this div (an
             * ANCESTOR of Button's anchor) was ALSO being dragged
             * toward the pointer via its own independent quickTo/
             * pointermove listener — a second magnetic pull stacked on
             * top of Button's, each easing on its own curve. And
             * because data-cursor sat directly on this same
             * self-transforming div, CustomCursor was snapping its box
             * onto a target that kept sliding out from under it via
             * TWO overlapping tweens instead of one — exactly the
             * "circle jumps/mispositions right as you go to click"
             * bug, and right on the most-clicked CTA in the header.
             *
             * Now this div is just a plain, unstransformed layout
             * wrapper — Button.tsx owns the magnetic pull and the
             * cursor target entirely.
             */}
            <div
              className="
                  relative
                  z-10
                  hidden
                  lg:block
                "
            >
              <Button to="/contact" variant="primary" size="md">
                Let's Talk
              </Button>
            </div>

            {/* MOBILE BURGER — black once the white pill (scrolled) or
                the white full-screen mobile menu is showing, white
                while sitting on the transparent top bar. */}

            <div
              className={`
                  relative
                  z-[120]
                  lg:hidden
                  ${mobileOpen || scrolled ? "text-black" : "text-white"}
                `}
            >
              <MobileMenuButton
                open={mobileOpen}
                onClick={() => {
                  setMobileOpen((open) => !open);

                  if (mobileOpen) {
                    setMobileServicesOpen(false);
                  }
                }}
              />
            </div>
          </div>

          {/* ========================================================
                CONNECTED SERVICES EXPANSION
                (text flipped to black — it now sits on the white pill
                instead of a dark purple one)
                ======================================================== */}

          <div
            ref={categoriesWrapRef}
            aria-hidden={!navExpanded}
            onPointerEnter={() => {
              cancelServicesClose();
            }}
            onPointerLeave={() => {
              closeServices(80);
            }}
            className="
                relative
                z-10
                hidden
                w-full
                overflow-hidden
                lg:block
              "
            style={{
              height: 0,
              opacity: 0,
            }}
          >
            <div
              ref={categoriesContentRef}
              className="
                  grid
                  grid-cols-1
                  gap-x-10
                  gap-y-6
                  px-2
                  pb-8
                  pt-2
                  sm:grid-cols-3
                "
            >
              {SERVICE_CATEGORIES.map((category) => (
                <div
                  key={category.label}
                  className="
                        flex
                        flex-col
                        gap-3
                      "
                >
                  <TransitionLink
                    to="/services"
                    data-cursor="highlight"
                    className="
                          font-mono
                          text-[11px]
                          uppercase
                          tracking-[0.14em]
                          text-black/45
                          transition-colors
                          hover:text-black
                        "
                  >
                    {category.label}
                  </TransitionLink>

                  <div
                    className="
                          flex
                          flex-col
                          gap-2
                        "
                  >
                    {category.items.map((item) => (
                      <TransitionLink
                        key={item}
                        to="/services"
                        data-cursor="highlight"
                        className="
                                text-sm
                                text-black/80
                                transition-colors
                                hover:text-black
                              "
                      >
                        {item}
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
                FLOATING SERVICES DROPDOWN — white morph
                ======================================================== */}

          <div
            ref={servicesPanelRef}
            onPointerEnter={() => {
              if (navExpanded) {
                return;
              }

              cancelServicesClose();

              positionServicesPanel();

              /*
               * The dropdown itself is still part of the SERVICES
               * interaction. It does not create a new hover item.
               */
              setServicesOpen(true);

              setHoveredNav("SERVICES");
            }}
            onPointerLeave={() => {
              closeServices(80);
            }}
            className="
                invisible
                fixed
                z-[200]
                w-[min(92vw,720px)]
                -translate-x-1/2
                overflow-hidden
                opacity-0
              "
            style={{
              borderRadius: DROPDOWN_RADIUS,

              transformOrigin: "top center",

              transform: "scale(0.98, 0.92)",

              willChange: "transform, opacity",

              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.5) 45%, rgba(255, 255, 255, 0.62) 100%)",

              backdropFilter: "blur(30px) saturate(190%) brightness(1.05)",

              WebkitBackdropFilter:
                "blur(30px) saturate(190%) brightness(1.05)",

              border: "1px solid rgba(255, 255, 255, 0.4)",

              boxShadow:
                "0 20px 45px rgba(0, 0, 0, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              aria-hidden="true"
              className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  top-0
                  h-1/2
                  opacity-60
                "
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
              }}
            />

            <div
              aria-hidden="true"
              className="
                  pointer-events-none
                  absolute
                  -bottom-14
                  -right-8
                  h-36
                  w-52
                  rounded-full
                  opacity-35
                "
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
              }}
            />

            <div
              className="
                  relative
                  z-10
                  divide-y
                  divide-black/10
                  p-8
                "
            >
              {SERVICE_CATEGORIES.map((category) => (
                <div
                  key={category.label}
                  className="
                        grid
                        grid-cols-[180px_1fr]
                        gap-8
                        py-6
                        first:pt-0
                        last:pb-0
                      "
                >
                  <TransitionLink
                    to="/services"
                    data-cursor="highlight"
                    className="
                          text-sm
                          font-medium
                          text-black/55
                          transition-colors
                          hover:text-black
                        "
                  >
                    {category.label}
                  </TransitionLink>

                  <div
                    className="
                          flex
                          flex-col
                          gap-2
                        "
                  >
                    {category.items.map((item) => (
                      <TransitionLink
                        key={item}
                        to="/services"
                        data-cursor="highlight"
                        className="
                                text-sm
                                text-black/80
                                transition-colors
                                hover:text-black
                              "
                      >
                        {item}
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
            FULL SCREEN MOBILE NAVIGATION
            ============================================================ */}

      <div
        ref={mobileMenuRef}
        className="
            fixed
            left-0
            top-0
            z-[100]
            hidden
            h-[100dvh]
            w-[100vw]
            overflow-hidden
            bg-white
            text-black
            lg:hidden
          "
        style={{
          opacity: 0,
          visibility: "hidden",
          clipPath: "inset(0 0 100% 0)",
        }}
      >
        <div
          ref={mobileInnerRef}
          className="
              h-full
              w-full
              overflow-y-auto
              overscroll-contain
              px-6
              pb-10
              pt-24
              sm:pt-28
            "
        >
          {/* NAVIGATION */}

          <div>
            {NAV_LINKS.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    data-mobile-item
                    className="
                          border-b
                          border-black/10
                        "
                  >
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      className="
                            group
                            flex
                            w-full
                            items-center
                            justify-between
                            py-5
                            text-left
                          "
                      aria-expanded={mobileServicesOpen}
                    >
                      <span
                        className="
                              font-mono
                              text-[clamp(2.25rem,11vw,5rem)]
                              font-medium
                              leading-[0.88]
                              tracking-[-0.07em]
                              text-black
                            "
                      >
                        SERVICES
                      </span>

                      <span
                        className="
                              relative
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                            "
                      >
                        <span
                          className="
                                absolute
                                h-px
                                w-7
                                bg-black
                              "
                        />

                        <span
                          className={`
                                absolute
                                h-px
                                w-7
                                bg-black
                                transition-transform
                                duration-500
                                ease-[cubic-bezier(0.77,0,0.175,1)]
                                ${mobileServicesOpen ? "rotate-90" : "rotate-0"}
                              `}
                        />
                      </span>
                    </button>

                    {/* MOBILE SERVICES */}

                    <div
                      className={`
                            grid
                            transition-all
                            duration-700
                            ease-[cubic-bezier(0.77,0,0.175,1)]
                            ${
                              mobileServicesOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }
                          `}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-7">
                          {SERVICE_CATEGORIES.map((category) => (
                            <div
                              key={category.label}
                              className="
                                      border-t
                                      border-black/10
                                      py-5
                                    "
                            >
                              <TransitionLink
                                to="/services"
                                onClick={() => setMobileOpen(false)}
                                className="
                                        mb-4
                                        block
                                        font-mono
                                        text-[11px]
                                        uppercase
                                        tracking-[0.14em]
                                        text-black/40
                                      "
                              >
                                {category.label}
                              </TransitionLink>

                              <div
                                className="
                                        flex
                                        flex-col
                                      "
                              >
                                {category.items.map((item) => (
                                  <TransitionLink
                                    key={item}
                                    to="/services"
                                    onClick={() => setMobileOpen(false)}
                                    className="
                                              group
                                              flex
                                              items-center
                                              justify-between
                                              py-1.5
                                              font-mono
                                              text-[clamp(1rem,4vw,1.3rem)]
                                              leading-tight
                                              text-black
                                              transition-opacity
                                              duration-300
                                              hover:opacity-40
                                            "
                                  >
                                    <span>{item}</span>

                                    <span
                                      className="
                                                ml-4
                                                h-px
                                                w-0
                                                bg-black
                                                transition-all
                                                duration-400
                                                group-hover:w-7
                                              "
                                    />
                                  </TransitionLink>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <TransitionLink
                  key={link.label}
                  to={link.href}
                  data-mobile-item
                  onClick={() => setMobileOpen(false)}
                  className="
                        group
                        block
                        border-b
                        border-black/10
                        py-5
                        font-mono
                        text-[clamp(2.25rem,11vw,5rem)]
                        font-medium
                        leading-[0.88]
                        tracking-[-0.07em]
                        text-black
                      "
                >
                  <span className="relative">
                    {link.label}

                    <span
                      className="
                            absolute
                            -bottom-2
                            left-0
                            h-[2px]
                            w-0
                            bg-black
                            transition-all
                            duration-500
                            ease-out
                            group-hover:w-full
                          "
                    />
                  </span>
                </TransitionLink>
              );
            })}
          </div>

          {/* CTA */}

          <div data-mobile-item className="mt-10">
            <TransitionLink
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  border
                  border-black
                  px-5
                  py-4
                  font-mono
                  text-sm
                  uppercase
                  tracking-[0.08em]
                  text-black
                  transition-all
                  duration-500
                  hover:bg-black
                  hover:text-white
                "
            >
              <span>Let's Talk</span>

              <span
                className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
              >
                →
              </span>
            </TransitionLink>
          </div>

          {/* FOOTER */}

          <div
            data-mobile-item
            className="
                mt-16
                flex
                items-end
                justify-between
                border-t
                border-black/10
                pt-5
              "
          >
            <span
              className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.14em]
                  text-black/40
                "
            >
              Technico Digital Solutions
            </span>

            <span
              className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.14em]
                  text-black/40
                "
            >
              Menu
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export { Header };
export default Header;
