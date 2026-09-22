import type { Metadata } from "next";
import Link from "next/link";

import Button from "@/components/ui/Button";

/**
 * App Router's real 404 boundary: unmatched routes and notFound() calls render
 * this component. Do not redirect missing URLs to the homepage; Next.js
 * handles the not-found response and adds noindex.
 */
export const metadata: Metadata = {
  title: "404 — Page not found",
  description:
    "This page doesn't exist or may have moved. Return to Technico Digital Solutions or explore our services.",
  robots: { index: false, follow: true },
};

const SIGNAL_BARS = [38, 59, 45, 81, 64, 100, 76, 52, 68, 35] as const;

const QUICK_LINKS = [
  { label: "01 / Home", href: "/" },
  { label: "02 / Services", href: "/services" },
  { label: "03 / Blog", href: "/blog" },
  { label: "04 / Contact", href: "/contact" },
] as const;

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      data-technico-not-found=""
      className="relative isolate overflow-hidden bg-black-bg text-white-text"
    >
      <div className="container-x mx-auto flex min-h-svh w-full max-w-[1920px] flex-col pt-[clamp(112px,14svh,164px)] pb-[clamp(28px,5svh,64px)]">
        {/* Same thin metadata rail used across the site's purple heroes. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-white-text/35 pb-4 font-mono text-[10px] leading-[1.2] uppercase sm:grid-cols-4 sm:text-xs">
          <span>TECHNICO_</span>
          <span className="text-right sm:text-center">DIGITAL SOLUTIONS</span>
          <span>ERROR / 404</span>
          <span className="text-right">ROUTE NOT FOUND_</span>
        </div>

        <div className="grid min-w-0 flex-1 items-end gap-x-[clamp(28px,5vw,96px)] gap-y-12 py-[clamp(48px,8svh,112px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(230px,0.65fr)]">
          <div className="min-w-0">
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.09em] uppercase sm:mb-8 sm:text-xs">
              <span aria-hidden="true" className="h-2 w-2 bg-accent" />/ LOST IN
              THE DIGITAL VOID
            </p>

            <p
              aria-hidden="true"
              className="font-bold leading-[0.78] tracking-[-0.105em] tabular-nums text-accent"
              style={{ fontSize: "clamp(7.5rem, 24vw, 24rem)" }}
            >
              404
            </p>

            <h1
              id="not-found-title"
              className="mt-[clamp(26px,5svh,58px)] max-w-[12ch] font-bold leading-[0.92] tracking-[-0.075em] uppercase"
              style={{ fontSize: "clamp(2.75rem, 6.5vw, 7.25rem)" }}
            >
              Page not
              <br />
              found<span className="text-accent">.</span>
            </h1>
            <p className="body-copy mt-6 max-w-[48ch] leading-[1.55] tracking-body sm:mt-8">
              Looks like this page doesn&apos;t exist or has moved. Let&apos;s
              get you back to where you need to be.
            </p>
          </div>

          {/* An abstract lost-signal panel, based on the site's editorial
              waveforms. Decorative only: no client JS, canvas or extra GSAP. */}
          <div
            aria-hidden="true"
            className="relative flex min-h-[230px] flex-col justify-between overflow-hidden bg-accent p-[clamp(20px,3vw,38px)] text-black-bg sm:min-h-[290px] lg:min-h-[clamp(320px,37svh,460px)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-black-bg/30 pb-4 font-mono text-[10px] uppercase">
              <span>Signal / lost</span>
              <span className="text-black-bg">[ ! ]</span>
            </div>

            <div className="my-9 flex flex-col gap-[clamp(5px,0.65svh,9px)]">
              {SIGNAL_BARS.map((width, index) => (
                <span
                  key={index}
                  className="relative block h-[clamp(5px,0.55vw,8px)] w-full"
                >
                  <span
                    className="absolute inset-y-0 bg-black-bg"
                    style={{
                      width: `${width}%`,
                      left: index % 2 ? `${100 - width}%` : "0%",
                    }}
                  />
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-black-bg/30 pt-4 font-mono text-[10px] uppercase">
              <span>Requested page / unavailable</span>
              <span>000 / 404</span>
            </div>
          </div>
        </div>

        {/* Identical purple-fill + underline CTA pairing as the homepage hero. */}
        <div className="grid gap-7 border-t border-white-text/35 pt-7 sm:gap-8 sm:pt-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.08em] uppercase sm:text-xs">
              / RECOVERY OPTIONS
            </p>
            <h2 className="mt-3 max-w-[18ch] text-[clamp(1.5rem,2.65vw,2.5rem)] leading-[1.07] font-medium tracking-heading">
              Your next move starts here.
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-5 sm:mt-7">
              <Button to="/" variant="purple-fill" size="md">
                BACK TO HOME
              </Button>
              <Button to="/contact" variant="underline" size="md">
                START A PROJECT
              </Button>
            </div>
          </div>

          <nav
            aria-label="Helpful pages"
            className="grid grid-cols-2 gap-x-7 gap-y-0 border-t border-white-text/30 lg:border-t-0"
          >
            {QUICK_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                data-cursor="highlight"
                className="group flex min-h-12 items-center justify-between gap-3 border-b border-white-text/30 py-3 font-mono text-[10px] uppercase transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-text sm:text-xs"
              >
                <span>{label}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
