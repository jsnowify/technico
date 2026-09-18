import Link from "next/link";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import PixelRevealImage from "./PixelRevealImage";
import { SITE_PHONE_HREF } from "@/lib/constants";

// Replace this one path when the final Overview campaign image is ready.
const OVERVIEW_IMAGE = "/technico-digital-solutions-inc-bg.webp";

const STRATEGY_TEXT = (
  <>
    Technico Digital Solutions is a{" "}
    <Link
      href="https://technicosolutions.com/"
      className="text-purple-secondary underline decoration-1 underline-offset-2 transition-colors duration-300 hover:text-purple-accent"
    >
      digital marketing agency
    </Link>{" "}
    that will unlock your brand&rsquo;s potential to drive substantial growth.
    Benefit from our data-driven strategies focused on increasing your revenues
    and positioning your brand as a leader in the market.
  </>
);

const TIMELINE_TEXT = (
  <>
    Our digital marketing professionals establish a realistic timeline for
    implementing digital marketing strategies and setting milestones to track
    progress.
  </>
);

const GROWTH_TEXT = (
  <>
    Let us show you how we can elevate your revenue, amplify your profits, and
    expand your brand&rsquo;s reach in the digital realm.
  </>
);

interface OverviewCardProps {
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}

function OverviewCard({
  index,
  title,
  children,
  className = "",
}: OverviewCardProps) {
  return (
    <article className={`bg-black-bg p-5 sm:p-7 lg:p-8 ${className}`}>
      <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
        <span>{index}</span>
        <span>Introduction</span>
      </div>
      <h3 className="h3-section mt-5 font-medium tracking-heading text-white">
        {title}
      </h3>
      <p className="body-copy mt-4 leading-[1.6] tracking-[-0.02em] text-content uppercase">
        {children}
      </p>
    </article>
  );
}

export default function Overview() {
  return (
    <section className="bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Introduction</span>
          </div>
          <h2 className="h2-section max-w-[22ch] leading-[1.08] font-medium tracking-heading text-white">
            Boost revenues, maximize profits, generate qualified leads, and
            enhance brand visibility.
          </h2>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:mt-10 lg:grid-cols-12 lg:grid-rows-[minmax(190px,auto)_minmax(190px,auto)_auto]">
          <figure className="relative min-h-[300px] overflow-hidden bg-purple-secondary sm:col-span-2 sm:aspect-[16/9] sm:min-h-0 lg:col-span-7 lg:row-span-2 lg:aspect-auto">
            <PixelRevealImage
              src={OVERVIEW_IMAGE}
              alt="Purple digital environment representing scalable online growth"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-black/20"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 font-mono text-[10px] tracking-[0.06em] text-white uppercase sm:p-7 sm:text-xs lg:p-8">
              <span>/ Growth infrastructure</span>
              <span className="text-right text-white/55">
                Image slot / 01
              </span>
            </figcaption>
          </figure>

          <OverviewCard
            index="01"
            title="A strategy built around measurable growth."
            className="lg:col-start-8 lg:col-span-5 lg:row-start-1"
          >
            {STRATEGY_TEXT}
          </OverviewCard>

          <OverviewCard
            index="02"
            title="Clear milestones from launch to scale."
            className="lg:col-start-8 lg:col-span-5 lg:row-start-2"
          >
            {TIMELINE_TEXT}
          </OverviewCard>

          <OverviewCard
            index="03"
            title="More revenue, reach, and brand visibility."
            className="lg:col-start-1 lg:col-span-7 lg:row-start-3"
          >
            {GROWTH_TEXT}
          </OverviewCard>

          <div className="flex flex-col items-start justify-between gap-8 bg-black-bg p-5 sm:p-7 lg:col-start-8 lg:col-span-5 lg:row-start-3 lg:p-8">
            <p className="font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
              / Ready to grow?
            </p>
            <div className="flex flex-col items-start gap-6 xl:flex-row xl:items-center">
              <Button to={SITE_PHONE_HREF} variant="purple-fill">
                Book a Call
              </Button>
              <Button to="/contact" variant="underline">
                Free Strategy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
