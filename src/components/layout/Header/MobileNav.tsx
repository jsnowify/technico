"use client";

import type { RefObject } from "react";
import Link from "next/link";
import type { ServiceNavItem } from "@/lib/content/types";
import { NAV_LINKS } from "./header.config";
import styles from "./Header.module.css";

interface MobileNavProps {
  open: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  services: ServiceNavItem[];
  mobileServicesOpen: boolean;
  onToggleServices: () => void;
  onClose: () => void;
}

const MOBILE_ORDER = ["/services", "/blog", "/about", "/contact"];

export default function MobileNav({
  open,
  menuRef,
  innerRef,
  services,
  mobileServicesOpen,
  onToggleServices,
  onClose,
}: MobileNavProps) {
  const links = [...NAV_LINKS].sort(
    (a, b) => MOBILE_ORDER.indexOf(a.href) - MOBILE_ORDER.indexOf(b.href),
  );

  return (
    <div
      ref={menuRef}
      id="mobile-header-menu"
      aria-hidden={!open}
      inert={!open}
      aria-label="Mobile navigation"
      className={`${styles.header} fixed inset-0 z-[100] hidden h-[100dvh] w-full overflow-hidden text-black lg:hidden`}
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            data-mobile-menu-stripe
            className="absolute left-0 w-full origin-left scale-x-0 bg-[var(--header-paper)]"
            style={{
              top: `${index * 10}%`,
              height: "10.5%",
            }}
          />
        ))}
      </div>

      <div
        ref={innerRef}
        data-lenis-prevent
        className="relative z-10 flex h-full w-full flex-col overflow-y-auto overscroll-contain pt-[clamp(108px,20dvh,176px)]"
      >
        <nav
          aria-label="Mobile main navigation"
          className="flex w-full flex-1 flex-col"
        >
          {links.map((link) => {
            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  data-mobile-item
                  className="flex shrink-0 flex-col"
                >
                  <button
                    type="button"
                    onClick={onToggleServices}
                    aria-expanded={mobileServicesOpen}
                    aria-controls="mobile-service-links"
                    className="group flex min-h-[76px] w-full items-center border-b border-dashed border-black/35 pl-[16.5%] pr-5 text-left"
                  >
                    <span className="font-mono text-[clamp(2.25rem,10.5vw,3.25rem)] font-medium leading-none tracking-[-0.075em] text-black">
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={`ml-4 inline-block transition-transform duration-700 [transition-timing-function:cubic-bezier(.16,1,.3,1)] ${
                          mobileServicesOpen ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>

                  <div
                    id="mobile-service-links"
                    aria-hidden={!mobileServicesOpen}
                    inert={!mobileServicesOpen}
                    className={`grid shrink-0 transition-[grid-template-rows] duration-500 [transition-timing-function:var(--header-ease)] motion-reduce:transition-none ${
                      mobileServicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="bg-[#dedee0]">
                        <Link
                          href="/services"
                          onClick={onClose}
                          className="grid min-h-[62px] grid-cols-[30px_minmax(0,1fr)] items-center gap-3 border-b border-dashed border-black/25 bg-[var(--header-accent)] px-6 font-mono text-[13px] font-bold tracking-[-0.045em] text-black uppercase"
                        >
                          <span className="text-[9px] opacity-55">00</span>
                          <span>Visit Services Page</span>
                        </Link>

                        {services.map((service, index) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            onClick={onClose}
                            className="grid min-h-[54px] grid-cols-[30px_minmax(0,1fr)] items-center gap-3 border-b border-dashed border-black/20 px-6 font-mono text-[13px] font-bold uppercase tracking-[-0.045em]"
                          >
                            <span className="text-[9px] opacity-45">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate">{service.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                data-mobile-item
                onClick={onClose}
                className="flex min-h-[76px] w-full flex-1 items-center border-b border-dashed border-black/35 pl-[16.5%] pr-5 text-left font-mono text-[clamp(2.25rem,10.5vw,3.25rem)] font-medium leading-none tracking-[-0.075em] text-black"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div data-mobile-item className="mt-[clamp(40px,8dvh,80px)] shrink-0">
          <Link
            href="/contact"
            onClick={onClose}
            className="relative flex min-h-[clamp(126px,21dvh,192px)] w-full items-center justify-center bg-[var(--header-accent)] px-6 pb-4 pt-10 text-center text-black"
          >
            <span className="absolute top-5 left-5 font-mono text-[10px] tracking-[-0.04em] uppercase">
              Contact us
            </span>
            <span className="absolute top-5 right-5 font-mono text-[12px] leading-none">
              +
            </span>
            <span className="max-w-[10ch] font-mono text-[clamp(1.45rem,7vw,2rem)] font-bold leading-[0.95] tracking-[-0.07em] uppercase">
              Start a project
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
