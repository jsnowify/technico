"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   ABOUT HERO
   ================================================================
   Redesigned to match the client's reference: a plain stacked
   layout instead of the old two-column split.

     - Headline sits alone on the left, using the site's shared
       `.h1-hero` fluid clamp (font-medium, 62px true desktop size —
       same class/weight as every other page's H1, per globals.css)
       instead of a one-off size.
     - A short supporting line + the purple "Book a Call" pill sit
       top-right, next to (not under) the headline — same row on
       sm+, stacked on mobile.
     - A single full-width rounded image panel sits below, echoing
       ServicesHero.tsx's image-panel treatment (rounded-[32px],
       dark placeholder bg so it never flashes white while the
       image loads).

   Fully static — no GSAP, no fade/rise-in, no scroll parallax,
   no floating card — per client request.

   ASSET (expected in /public, already used elsewhere in the site):
     /technico-digital-solutions-inc-bg.webp     (home/Hero.tsx)
   ================================================================ */

const HERO_IMAGE = "/technico-digital-solutions-inc-bg.webp";

export default function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-black-bg">
      <div className="container-x mx-auto flex max-w-[1440px] flex-col gap-8 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
        {/* TOP ROW — headline left, short blurb + CTA top-right.
            Stacks on mobile, sits side by side from sm+ so the CTA
            lines up with the top of the headline, not its center. */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <h1 className="h1-hero tracking-heading max-w-2xl leading-[1.05] font-medium text-white">
            Your Trusted Digital Marketers For Business Transformation
          </h1>

          <div className="flex max-w-[260px] flex-col items-start gap-4 sm:pt-1">
            <p className="text-sm leading-relaxed text-white/60">
              At Technico Solutions, We&apos;re Your Trusted Digital Marketers,
              All About Driving Results That Matter.
            </p>

            <Button to={SITE_PHONE_HREF} variant="purple">
              Book a Call
            </Button>
          </div>
        </div>

        {/* BOTTOM — single full-width rounded image panel, same
            dark-placeholder-bg pattern as ServicesHero's image
            panel so there's never a white flash while it loads. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-[#17181c] sm:aspect-[16/9] lg:aspect-[21/8]">
          <Image
            src={HERO_IMAGE}
            loading="eager"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
