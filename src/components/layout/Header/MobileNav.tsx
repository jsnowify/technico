"use client";

import type { RefObject } from "react";
import Link from "next/link";
import type { Service } from "@/lib/content/types";
import { NAV_LINKS } from "./header.config";

interface MobileNavProps {
  menuRef: RefObject<HTMLDivElement | null>;
  innerRef: RefObject<HTMLDivElement | null>;
  services: Service[];
  siteName: string;
  mobileServicesOpen: boolean;
  onToggleServices: () => void;
  onClose: () => void;
}

export default function MobileNav({
  menuRef,
  innerRef,
  services,
  siteName,
  mobileServicesOpen,
  onToggleServices,
  onClose,
}: MobileNavProps) {
  return (
    <div
      ref={menuRef}
      aria-label="Mobile navigation"
      className="fixed left-0 top-0 z-[100] hidden h-[100dvh] w-[100vw] overflow-hidden bg-white text-black lg:hidden"
      style={{
        opacity: 0,
        visibility: "hidden",
        clipPath: "inset(0 0 100% 0)",
      }}
    >
      <div
        ref={innerRef}
        className="h-full w-full overflow-y-auto overscroll-contain px-6 pb-10 pt-24 sm:pt-28"
      >
        {/* NAVIGATION */}
        <div>
          {NAV_LINKS.map((link) => {
            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  data-mobile-item
                  className="border-b border-black/10"
                >
                  <button
                    type="button"
                    onClick={onToggleServices}
                    className="group flex w-full items-center justify-between py-5 text-left"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span className="font-mono text-[clamp(2.25rem,11vw,5rem)] font-medium leading-[0.88] tracking-[-0.07em] text-black">
                      {link.label}
                    </span>

                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                      <span className="absolute h-px w-7 bg-black" />
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
                      <div className="border-t border-black/10 pb-7">
                        {services.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            onClick={onClose}
                            className="group flex items-center justify-between border-b border-black/10 py-3.5 font-mono text-[clamp(1rem,4vw,1.3rem)] leading-tight text-black transition-opacity duration-300 hover:opacity-40"
                          >
                            <span>{service.title}</span>
                            <span className="ml-4 h-px w-0 bg-black transition-all duration-400 group-hover:w-7" />
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
                className="group block border-b border-black/10 py-5 font-mono text-[clamp(2.25rem,11vw,5rem)] font-medium leading-[0.88] tracking-[-0.07em] text-black"
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-black transition-all duration-500 ease-out group-hover:w-full" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div data-mobile-item className="mt-10">
          <Link
            href="/contact"
            onClick={onClose}
            className="group flex w-full items-center justify-between border border-black px-5 py-4 font-mono text-sm uppercase tracking-[0.08em] text-black transition-all duration-500 hover:bg-black hover:text-white"
          >
            <span>Let&apos;s Talk</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* FOOTER */}
        <div
          data-mobile-item
          className="mt-16 flex items-end justify-between border-t border-black/10 pt-5"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
            {siteName}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
            Menu
          </span>
        </div>
      </div>
    </div>
  );
}
