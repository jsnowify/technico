"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/content/types";
import SlidingText from "@/components/motion/SlidingText";

/* ================================================================
   SERVICES LIST
   ================================================================
   Visual language lifted from home/Services.tsx's ServicePanel
   (bordered white card, same type scale, same bracketed "Learn
   More" + SlidingText hover) so /services reads as the same design
   system as the homepage rather than a generic index page.

   Deliberately NOT the homepage's pinned/horizontal-scroll GSAP
   mechanism — that's built for a fixed two-at-a-time teaser strip;
   a full listing page with an arbitrary/growing number of services
   just wants a normal responsive grid. Also no icon column: the
   `/services` content model (lib/content/services.ts) only carries
   title/shortDescription/description — it doesn't have the
   home page's per-service icon assets. Every card here still gets
   the same eyebrow "[ ... ]" bracket link treatment for continuity.
   ================================================================ */

function ServiceCard({ service }: { service: Service }) {
  const [learnMoreHovered, setLearnMoreHovered] = useState(false);

  return (
    <li className="flex flex-col border border-[#D9D9D9] bg-white px-8 py-10 sm:px-10 sm:py-12">
      <h2 className="text-2xl leading-tight font-normal text-balance tracking-tight text-black-text sm:text-3xl">
        {service.title}
      </h2>

      <p className="mt-5 max-w-md text-sm leading-relaxed text-black-text/70 text-pretty sm:text-base">
        {service.shortDescription}
      </p>

      <Link
        href={`/services/${service.slug}`}
        aria-label={`Learn more about ${service.title}`}
        onMouseEnter={() => setLearnMoreHovered(true)}
        onMouseLeave={() => setLearnMoreHovered(false)}
        className="mt-7 inline-flex w-fit items-center font-mono text-xs tracking-[0.14em] text-black-text uppercase transition-colors duration-300 hover:text-black-text/50 focus-visible:outline-2 focus-visible:outline-purple-accent sm:text-sm"
      >
        <span aria-hidden="true">[&nbsp;</span>
        <SlidingText text="Learn More" isHovered={learnMoreHovered} />
        <span aria-hidden="true">&nbsp;]</span>
      </Link>
    </li>
  );
}

export default function ServicesList({ services }: { services: Service[] }) {
  return (
    <section className="bg-white-bg">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 md:py-28">
        {/* Eyebrow — same square + label pattern as home/Services.tsx */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 bg-black-text" />
          <span className="font-mono text-xs tracking-[0.16em] text-black-text uppercase text-balance sm:text-sm">
            What We Offer
          </span>
        </div>

        <h2 className="mx-auto mt-7 max-w-4xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-black-text sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          Every service, one place
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-loose text-black-text/60 text-pretty sm:mt-8 sm:text-base">
          Pick a service below to see exactly how we approach it, what it
          includes, and what it can do for your business.
        </p>

        <ul className="mt-16 grid gap-8 sm:mt-20 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </ul>
      </div>
    </section>
  );
}
