"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SITE_NAME } from "@/lib/constants";
import type { Service } from "@/lib/content/types";
import HorizontalStagger from "./HorizontalStagger";
import HeaderTile from "./HeaderTile";
import HeaderDrop from "./HeaderDrop";
import styles from "./Header.module.css";
import MobileMenuButton from "./MobileMenuButton";
import MobileNav from "./MobileNav";

interface HeaderProps {
  services: Service[];
}

const LOGO = "/technico-digitals-solutions-inc-logo-black.svg";

export default function Header({ services }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [logoActive, setLogoActive] = useState(false);
  const [ctaActive, setCtaActive] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [navVisible, setNavVisible] = useState(true);
  const servicesActive = activeNav === "SERVICES" && navVisible;

  const lastScroll = useRef(0);
  const navCloseTimer = useRef<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileInnerRef = useRef<HTMLDivElement>(null);
  const mobileTimeline = useRef<gsap.core.Timeline | null>(null);

  const cancelNavClose = () => {
    if (navCloseTimer.current !== null) {
      window.clearTimeout(navCloseTimer.current);
      navCloseTimer.current = null;
    }
  };

  const openServices = () => {
    cancelNavClose();
    setActiveNav("SERVICES");
  };

  const scheduleNavClose = (delay = 130) => {
    cancelNavClose();
    navCloseTimer.current = window.setTimeout(() => {
      setActiveNav(null);
      navCloseTimer.current = null;
    }, delay);
  };

  // The dashed rail stays fixed. Only the four centered tiles travel
  // downward through its clipped viewport on scroll-down.
  useEffect(() => {
    lastScroll.current = window.scrollY;
    let frame = 0;
    let direction = 0;
    let distance = 0;

    const update = () => {
      frame = 0;
      const next = Math.max(0, window.scrollY);
      const change = next - lastScroll.current;
      const nextDirection = Math.sign(change);
      if (nextDirection !== 0) {
        distance =
          nextDirection === direction
            ? distance + Math.abs(change)
            : Math.abs(change);
        direction = nextDirection;
      }

      if (next < 65 || mobileOpen) {
        setNavVisible(true);
      } else if (distance > 10 && direction > 0) {
        cancelNavClose();
        setActiveNav(null);
        setNavVisible(false);
      } else if (distance > 8 && direction < 0) {
        setNavVisible(true);
      }

      lastScroll.current = next;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      cancelNavClose();
      setMobileOpen(false);
      setMobileServicesOpen(false);
      setActiveNav(null);
      setLogoActive(false);
      setCtaActive(false);
    };

    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("keydown", onEscape);
      if (navCloseTimer.current !== null) {
        window.clearTimeout(navCloseTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnResize = () => {
      setMobileOpen(false);
      setMobileServicesOpen(false);
      cancelNavClose();
      setActiveNav(null);
    };
    desktop.addEventListener("change", closeOnResize);
    return () => desktop.removeEventListener("change", closeOnResize);
  }, []);

  useGSAP(
    () => {
      const menu = mobileMenuRef.current;
      const inner = mobileInnerRef.current;
      if (!menu || !inner) return;

      const stripes = menu.querySelectorAll("[data-mobile-menu-stripe]");
      const items = inner.querySelectorAll("[data-mobile-item]");

      gsap.set(items, { y: 28, clipPath: "inset(100% 0 0 0)" });
      const timeline = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(menu, { display: "none", visibility: "hidden" });
        },
      });
      timeline
        .to(
          stripes,
          {
            scaleX: 1,
            duration: 0.5,
            stagger: 0.025,
            ease: "power3.inOut",
          },
          0,
        )
        .to(
          items,
          {
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.48,
            stagger: 0.045,
            ease: "power3.out",
          },
          0.2,
        );
      mobileTimeline.current = timeline;
      return () => {
        timeline.kill();
        mobileTimeline.current = null;
      };
    },
    { scope: mobileMenuRef },
  );

  useEffect(() => {
    const menu = mobileMenuRef.current;
    const timeline = mobileTimeline.current;
    if (!menu || !timeline) return;
    if (mobileOpen)
      gsap.set(menu, { display: "block", visibility: "visible", opacity: 1 });
    if (prefersReducedMotion) {
      timeline.progress(mobileOpen ? 1 : 0).pause();
      gsap.set(menu, { display: mobileOpen ? "block" : "none" });
    } else if (mobileOpen) {
      timeline.timeScale(1).play();
    } else {
      timeline.timeScale(1.2).reverse();
    }
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`${styles.header} pointer-events-none fixed inset-x-0 top-0 z-[110] isolate w-full px-[var(--container-gutter)] pt-4 lg:pt-5`}
        aria-label="Site header"
      >
        <div className="pointer-events-auto relative mx-auto flex h-16 w-full max-w-[1920px] items-start lg:h-12">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-[var(--container-gutter)] -right-[var(--container-gutter)] top-12 z-50 hidden border-t border-dashed border-[#9b9b9b]/70 lg:block"
          />

          <div
            className="relative z-20 shrink-0"
            onPointerEnter={() => setLogoActive(true)}
            onPointerLeave={() => setLogoActive(false)}
            onFocusCapture={() => setLogoActive(true)}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              ) {
                setLogoActive(false);
              }
            }}
          >
            <Link
              href="/"
              aria-label={SITE_NAME}
              onClick={() => {
                setMobileOpen(false);
                setLogoActive(false);
              }}
              className="relative isolate flex h-16 w-[150px] items-start justify-start overflow-hidden bg-[var(--header-paper)] px-3 pt-2.5 text-[#101010] lg:h-12 lg:w-[156px] xl:w-[164px] lg:items-center lg:justify-center lg:px-4 lg:pt-0"
            >
              <HorizontalStagger
                active={logoActive}
                className="bg-[var(--header-accent)]"
                rows={6}
              />

              <span className="relative z-10 flex items-center gap-2.5">
                <Image
                  src={LOGO}
                  alt=""
                  aria-hidden="true"
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] shrink-0 object-contain"
                />
                <span className="font-mono text-[12px] font-bold tracking-[-0.055em] uppercase lg:text-[14px]">
                  TCHNIC_
                </span>
              </span>

              <span className="absolute bottom-1 left-[52px] z-10 font-mono text-[7px] leading-[1.05] uppercase tracking-[-0.04em] lg:hidden">
                Digital marketing
                <br />
                agency
              </span>
              <span className="sr-only">{SITE_NAME}</span>
            </Link>

            <div className="absolute inset-x-0 top-full hidden lg:block">
              <HeaderDrop open={logoActive}>
                <p className="px-3 pb-5 pt-3 font-mono text-[12px] leading-[1.2] uppercase tracking-[-0.04em]">
                  {"// "}Digital marketing
                  <br />
                  &nbsp;&nbsp;&nbsp;agency
                </p>
              </HeaderDrop>
            </div>
          </div>

          <div className="pointer-events-auto absolute left-1/2 top-0 z-30 hidden w-max -translate-x-1/2 lg:block">
            <nav
              data-hidden={!navVisible}
              onFocusCapture={() => setNavVisible(true)}
              aria-label="Main navigation"
              className={`${styles.nav} flex h-12 items-start gap-3 xl:gap-6`}
            >
              <HeaderTile
                label="SERVICES"
                href="/services"
                hasDropdown
                active={servicesActive}
                onNavigate={() => {
                  cancelNavClose();
                  setActiveNav(null);
                }}
                onActiveChange={(active) => {
                  if (active) openServices();
                  else scheduleNavClose();
                }}
              />
              {[
                { label: "BLOG", href: "/blog", info: "Logs" },
                { label: "ABOUT", href: "/about", info: "Origin" },
                { label: "CONTACT", href: "/contact", info: "Signal" },
              ].map((item) => (
                <HeaderTile
                  key={item.label}
                  {...item}
                  active={navVisible && activeNav === item.label}
                  onNavigate={() => {
                    cancelNavClose();
                    setActiveNav(null);
                  }}
                  onActiveChange={(active) => {
                    if (active) {
                      cancelNavClose();
                      setActiveNav(item.label);
                    } else scheduleNavClose(80);
                  }}
                />
              ))}
            </nav>

            <div
              onPointerEnter={openServices}
              onPointerLeave={() => scheduleNavClose(80)}
              onFocusCapture={openServices}
              onBlurCapture={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  scheduleNavClose(80);
                }
              }}
              onClick={() => {
                cancelNavClose();
                setActiveNav(null);
              }}
              className="absolute inset-x-0 top-full z-40 text-[#151515]"
            >
              <HeaderDrop id="desktop-services-panel" open={servicesActive}>
                <div
                  data-lenis-prevent
                  className="max-h-[calc(100dvh-88px)] overflow-y-auto overscroll-contain px-5 pb-5 pt-3"
                >
                  <Link
                    href="/services"
                    className="group/view-all flex min-h-12 items-center justify-between border-b border-black/25 font-mono text-[14px] font-bold uppercase tracking-[-0.045em] transition-opacity hover:opacity-60"
                  >
                    <span className={styles.serviceHeading}>+ SERVICES</span>
                    <span>VIEW ALL</span>
                  </Link>

                  {services.map((service, index) => (
                    <ServiceRow
                      key={service.slug}
                      service={service}
                      index={index}
                    />
                  ))}
                </div>
              </HeaderDrop>
            </div>
          </div>

          <div
            className="relative z-20 ml-auto hidden shrink-0 lg:block"
            onPointerEnter={() => setCtaActive(true)}
            onPointerLeave={() => setCtaActive(false)}
            onFocusCapture={() => setCtaActive(true)}
            onBlurCapture={() => setCtaActive(false)}
          >
            <Link
              href="/contact"
              className="relative isolate flex h-12 items-center justify-center overflow-hidden bg-[var(--header-accent)] px-4 font-mono text-[15px] font-bold uppercase tracking-[-0.045em] text-black xl:px-6"
            >
              <HorizontalStagger
                active={ctaActive}
                className="bg-[var(--header-paper)]"
                rows={6}
              />
              <span className="relative z-10">START A PROJECT</span>
            </Link>
          </div>

          <div className="pointer-events-auto relative z-[120] ml-auto flex h-16 w-16 items-center justify-center bg-[var(--header-paper)] text-black lg:hidden">
            <MobileMenuButton
              open={mobileOpen}
              onClick={() => {
                setMobileOpen((current) => !current);
                if (mobileOpen) setMobileServicesOpen(false);
              }}
            />
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        menuRef={mobileMenuRef}
        innerRef={mobileInnerRef}
        services={services}
        mobileServicesOpen={mobileServicesOpen}
        onToggleServices={() => setMobileServicesOpen((open) => !open)}
        onClose={() => {
          setMobileOpen(false);
          setMobileServicesOpen(false);
        }}
      />
    </>
  );
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={`/services/${service.slug}`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group relative isolate grid min-h-[70px] grid-cols-[32px_minmax(0,1fr)] items-center gap-x-3 overflow-hidden border-b border-black/15 px-2 py-3 font-mono uppercase last:border-b-0"
    >
      <HorizontalStagger
        active={active}
        className="bg-[var(--header-accent)]"
        rows={5}
      />
      <span className="relative z-10 text-[11px] opacity-55">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="relative z-10 min-w-0">
        <span className="block text-[14px] font-bold leading-tight tracking-[-0.045em]">
          {service.title}
        </span>
        <span className="mt-1.5 block text-[12px] font-normal leading-[1.35] tracking-[-0.035em] text-black/65">
          {service.shortDescription}
        </span>
      </span>
    </Link>
  );
}
