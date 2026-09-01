"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/Button";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { chunkIntoColumns } from "@/lib/utils/array";
import { SITE_NAME } from "@/lib/constants";
import type { Service } from "@/lib/content/types";
import Logo from "./Logo";
import NavItem from "./NavItem";
import MobileMenuButton from "./MobileMenuButton";
import ServicesDropdownPanel from "./ServicesDropdownPanel";
import ServicesInlineExpansion from "./ServicesInlineExpansion";
import MobileNav from "./MobileNav";
import {
  FOCUS_STATE,
  GLASS_FADE_DELAY,
  GLASS_FADE_DURATION,
  MORPH_DURATION,
  MORPH_EASE,
  NAV_LINKS,
  PILL_STATE,
  SCROLL_ENTER_THRESHOLD,
  SCROLL_LEAVE_THRESHOLD,
  SERVICES_FOCUS_EVENT,
  SERVICES_UNFOCUS_EVENT,
  TOP_STATE,
} from "./header.config";

interface HeaderProps {
  services: Service[];
}

/* ================================================================
    HEADER
    ================================================================ */

export default function Header({ services }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [servicesFocused, setServicesFocused] = useState(false);

  const serviceColumns = useMemo(
    () => chunkIntoColumns(services, 3),
    [services],
  );

  /*
   * The only global desktop navigation hover state.
   *
   * NavItem does not mutate this state directly.
   * It only calls setNavHover / service handlers supplied by
   * Header.
   */
  const navExpanded = servicesOpen && scrolled && !mobileOpen;

  // Third header state — true while the user is inside Services.tsx's
  // pinned horizontal-scroll section. Mobile menu always wins if both
  // are somehow true at once (shouldn't happen: opening the mobile
  // menu body-locks scroll, so the user can't be mid-pin at the same
  // time, but this keeps the two states from fighting regardless).
  const focusActive = servicesFocused && !mobileOpen;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLDivElement>(null);
  const servicesPanelRef = useRef<HTMLDivElement>(null);
  const categoriesWrapRef = useRef<HTMLDivElement>(null);
  const categoriesContentRef = useRef<HTMLDivElement>(null);
  const servicesCloseTimerRef = useRef<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileInnerRef = useRef<HTMLDivElement>(null);
  // Tracks focusActive across renders so the morph effect below can
  // tell "just entered/left focus mode" apart from "re-ran for an
  // unrelated reason (e.g. scrolled toggled) while focus was already
  // settled" — see the display:none handling in HEADER MORPH.
  const wasFocusActiveRef = useRef(false);

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

      Every desktop nav item comes through here. There is no separate
      "hoveredNav = null" logic inside NavItem, so an old leave event
      cannot randomly wipe out a newer hover state.
      ============================================================== */

  const setNavHover = (label: string | null) => {
    cancelServicesClose();

    if (label !== "SERVICES") {
      setServicesOpen(false);
    }

    setHoveredNav(label);
  };

  /* ================================================================
      OPEN / CLOSE SERVICES
      ============================================================== */

  const openServices = () => {
    cancelServicesClose();
    positionServicesPanel();
    setHoveredNav("SERVICES");
    setServicesOpen(true);
  };

  /*
   * The delayed close ONLY closes Services if the timer survives.
   * Crucially, it does not blindly clear hoveredNav — that prevents:
   *
   *   SERVICES -> ABOUT -> old timer fires -> hoveredNav = null
   */
  const closeServices = (delay = 120) => {
    cancelServicesClose();

    servicesCloseTimerRef.current = window.setTimeout(() => {
      setServicesOpen(false);

      // Only clear hoveredNav if SERVICES is still the active item.
      // If the user already moved to ABOUT/BLOG/CONTACT US, the newer
      // hover state remains authoritative.
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
    // Two separate triggers rather than one shared threshold — see
    // SCROLL_LEAVE_THRESHOLD's comment in header.config.ts for why
    // the gap between them matters for smoothness.
    const enterTrigger = ScrollTrigger.create({
      start: SCROLL_ENTER_THRESHOLD,
      onEnter: () => setScrolled(true),
    });
    const leaveTrigger = ScrollTrigger.create({
      start: SCROLL_LEAVE_THRESHOLD,
      onLeaveBack: () => setScrolled(false),
    });

    return () => {
      enterTrigger.kill();
      leaveTrigger.kill();
    };
  }, []);

  /* ================================================================
      SERVICES FOCUS MODE (3rd header state)
      ================================================================
      Header has no ref to Services.tsx's pinned section — they're
      siblings composed in app/page.tsx — so rather than prop-drill or
      add a context just for this, Services.tsx dispatches plain
      window CustomEvents from the same ScrollTrigger that already
      drives its horizontal scroll (onEnter/onLeave/onEnterBack/
      onLeaveBack), and Header just listens. This keeps the two
      components decoupled: Header doesn't need to know Services.tsx
      exists, only that this event contract does.
      ============================================================== */

  useEffect(() => {
    const handleFocus = () => setServicesFocused(true);
    const handleUnfocus = () => setServicesFocused(false);

    window.addEventListener(SERVICES_FOCUS_EVENT, handleFocus);
    window.addEventListener(SERVICES_UNFOCUS_EVENT, handleUnfocus);

    return () => {
      window.removeEventListener(SERVICES_FOCUS_EVENT, handleFocus);
      window.removeEventListener(SERVICES_UNFOCUS_EVENT, handleUnfocus);
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
      const nav = navRef.current;
      const cta = ctaRef.current;
      const burger = burgerRef.current;
      const logoWrap = logoWrapRef.current;
      const categoriesWrap = categoriesWrapRef.current;
      const categoriesContent = categoriesContentRef.current;

      if (!wrapper || !glass || !topRow) return;

      const baseTarget = mobileOpen
        ? TOP_STATE
        : focusActive
          ? FOCUS_STATE
          : scrolled
            ? PILL_STATE
            : TOP_STATE;
      const glassVisible = !mobileOpen && (scrolled || focusActive);
      const showCategories = !mobileOpen && navExpanded && !focusActive;

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

      // Shared by both the reduced-motion snap below and the animated
      // tween further down: how far the logo needs to move (as a
      // transform, not a layout change) to sit centered inside the
      // FOCUS_STATE pill. Measuring via gsap.getProperty + the
      // bounding rect (rather than assuming it starts at x:0) means
      // this stays correct even if focus mode is re-triggered mid
      // transition.
      const computeFocusLogoX = () => {
        if (!logoWrap || !topRow) return 0;
        const currentX = Number(gsap.getProperty(logoWrap, "x")) || 0;
        const currentLeft =
          logoWrap.getBoundingClientRect().left -
          topRow.getBoundingClientRect().left;
        const baseLeft = currentLeft - currentX;
        const logoWidth = logoWrap.getBoundingClientRect().width;
        const focusInnerWidth =
          FOCUS_STATE.maxWidth -
          FOCUS_STATE.paddingLeft -
          FOCUS_STATE.paddingRight;
        const targetLeft = (focusInnerWidth - logoWidth) / 2;
        return targetLeft - baseLeft;
      };

      if (prefersReducedMotion) {
        gsap.set(wrapper, wrapperTarget);
        gsap.set(topRow, { height: baseTarget.height });
        gsap.set(glass, { opacity: glassVisible ? 1 : 0 });

        if (logoWrap) {
          gsap.set(logoWrap, { x: focusActive ? computeFocusLogoX() : 0 });
        }

        [nav, cta, burger].forEach((el) => {
          if (!el) return;
          gsap.set(el, {
            autoAlpha: focusActive ? 0 : 1,
            display: focusActive ? "none" : "",
          });
        });

        wasFocusActiveRef.current = focusActive;

        if (categoriesWrap) {
          gsap.set(categoriesWrap, {
            height: categoriesHeight,
            autoAlpha: showCategories ? 1 : 0,
          });
        }

        return;
      }

      // While focused, the logo needs to visually end up centered in
      // the shrunk pill. Flipping topRow's justify-content to
      // "center" — even done carefully, even done at exactly the
      // right instant — is a DISCRETE layout change: the logo would
      // sit pinned at flex-start for the entire width-shrink tween
      // and then teleport to center in a single frame at the end.
      // That's not a race condition to fix, it's just not an
      // animation. Instead, topRow's layout is left alone (still
      // "space-between" throughout) and the logo itself is moved with
      // a plain transform tween, computed once and run with the SAME
      // duration + ease as the wrapper's width/padding tween below.
      // Because maxWidth/padding are being interpolated linearly by
      // that identical curve, the logo's target offset — itself a
      // linear function of the pill's shrinking inner width — tracks
      // exactly in proportion at every instant, not just at the two
      // endpoints. The result is one continuous glide to center,
      // synced with the pill shrinking, with nothing to jump.
      //
      // nav/CTA/burger still get pulled out of the flex flow with
      // display:none once they've faded — mainly so they're out of
      // tab order and don't influence topRow's content width — but
      // that no longer has anything to do with centering the logo, so
      // there's no timing dependency between the two anymore.
      const justEnteredFocus = focusActive && !wasFocusActiveRef.current;
      const justLeftFocus = !focusActive && wasFocusActiveRef.current;
      wasFocusActiveRef.current = focusActive;

      const tl = gsap.timeline({ defaults: { ease: MORPH_EASE } });

      tl.to(
        wrapper,
        { ...wrapperTarget, duration: MORPH_DURATION, overwrite: true },
        0,
      );
      tl.to(
        topRow,
        {
          height: baseTarget.height,
          duration: MORPH_DURATION,
          overwrite: true,
        },
        0,
      );
      tl.to(
        glass,
        {
          opacity: glassVisible ? 1 : 0,
          duration: GLASS_FADE_DURATION,
          overwrite: true,
        },
        GLASS_FADE_DELAY,
      );

      if (logoWrap) {
        tl.to(
          logoWrap,
          {
            x: focusActive ? computeFocusLogoX() : 0,
            duration: MORPH_DURATION,
            overwrite: true,
          },
          0,
        );
      }

      // Nav / CTA / burger fade together with the wrapper's width tween
      // above, over the SAME duration, so the whole thing lands as one
      // motion instead of the fade finishing early. autoAlpha also
      // sets visibility:hidden at 0, so none of these stay clickable
      // while faded. display:none is applied/cleared right at the
      // transition boundary — purely a tab-order/layout-hygiene
      // cleanup now, not something the logo's position depends on.
      [nav, cta, burger].forEach((el) => {
        if (!el) return;

        if (focusActive) {
          tl.to(
            el,
            {
              autoAlpha: 0,
              duration: MORPH_DURATION,
              overwrite: true,
              onComplete: justEnteredFocus
                ? () => {
                    el.style.display = "none";
                  }
                : undefined,
            },
            0,
          );
        } else {
          if (justLeftFocus) el.style.display = "";
          tl.to(
            el,
            { autoAlpha: 1, duration: MORPH_DURATION, overwrite: true },
            0,
          );
        }
      });

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
    { dependencies: [scrolled, mobileOpen, navExpanded, focusActive] },
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
        gsap.set(menu, { autoAlpha: mobileOpen ? 1 : 0 });
        gsap.set(items, { y: 0, opacity: mobileOpen ? 1 : 0 });
        return;
      }

      if (mobileOpen) {
        gsap.set(menu, { display: "block" });

        const tl = gsap.timeline();

        tl.fromTo(
          menu,
          { clipPath: "inset(0 0 100% 0)", autoAlpha: 1 },
          { clipPath: "inset(0 0 0% 0)", duration: 0.75, ease: "power4.inOut" },
        );

        tl.fromTo(
          items,
          { y: 32, opacity: 0 },
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
          gsap.set(menu, { display: "none" });
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
    { dependencies: [mobileOpen] },
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
    { dependencies: [servicesOpen, navExpanded] },
  );

  /* ================================================================
      SERVICES POSITIONING
      ============================================================== */

  useEffect(() => {
    if (!servicesOpen || navExpanded) return;

    let frame: number | null = null;

    const scheduleUpdate = () => {
      if (frame !== null) return;

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
      if (event.key !== "Escape") return;

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
      <header className="fixed inset-x-0 top-0 z-[110] flex h-24 items-start justify-center">
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
          {/* GLASS — liquid white morph pill. */}
          <div
            ref={glassRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0"
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
              className="absolute inset-x-0 top-0 h-1/2 rounded-[inherit] opacity-60"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
              }}
            />
            <div
              className="absolute -left-16 -top-24 h-48 w-72 rounded-full opacity-50"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
              }}
            />
            <div
              className="absolute -bottom-16 -right-10 h-40 w-56 rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 opacity-25"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.09), transparent)",
              }}
            />
          </div>

          {/* ======================================================
                TOP ROW
                ====================================================== */}
          <div
            ref={topRowRef}
            className="relative z-10 flex w-full shrink-0 items-center justify-between"
            style={{ height: TOP_STATE.height }}
          >
            <div ref={logoWrapRef} className="flex items-center">
              <Logo scrolled={scrolled || focusActive} siteName={SITE_NAME} />
            </div>

            {/* DESKTOP NAV */}
            <nav
              ref={navRef}
              className="relative z-10 hidden items-center gap-8 lg:flex"
              aria-label="Main navigation"
              onPointerLeave={() => {
                // The nav itself is the final authority for leaving
                // the complete navigation region.
                closeServices(120);
                setHoveredNav(null);
              }}
            >
              {NAV_LINKS.map((link) => {
                const isHovered = hoveredNav === link.label;
                const hasActiveHover = hoveredNav !== null;

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      ref={servicesTriggerRef}
                      className="relative"
                      onPointerEnter={() => openServices()}
                      onPointerLeave={() => closeServices(160)}
                    >
                      <NavItem
                        label={link.label}
                        href={link.href}
                        active={isHovered}
                        dimmed={hasActiveHover && !isHovered}
                        scrolled={scrolled}
                        ariaExpanded={servicesOpen}
                        onHoverStart={() => openServices()}
                        onHoverEnd={() => closeServices(160)}
                      />
                    </div>
                  );
                }

                return (
                  <NavItem
                    key={link.label}
                    label={link.label}
                    href={link.href}
                    active={isHovered}
                    dimmed={hasActiveHover && !isHovered}
                    scrolled={scrolled}
                    onHoverStart={() => {
                      // This is now the ONLY path for changing from
                      // one ordinary nav item to another.
                      setNavHover(link.label);
                    }}
                    onHoverEnd={() => {
                      // Do NOT blindly clear hoveredNav here — the
                      // pointer may already be entering another nav
                      // item. The parent <nav> handles the actual
                      // complete navigation exit.
                    }}
                  />
                );
              })}
            </nav>

            {/* DESKTOP CTA */}
            <div ref={ctaRef} className="relative z-10 hidden lg:block">
              <Button to="/contact" variant="primary" size="md">
                Let&apos;s Talk
              </Button>
            </div>

            {/* MOBILE BURGER */}
            <div
              ref={burgerRef}
              className={`relative z-[120] lg:hidden ${
                mobileOpen || scrolled || focusActive
                  ? "text-black"
                  : "text-white"
              }`}
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

          {/* CONNECTED SERVICES EXPANSION */}
          <ServicesInlineExpansion
            wrapRef={categoriesWrapRef}
            contentRef={categoriesContentRef}
            columns={serviceColumns}
            navExpanded={navExpanded}
            onPointerEnter={cancelServicesClose}
            onPointerLeave={() => closeServices(80)}
          />

          {/* FLOATING SERVICES DROPDOWN */}
          <ServicesDropdownPanel
            panelRef={servicesPanelRef}
            services={services}
            onPointerEnter={() => {
              if (navExpanded) return;

              cancelServicesClose();
              positionServicesPanel();

              // The dropdown itself is still part of the SERVICES
              // interaction. It does not create a new hover item.
              setServicesOpen(true);
              setHoveredNav("SERVICES");
            }}
            onPointerLeave={() => closeServices(80)}
          />
        </div>
      </header>

      {/* ============================================================
            FULL SCREEN MOBILE NAVIGATION
            ============================================================ */}
      <MobileNav
        menuRef={mobileMenuRef}
        innerRef={mobileInnerRef}
        services={services}
        siteName={SITE_NAME}
        mobileServicesOpen={mobileServicesOpen}
        onToggleServices={() => setMobileServicesOpen((open) => !open)}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
