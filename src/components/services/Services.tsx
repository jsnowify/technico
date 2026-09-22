"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SERVICES, type Service } from "@/lib/constants";
import ServiceArtwork from "./ServiceArtwork";
import ServiceLearnMore from "./ServiceLearnMore";

/**
 * /services — full-width editorial service gallery.
 *
 * Inspired by the supplied reference video: each desktop spread is pinned
 * to the top of the viewport. As the next spread scrolls up, it covers the
 * previous one and becomes the newly pinned service. The left visual
 * alternates light/dark; the right copy panel remains light.
 *
 * CSS sticky handles the pinning (without extra ScrollTrigger spacer DOM),
 * and each successive spread has a higher stacking level. The shared
 * gallery bounds the sticky panels so the next page section can enter
 * naturally after the last service.
 *
 * Each visual uses an interactive SVG with visibility-aware animation.
 *
 * Desktop: stacked/pinned spreads with a 30:80 visual-to-copy ratio.
 * Mobile: accessible natural flow because the full image + service copy can
 * exceed one mobile viewport; no content is hidden behind the next card.
 * Motion: a subtle once-only inner reveal; reduced motion disables it.
 * Global CSS theme colors only: black-bg, white-bg, black-text, white-text.
 */

const INTRO_TITLE = "Turn more online attention into leads and sales";
const INTRO_COPY =
  "Use the right mix of digital services to build awareness, generate demand, & support long-term growth.";

interface CapabilityItem {
  label: string;
  detail?: string;
}

interface CapabilityGroup {
  title?: string;
  items: CapabilityItem[];
}

interface DetailedService extends Service {
  tagline: string;
  paragraphs: string[];
  capabilityGroups: CapabilityGroup[];
}

