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
  GLASS_FADE_DELAY,
  GLASS_FADE_DURATION,
  MORPH_DURATION,
  MORPH_EASE,
  NAV_LINKS,
  PILL_STATE,
  SCROLL_ENTER_THRESHOLD,
  SCROLL_LEAVE_THRESHOLD,
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

  // Drives the whole header sliding out of view on scroll-down and
  // back in on scroll-up (see the "HIDE ON SCROLL" effect below).
  // Kept separate from `scrolled` (which only tracks the pill morph)
  // so the two behaviors can't fight each other.
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const headerRef = useRef<HTMLElement>(null);
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
      HIDE ON SCROLL
      ================================================================
      Scrolling down slides the whole header out of view; scrolling
      up brings it right back — direction is all that matters, not
      distance, so even a small scroll-up reveals it immediately.
      Suppressed near the very top (nothing to hide against yet, and
      it would otherwise flicker while the pill is still morphing)
      and whenever the mobile menu or the services dropdown is open,
      so the header can never disappear out from under an open
      interaction.
      ============================================================== */

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    // Rate-limited to one check per animation frame (same pattern as
    // BlogContents' scroll handler) instead of running on every raw
    // "scroll" event. The native event can fire far more often than
    // the screen actually repaints — especially with Lenis smoothing
    // active — and each firing was previously calling setState
    // synchronously, forcing a Header re-render per event instead of
    // per frame. On a long page (e.g. a blog post) that adds up to a
    // lot of avoidable re-renders while the user is simply scrolling
    // to read, which is a big part of why scrolling felt laggy.
    let rafId = 0;

    const evaluate = () => {
      rafId = 0;
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (mobileOpen || servicesOpen || currentY < SCROLL_ENTER_THRESHOLD) {
        setHeaderVisible(true);
      } else if (delta > 4) {
        setHeaderVisible(false);
      } else if (delta < -4) {
        setHeaderVisible(true);
      }

      lastScrollYRef.current = currentY;
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(evaluate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mobileOpen, servicesOpen]);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      if (prefersReducedMotion) {
        gsap.set(header, { y: headerVisible ? 0 : "-100%" });
        return;
      }

      gsap.to(header, {
        y: headerVisible ? 0 : "-100%",
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    },
    { dependencies: [headerVisible] },
  );

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
        gsap.set(topRow, { height: baseTarget.height });
        gsap.set(glass, { opacity: glassVisible ? 1 : 0 });

        if (logoWrap) {
          gsap.set(logoWrap, { x: 0 });
        }

        [nav, cta, burger].forEach((el) => {
          if (!el) return;
          gsap.set(el, { autoAlpha: 1, display: "" });
        });

        if (categoriesWrap) {
          gsap.set(categoriesWrap, {
            height: categoriesHeight,
            autoAlpha: showCategories ? 1 : 0,
          });
        }

        return;
      }

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
    { dependencies: [scrolled, mobileOpen, navExpanded] },
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
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-[110] flex h-24 items-start justify-center"
      >
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
              <Logo scrolled={scrolled} siteName={SITE_NAME} />
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
            <div
              ref={ctaRef}
              className="relative z-10 hidden lg:flex lg:w-[185px] lg:justify-end"
            >
              <Button to="/contact" variant="purple-fill">
                Let&apos;s Talk
              </Button>
            </div>

            {/* MOBILE BURGER */}
            <div
              ref={burgerRef}
              className={`relative z-[120] lg:hidden ${
                mobileOpen || scrolled ? "text-black" : "text-white"
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
