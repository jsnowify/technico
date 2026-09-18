"use client";

import type { RefObject } from "react";
import Link from "next/link";
import type { Service } from "@/lib/content/types";
import { NAV_LINKS } from "./header.config";
import styles from "./Header.module.css";

interface MobileNavProps {
  open: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  services: Service[];
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
                  className="flex flex-1 flex-col"
                >
                  <button
                    type="button"
                    onClick={onToggleServices}
                    aria-expanded={mobileServicesOpen}
                    aria-controls="mobile-service-links"
                    className="group flex min-h-[76px] w-full flex-1 items-center border-b border-dashed border-black/35 pl-[16.5%] pr-5 text-left"
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
                        {services.map((service, index) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            onClick={onClose}
                            className="group grid min-h-[54px] grid-cols-[30px_minmax(0,1fr)_auto] items-center gap-3 border-b border-dashed border-black/20 px-6 font-mono text-[13px] font-bold uppercase tracking-[-0.045em]"
                          >
                            <span className="text-[9px] opacity-45">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate">{service.title}</span>
                            <span className="text-lg transition-transform duration-500 group-hover:translate-x-1.5">
                              &rarr;
                            </span>
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
            className="group grid min-h-[clamp(126px,21dvh,192px)] w-full grid-cols-[minmax(0,1.5fr)_minmax(112px,1fr)] bg-[var(--header-accent)] text-black"
          >
            <span className="relative flex items-center justify-center px-5 pb-3 pt-8 text-center">
              <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[-0.04em]">
                Contact us
              </span>
              <span className="max-w-[8ch] font-mono text-[clamp(1.25rem,6vw,1.7rem)] font-bold leading-[0.95] tracking-[-0.07em] uppercase">
                Start a project
              </span>
            </span>

            <span className="flex items-center justify-center border-l border-dashed border-black/35 px-4">
              <svg
                aria-hidden="true"
                viewBox="0 0 120 70"
                className="h-auto w-full max-w-[112px] overflow-visible transition-transform duration-700 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2"
              >
                <path
                  d="M8 35H103M75 7L103 35L75 63"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