const SERVICE_DETAILS: DetailedService[] = [
  {
    ...SERVICES[0],
    title: "Search Engine Optimization (SEO)",
    tagline: "Drive organic traffic and get quality leads",
    paragraphs: [
      "We at Technico Digital Solutions starts SEO work by looking at how your website currently performs in search, what your potential customers are searching for, and which competitors are taking visibility you could be capturing. Our team audits the site’s technical setup, existing pages, keyword targeting, content, and backlink profile to identify where improvements can have the most impact.",
      "From there, Technico’s digital marketers build the SEO work around the searches that matter to your business. That can include improving service and location pages, fixing on-page and technical issues, creating content around relevant search queries, strengthening internal linking, and building external authority. Performance is tracked over time to see which pages and keywords are gaining visibility and where further optimisation is needed. SEO services include:",
    ],
    capabilityGroups: [
      {
        items: [
          { label: "Keyword research" },
          { label: "On-page SEO" },
          { label: "Off-page SEO" },
          { label: "Content strategy" },
          { label: "SEO audits" },
        ],
      },
    ],
  },
  {
    ...SERVICES[1],
    title: "Website Design & Development",
    tagline: "Create a strong digital presence with a user-centred website",
    paragraphs: [
      "Technico approaches website design around what visitors need to do once they arrive, not just how the site looks. Before designing or rebuilding a website, the team looks at your services, target customers, site structure, conversion points, and the marketing channels that will be sending traffic to it.",
      "Pages are then structured so visitors can quickly understand what the business offers, find the information they need, and take the next step. Technico combines web design and development with mobile responsiveness, site performance, SEO considerations, clear calls to action, and conversion-focused page layouts. If you’re launching a new site or updating an existing one, you can expect:",
    ],
    capabilityGroups: [
      {
        items: [
          { label: "Custom web design" },
          { label: "Responsive development" },
          { label: "Performance optimization" },
          { label: "Conversion focus" },
        ],
      },
    ],
  },
  {
    ...SERVICES[2],
    title: "Creative Design & Content Services",
    tagline: "Engage your audience with compelling content & visuals",
    paragraphs: [
      "Captivate your audience with high-quality, creative content that tells your brand story and drives engagement. From graphics to blog posts, our creative services focus on building brand authority and establishing a strong connection with your target audience.",
      "Our approach guarantees your content is not only appealing but also strategic to engage your audience and strengthen your brand presence.",
    ],
    capabilityGroups: [
      {
        title: "Content",
        items: [
          { label: "Copywriting" },
          { label: "Content writing" },
          { label: "Content strategy" },
          { label: "SEO Content" },
        ],
      },
      {
        title: "Visuals",
        items: [
          { label: "Visual design" },
          { label: "Infographics" },
          { label: "Social media graphics" },
          { label: "Image elements" },
        ],
      },
    ],
  },
  {
    ...SERVICES[3],
    title: "Media Buying & Digital Advertising",
    tagline: "Maximize ROI with data-driven advertising campaigns",
    paragraphs: [
      "Our marketing team plans paid campaigns around who the business needs to reach, where that audience can be reached, and what action they should take after clicking an ad. Instead of putting your ad budget into different channels and hoping something works, we will have to discuss what you want to achieve first. We will plan out the right platforms to use, audiences, keywords, campaign types, and landing pages to put your budget where it has the strongest chance of generating results.",
      "We at Technico monitor spend, clicks, conversions, cost per lead, and other relevant performance data. Budgets and targeting can then be adjusted based on what is generating results, rather than leaving campaigns running unchanged. The process also includes testing ad creative, messaging, audiences, and landing-page combinations to identify opportunities to improve campaign performance. Media buying and advertising services include:",
    ],
    capabilityGroups: [
      {
        items: [
          {
            label: "PPC (pay-per-click)",
            detail:
              "Google Ads campaigns to increase website traffic and close sales.",
          },
          {
            label: "SEM (search engine marketing)",
            detail:
              "Paid search campaigns targeting the right keywords drive qualified traffic.",
          },
          {
            label: "Social media marketing",
            detail:
              "Ads on social media platforms increase brand visibility & engagement.",
          },
        ],
      },
    ],
  },
  {
    ...SERVICES[4],
    title: "Social Media Management",
    tagline: "Build meaningful connections with your target market",
    paragraphs: [
      "Social media management at Technico goes beyond filling up your content calendar. The team looks at who you want to reach, where those people are active, what your competitors are doing, and which topics and formats are getting attention in your industry. We handle the day-to-day work behind your accounts, including content planning, copywriting, creative production, scheduling, publishing, and community management. Our marketers will then keep an eye on platform and industry trends, so content can respond to what audiences are interested in instead of following the same content plan month after month.",
      "The numbers help guide what happens next. Technico team reviews impressions, reach, engagement, clicks, click-through rates (CTR), follower growth, website traffic, and other relevant performance data to see what is getting noticed and what is driving people to take action. Posts, formats, topics, publishing times, and calls to action can then be adjusted based on those insights. Your social media management can include:",
    ],
    capabilityGroups: [
      {
        items: [
          {
            label: "Strategy & research",
            detail:
              "Audience research, competitor analysis, platform strategy, and trend monitoring.",
          },
          {
            label: "Community management",
            detail:
              "Comment monitoring, audience interaction, and ongoing account management.",
          },
          {
            label: "Traffic & conversion tracking",
            detail:
              "Website traffic, user actions, and conversions generated through social channels.",
          },
          {
            label: "Content & creative",
            detail:
              "Content calendars, copywriting, creative design, scheduling, and publishing.",
          },
          {
            label: "Performance analytics",
            detail:
              "Impressions, reach, engagement, clicks, CTR, and follower growth.",
          },
          {
            label: "Reporting & optimization",
            detail:
              "Performance reporting, content analysis, and ongoing campaign adjustments.",
          },
        ],
      },
    ],
  },
  {
    ...SERVICES[5],
    title: "Email Marketing",
    tagline: "Drive conversions with targeted campaigns",
    paragraphs: [
      "Although Technico is particularly focused on SEO as a core growth driver, we still strongly believe in the power of email marketing as a complementary channel. We do not create generic, mass-produced email campaigns that end up in spam folders or get ignored. Every email strategy we develop is tailored to the recipient, grounded in research, and designed with intent.",
      "Technico uses email marketing to keep the conversation going after someone joins a mailing list, submits an enquiry, makes a purchase, or becomes an existing customer. Rather than sending the same message to an entire database, contacts can be grouped based on where they are in the customer journey and what they have shown interest in.",
      "We write the emails, create the design, organise your contacts into the right groups, and set up automated follow-ups. Once the emails go out, they track opens, clicks, and conversions to see what people respond to and adjust future campaigns accordingly.",
    ],
    capabilityGroups: [],
  },
];

