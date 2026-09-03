import TextRevealBlock from "@/components/motion/TextRevealBlock";
import ScrollFillText from "@/components/motion/ScrollFillText";
import GlossyButton from "@/components/ui/GlossyButton";
import StatCounter from "./StatCounter";

/* ================================================================
   SERVICES MARKET STATS
   ================================================================
   Split out of ServicesMarketOverview.tsx as its own component:
   the "S.002 / Canadian Businesses / S.002" kicker, the two-line
   "Canadian Businesses Are Competing / in a Digital-First Market"
   heading, and the 4-card stats grid underneath it.

   Kicker + top spacing intentionally mirror ServicesMarketOverview's
   own intro kicker ("S.001 / Overview / S.001") — same mb-10/12/14
   below the kicker, same pt-12/14/16 above it — so both read as the
   same header pattern at the same distance from the top of their
   section.
   ================================================================ */

const STATS = [
  {
    value: "1.37M",
    label: "Employer Businesses In Canada",
    // Two office buildings — represents the employer-business count.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M4 21V4.5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1V21"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M14 21v-8.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V21"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M2 21h20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 8h1M7 12h1M7 16h1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "$21.1B",
    label: "Canadian Digital Advertising Market",
    // Coin with a dollar sign — represents ad-spend market size.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 6.5v11M9.5 9.25c0-1.1 1.12-2 2.5-2s2.5.65 2.5 1.75-1.12 1.75-2.5 1.75-2.5.65-2.5 1.75S10.62 15 12 15s2.5-.65 2.5-1.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    value: "+16%",
    label: "Digital Ad Market Growth In 2025",
    // Trending-up arrow — represents year-over-year growth.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M3 17l6-6 4 4 8-8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 7h6v6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "#1",
    label: "Search Remains Canada\u2019s Largest Digital Ad Category",
    // Magnifying glass — represents search as an ad category.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle
          cx="10.5"
          cy="10.5"
          r="6.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M20 20l-4.35-4.35"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function ServicesMarketStats() {
  return (
    <section className="bg-white-bg">
      <div className="w-full px-5 pt-12 pb-24 sm:pt-14 sm:pb-28 md:pt-16 md:pb-36">
        {/* Kicker row — mirrors ServicesMarketOverview's S.001 / OVERVIEW
            / S.001 pattern: same index left and right, section name
            centered, same mb-10/12/14 spacing below it. */}
        <div className="mb-10 flex items-center justify-between gap-6 sm:mb-12 md:mb-14">
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
            S.002
          </span>
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
            Canadian Businesses
          </span>
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
            S.002
          </span>
        </div>

        <TextRevealBlock
          as="h2"
          lines={[
            "Canadian Businesses Are Competing",
            "in a Digital-First Market",
          ]}
          className="mx-auto max-w-4xl text-center text-[2.25rem] leading-[1.15] font-semibold tracking-tight text-black-text sm:text-[48px] sm:leading-[1.1] sm:tracking-[-1.5px] md:text-[58px] md:leading-[1.08] md:tracking-[-2px] lg:max-w-[68rem] lg:text-[104px] lg:leading-[1.02] lg:tracking-[-3px]"
          scrollTrigger
        />

        <div className="mt-20 grid grid-cols-2 gap-5 sm:mt-24 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#f3f4ee] px-6 py-10 text-center sm:px-8 sm:py-12"
            >
              <span
                aria-hidden="true"
                className="mx-auto mb-7 flex h-8 w-8 items-center justify-center rounded-full border border-black-text/15 text-black-text/60 sm:mb-9"
              >
                {stat.icon}
              </span>
              <StatCounter
                value={stat.value}
                className="text-[46px] font-semibold tracking-tight text-black-text"
              />
              <p className="mt-4 text-[14px] font-medium tracking-wide text-black-text/50 uppercase sm:mt-5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Closing copy — moved here from ServicesMarketOverview.tsx's
            "Closing" section. Same two-part right/left-aligned
            static-lead-in + scroll-fill-clause pattern, followed by
            the centered mono caption. The Action-step CTA band stays
            behind in ServicesMarketOverview.tsx. */}
        <div className="mt-20 sm:mt-24 md:mt-28">
          {/* Row 1 — placeholder image left, statement right */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">
            <div className="aspect-[4/3] w-full shrink-0 bg-[#f3f4ee] md:w-2/5">
              <div className="flex h-full w-full items-center justify-center gap-3 text-black-text/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="8.5"
                    cy="9.5"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 16l5-5 4 4 3-3 6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-mono text-xs tracking-[0.14em] uppercase sm:text-sm">
                  Image placeholder
                </span>
              </div>
            </div>

            <p className="text-right text-balance text-[46px] leading-[1.3] font-normal normal-case tracking-tight md:flex-1">
              <span className="text-black-text">
                A website and a few social media accounts can give your business
                an online presence,
              </span>{" "}
              <ScrollFillText text="but that doesn’t automatically bring in customers, especially in a competitive market like Vancouver." />
            </p>
          </div>

          {/* Row 2 — statement left, placeholder image right (mirrored) */}
          <div className="mt-16 flex flex-col items-center gap-10 sm:mt-20 md:flex-row-reverse md:items-center md:gap-14">
            <div className="aspect-[4/3] w-full shrink-0 bg-[#f3f4ee] md:w-2/5">
              <div className="flex h-full w-full items-center justify-center gap-3 text-black-text/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="16"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="8.5"
                    cy="9.5"
                    r="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 16l5-5 4 4 3-3 6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-mono text-xs tracking-[0.14em] uppercase sm:text-sm">
                  Image placeholder
                </span>
              </div>
            </div>

            <p className="text-left text-balance text-[46px] leading-[1.3] font-normal normal-case tracking-tight md:flex-1">
              <span className="text-black-text">
                That&rsquo;s where the digital marketers at Technico Digital
                Solutions come in.
              </span>{" "}
              <ScrollFillText text="We look at how customers find your business, what happens when they reach your website, and where potential leads drop off." />
            </p>
          </div>

          <p className="mt-14 w-full text-justify indent-8 text-[46px] leading-[1.3] font-normal normal-case tracking-tight text-black-text sm:mt-16">
            SEO, paid ads, content, and social media are then brought together
            to help local businesses like yours generate qualified leads,
            ecommerce stores attract more customers, and growing brands reach a
            wider audience across Canada.
          </p>
        </div>
      </div>

      {/* Action step — moved here from ServicesMarketOverview.tsx's
          "Closing" section. */}
      <div className="bg-black-bg px-5 py-20 text-center sm:py-28 md:py-36">
        <p className="mx-auto max-w-4xl text-[46px] leading-[1.3] font-normal normal-case tracking-tight text-white">
          We go the extra mile to help you fulfill your business plans with
          targeted digital marketing strategies.{" "}
          <ScrollFillText
            text="Partner with us today and see competitive results."
            className="text-white"
          />
        </p>
        <div className="mx-auto mt-10 w-full max-w-xs uppercase sm:w-auto">
          <GlossyButton to="/contact">Book a Call</GlossyButton>
        </div>
      </div>
    </section>
  );
}
