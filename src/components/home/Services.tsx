"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { SERVICES, type Service } from "@/lib/constants";
import SlidingText from "@/components/motion/SlidingText";
import PixelRevealImage from "./PixelRevealImage";

/**
 * Inline links inside a service description, keyed by the service's href.
 * `label` must appear verbatim in that service's description text.
 */
const DESCRIPTION_LINKS: Record<string, { label: string; href: string }> = {
  "/services/creative-design-and-content": {
    label: "target market",
    href: "https://www.investopedia.com/terms/t/target-market.asp",
  },
};

function renderDescription(service: Service) {
  const link = DESCRIPTION_LINKS[service.href];
  if (!link) return service.description;

  const index = service.description.indexOf(link.label);
  if (index === -1) return service.description;

  return (
    <>
      {service.description.slice(0, index)}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="circle"
        data-cursor-label="Explore"
        className="underline underline-offset-4 transition-colors hover:text-purple-accent"
      >
        {link.label}
      </a>
      {service.description.slice(index + link.label.length)}
    </>
  );
}

/**
 * Each card sticks below the exposed headings above it, on ALL viewports.
 * The height and the sticky offset read from the same CSS variable, so the
 * mobile header spacing cannot drift from the desktop stacking animation.
 */
function ServiceSheet({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);
  const number = `S.01.${index + 1}`;

  return (
    <article
      className="service-sheet sticky flex min-h-0 flex-col border-t border-black-bg/20 bg-white-bg md:min-h-[460px]"
      style={
        {
          top: `calc(var(--service-header-height) * ${index})`,
          zIndex: index + 1,
        } as CSSProperties
      }
    >
      {/* Remains exposed when subsequent cards slide over this card. */}
      <div className="service-sheet-header grid h-[var(--service-header-height)] shrink-0 grid-cols-[34%_minmax(0,1fr)] items-center gap-x-2 px-5 sm:px-8 md:grid-cols-[36%_minmax(0,1fr)] md:gap-x-0 md:px-[2.6%]">
        <span className="font-mono text-[10px] leading-none tracking-[-0.035em] text-black-text sm:text-xs md:text-[13px]">
          / {number}
        </span>
        <h3 className="h3-section min-w-0 leading-[1.05] font-medium tracking-[-0.04em] text-black-text uppercase">
          {service.title}
        </h3>
      </div>

      {/* On phones: full-width copy followed by CTA + a compact image on one
          row. Desktop retains the original three-column reference layout. */}
      <div className="service-sheet-body grid flex-1 grid-cols-[minmax(0,1fr)_104px] gap-x-3 gap-y-4 px-5 pt-4 pb-5 sm:grid-cols-[minmax(0,1fr)_132px] sm:px-8 md:grid-cols-[36%_minmax(0,1fr)_20%] md:gap-x-0 md:gap-y-0 md:px-[2.6%] md:pt-5 md:pb-9">
        <div aria-hidden="true" className="hidden md:block" />

        <div className="contents md:flex md:min-w-0 md:flex-col md:items-start md:pr-8 lg:pr-12">
          <p className="body-copy col-span-2 max-w-[410px] leading-[1.45] tracking-[-0.03em] text-black-text uppercase md:col-span-1 md:indent-12 md:leading-[1.35] md:[text-align:justify]">
            {renderDescription(service)}
          </p>

          <ul className="col-span-2 max-w-[420px] space-y-0.5 md:col-span-1 md:mt-13">
            {service.bullets.map((bullet) => (
              <li
                key={bullet}
                className="font-mono text-[11px] leading-[1.22] tracking-[-0.045em] text-black-text/55 uppercase sm:text-[13px] md:text-[14px] md:leading-[1.15]"
              >
                <span aria-hidden="true" className="mr-1">
                  /
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          <Link
            href={service.href}
            aria-label={`Learn more about ${service.title}`}
            data-cursor="circle"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="col-start-1 row-start-3 inline-flex w-fit items-center self-center justify-self-center whitespace-nowrap font-mono text-[11px] leading-none tracking-[-0.025em] text-black-text uppercase transition-opacity hover:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black-text sm:text-[12px] md:mt-auto md:self-center md:pt-8"
          >
            <span aria-hidden="true">[&nbsp;</span>
            <SlidingText text="Learn More" isHovered={hovered} />
            <span aria-hidden="true">&nbsp;]</span>
          </Link>
        </div>

        {/* The slot gets its color by mixing the global black-bg token with
            the global white-bg sheet — no one-off background hex values. */}
        <div className="col-start-2 row-start-3 flex h-[104px] min-h-0 items-center justify-center bg-black-bg/10 p-3 sm:h-[132px] md:col-start-auto md:row-start-auto md:h-[330px] md:self-start md:p-5">
          <div className="service-sheet-icon relative h-16 w-16 sm:h-20 sm:w-20 md:h-[min(12vw,190px)] md:w-[min(12vw,190px)]">
            <PixelRevealImage
              src={service.icon}
              alt=""
              sizes="(min-width: 1024px) 190px, (min-width: 768px) 12vw, (min-width: 640px) 80px, 64px"
              fit="contain"
              canvasClassName="bg-transparent"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Even without animated content, the CSS sticky stack works for people
      // who prefer reduced motion.
      if (prefersReducedMotion) return;

      const sheets = gsap.utils.toArray<HTMLElement>(".service-sheet");

      sheets.slice(1).forEach((sheet, i) => {
        const body = sheet.querySelector<HTMLElement>(".service-sheet-body");
        if (!body) return;

        gsap.fromTo(
          body,
          { y: window.innerWidth < 768 ? 18 : 44, opacity: 0.65 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sheet,
              start: "top bottom",
              end: () => {
                // Measure the actual rendered header: mobile height uses svh,
                // and this recalculates automatically on viewport refresh.
                const headerHeight =
                  sheets[0]
                    ?.querySelector<HTMLElement>(".service-sheet-header")
                    ?.getBoundingClientRect().height ?? 48;
                const revealGap = window.innerWidth < 768 ? 100 : 160;
                return `top ${Math.min((i + 2) * headerHeight + revealGap, window.innerHeight - 40)}px`;
              },
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-black-bg [--service-header-height:clamp(40px,7svh,48px)] md:[--service-header-height:60px]"
    >
      {/* Introduction remains dark; its color comes from globals.css. */}
      <div className="container-x mx-auto min-h-0 w-full max-w-[1920px] bg-black-bg pt-12 pb-20 text-white-text md:min-h-[385px] md:pt-10 md:pb-28">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-[29%_42.5%_28.5%] md:gap-y-0">
          <div className="flex items-start gap-10 font-mono text-[12px] leading-[1.2] tracking-[-0.04em] text-white-text/80 uppercase md:grid md:grid-cols-[55%_45%] md:gap-0 md:pt-1">
            <span aria-hidden="true">/</span>
            <span>Services</span>
          </div>

          <h2 className="h2-section max-w-[525px] leading-[1.08] font-medium tracking-heading text-white-text">
            Accelerate your online growth with proven digital marketing services
          </h2>

          <p className="body-copy max-w-[420px] leading-[1.5] tracking-[-0.03em] text-white-text uppercase md:pt-2">
            Our specialty is to help businesses grow faster online through
            effective digital marketing services. If you&rsquo;re building
            visibility from scratch or scaling an established brand, our
            strategies are built around measurable outcomes: more traffic,
            stronger leads, and better ROI.
          </p>
        </div>
      </div>

      <div>
        {SERVICES.map((service, index) => (
          <ServiceSheet key={service.title} service={service} index={index} />
        ))}
      </div>

      {/* Leave room for the final card to be read before the next section. */}
      <div className="h-20 bg-white-bg md:h-24" aria-hidden="true" />
    </section>
  );
}