function ServiceSpread({
  service,
  index,
}: {
  service: DetailedService;
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");
  // The video alternates white / black image panels, keeping the copy
  // background white all the way down the page.
  const dark = index % 2 === 1;

  return (
    <article
      data-services-row
      aria-labelledby={`service-spread-${number}`}
      // Every desktop spread pins at the same top edge. Later spreads must
      // paint OVER earlier ones instead of disappearing behind them.
      style={{ zIndex: index + 1 }}
      className="relative grid min-w-0 grid-cols-1 border-t border-black-text/15 bg-white-bg lg:sticky lg:top-0 lg:min-h-[100svh] lg:grid-cols-[minmax(240px,30fr)_minmax(0,80fr)]"
    >
      <div
        className={`relative flex min-w-0 flex-col items-center justify-between overflow-hidden px-6 pt-11 pb-8 sm:px-10 sm:pt-14 sm:pb-11 lg:min-h-[100svh] lg:border-r lg:border-black-text/15 lg:px-[clamp(24px,3vw,52px)] lg:pt-[clamp(48px,7svh,86px)] lg:pb-[clamp(32px,5svh,64px)] ${
          dark ? "bg-black-bg text-white-text" : "bg-white-bg text-black-text"
        }`}
      >
        <div
          className={`relative z-10 flex w-full items-start justify-between gap-5 font-mono text-[10px] leading-[1.3] tracking-[0.08em] uppercase sm:text-[11px] ${
            dark ? "text-white-text/55" : "text-black-text/55"
          }`}
        >
          <span>
            / {number} — {String(SERVICE_DETAILS.length).padStart(2, "0")}
          </span>
          <span className="max-w-[175px] text-right">
            Designed for your next stage of growth.
          </span>
        </div>

        <div className="relative z-10 mx-auto mt-10 mb-8 w-full max-w-[420px] sm:mt-14 sm:mb-11 lg:my-auto lg:py-12">
          <ServiceArtwork title={service.title} index={index} dark={dark} />
          <ServiceLearnMore
            href={service.href}
            title={service.title}
            dark={dark}
            className="mt-5 sm:mt-6"
          />
        </div>

        <div
          className={`relative z-10 flex w-full items-center gap-4 font-mono text-[10px] tracking-[0.08em] uppercase sm:text-[11px] ${
            dark ? "text-white-text/50" : "text-black-text/50"
          }`}
        >
          <span>Technico digital solutions</span>
        </div>
      </div>

      <div className="flex min-w-0 items-start bg-white-bg px-6 py-14 text-black-text sm:px-10 sm:py-18 lg:min-h-[100svh] lg:px-[clamp(44px,6vw,112px)] lg:py-[clamp(64px,8svh,104px)]">
        <div data-service-copy className="mx-auto w-full max-w-[920px]">
          <p className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.05em] text-black-text/50 uppercase sm:mb-7 sm:text-[11px]">
            <span className="h-1.5 w-1.5 bg-purple-accent" aria-hidden="true" />
            Service / {number}
          </p>

          <div className="grid min-w-0 grid-cols-1 items-end gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,1.5fr)_minmax(180px,0.5fr)]">
            <h2
              id={`service-spread-${number}`}
              className="h2-section max-w-[26ch] leading-[1.08] font-medium tracking-heading text-balance"
            >
              {service.title}
            </h2>

            <p className="max-w-[34ch] font-mono text-[14px] leading-[1.4] tracking-[-0.04em] text-purple-accent sm:justify-self-end sm:text-right">
              “{service.tagline}”
            </p>
          </div>

          <div className="mt-6 grid max-w-[920px] grid-cols-1 gap-x-10 gap-y-4 sm:mt-7 xl:grid-cols-2">
            {service.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraph}
                className={`max-w-[58ch] font-mono text-[14px] leading-[1.58] tracking-[-0.04em] text-black-text/70 ${
                  service.paragraphs.length % 2 === 1 &&
                  paragraphIndex === service.paragraphs.length - 1
                    ? "xl:col-span-2 xl:max-w-[74ch]"
                    : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {service.capabilityGroups.length > 0 && (
            <div className="mt-8 sm:mt-10">
              <p className="mb-4 font-mono text-[10px] tracking-[0.05em] text-black-text/45 uppercase sm:text-[11px]">
                Our capabilities
              </p>
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {service.capabilityGroups.map((group, groupIndex) => (
                  <div
                    key={`${service.href}-group-${groupIndex}`}
                    className={
                      service.capabilityGroups.length === 1
                        ? "sm:col-span-2"
                        : undefined
                    }
                  >
                    {group.title && (
                      <p className="mb-2 font-mono text-[10px] tracking-[0.04em] text-purple-accent uppercase">
                        / {group.title}
                      </p>
                    )}
                    <ul className="grid border-t border-black-text/60 xl:grid-cols-2 xl:gap-x-8">
                      {group.items.map((item, itemIndex) => (
                        <li
                          key={`${service.href}-${groupIndex}-${item.label}`}
                          className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-black-text/30 py-[11px] font-mono text-[13px] leading-[1.35] tracking-[-0.04em] sm:text-[14px]"
                        >
                          <span className="font-medium">{item.label}</span>
                          <span
                            aria-hidden="true"
                            className="row-span-2 shrink-0 font-mono text-[9px] text-black-text/35"
                          >
                            / {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          {item.detail && (
                            <span className="max-w-[52ch] text-[12px] leading-[1.5] text-black-text/60 sm:text-[13px]">
                              {item.detail}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.utils.toArray<HTMLElement>("[data-services-row]").forEach((row) => {
        const image = row.querySelector<HTMLElement>("[data-service-visual]");
        const copy = row.querySelector<HTMLElement>("[data-service-copy]");
        if (!image || !copy) return;

        // Only animate inner content. Do NOT transform the pinned article:
        // transforms on the spread itself interfere with sticky stacking.
        gsap.from([image, copy], {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-gallery-heading"
      // Do not set overflow-hidden/auto on a sticky ancestor: that would
      // create a new scroll container and break the viewport pinning.
      className="bg-white-bg text-black-text"
    >
      <header className="container-x grid gap-10 border-t border-black-text/20 py-16 sm:py-20 lg:grid-cols-[30fr_80fr] lg:gap-0 lg:py-24">
        <div className="flex flex-col justify-between gap-6 lg:pr-10">
          <p className="font-mono text-[11px] tracking-[0.12em] text-black-text/60 uppercase">
            / Technico — What we do
          </p>
          <h2
            id="services-gallery-heading"
            className="h2-section leading-[1.08] font-medium tracking-heading"
          >
            Services<span className="text-purple-accent">.</span>
          </h2>
        </div>
        <div className="flex items-end lg:border-l lg:border-black-text/20 lg:pl-[clamp(44px,6vw,112px)]">
          <div className="max-w-[920px]">
            <p className="h3-section max-w-[34ch] leading-[1.15] font-medium tracking-heading text-black-text">
              {INTRO_TITLE}
            </p>
            <p className="body-copy mt-4 max-w-[62ch] leading-[1.6] tracking-[-0.02em] text-black-text/65">
              {INTRO_COPY}
            </p>
          </div>
        </div>
      </header>

      {/* One shared sticky containing block. The section that follows this
          gallery naturally releases all pinned service spreads. */}
      <div data-services-gallery className="relative isolate">
        {SERVICE_DETAILS.map((service, index) => (
          <ServiceSpread key={service.href} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
