import TextRevealBlock from "@/components/motion/TextRevealBlock";
import ScrollFillText from "@/components/motion/ScrollFillText";
import PopIn from "@/components/motion/PopIn";
import Button from "@/components/ui/Button";
import StatCounter from "./StatCounter";

/* ================================================================
   SERVICES MARKET STATS
   ================================================================
   Split out of ServicesMarketOverview.tsx as its own component:
   the "S.002 / Canadian Businesses / S.002" kicker, the two-line
   "Canadian Businesses Are Competing / in a Digital-First Market"
   heading, and the 4 stats underneath it.

   Stats block restyled to match HeroStats.tsx's dark, per-row
   layout: a "S . 00N" mono index kicker on the left of each row,
   the stat's number large in the middle (via the shared
   StatCounter), the label on the right, and a 0.5px hairline
   divider between rows — same pattern as HeroStats, just with an
   "S" prefix instead of "H" since this is the Services section.

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
  },
  {
    value: "$21.1B",
    label: "Canadian Digital Advertising Market",
  },
  {
    value: "+16%",
    label: "Digital Ad Market Growth In 2025",
  },
  {
    value: "#1",
    label: "Search Remains Canada\u2019s Largest Digital Ad Category",
  },
];

export default function ServicesMarketStats() {
  return (
    <section className="bg-white-bg">
      <div className="w-full bg-black-bg px-5 pt-12 pb-20 sm:pt-14 sm:pb-24 md:pt-16 md:pb-28">
        {/* Kicker row — mirrors ServicesMarketOverview's S.001 / OVERVIEW
            / S.001 pattern: same index left and right, section name
            centered, same mb-10/12/14 spacing below it. */}
        <div className="mb-10 flex items-center justify-between gap-6 sm:mb-12 md:mb-14">
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-white/50 uppercase sm:text-sm">
            S.002
          </span>
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-white/50 uppercase sm:text-sm">
            Canadian Businesses
          </span>
          <span className="font-mono text-xs font-medium tracking-[0.14em] text-white/50 uppercase sm:text-sm">
            S.002
          </span>
        </div>

        <TextRevealBlock
          as="h2"
          lines={[
            "Canadian Businesses Are Competing",
            "in a Digital-First Market",
          ]}
          className="mx-auto max-w-4xl text-center text-[72px] leading-[1.1] font-medium tracking-tight text-white"
          scrollTrigger
        />
      </div>

      {/* Stats block is edge-to-edge (outside the section's px-5
          padding above/below it), same as HeroStats.tsx. */}
      <div className="bg-black-bg">
        <div className="w-full px-5 sm:px-10 md:px-16 lg:px-24">
          {STATS.map((stat, i) => (
            <div key={stat.label}>
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="h-[0.5px] w-full bg-white/15"
                />
              )}

              <div className="flex flex-col gap-4 py-10 sm:grid sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-8 sm:py-14 md:gap-14 md:py-16 lg:gap-20">
                <span className="font-mono text-xs tracking-[0.14em] text-white/40 uppercase">
                  {`S . 00${i + 1}`}
                </span>

                <StatCounter
                  value={stat.value}
                  className="text-[72px] leading-none font-medium tracking-tight text-white"
                />

                <p className="max-w-56 text-base leading-snug font-normal tracking-tight text-white uppercase sm:text-lg md:text-xl">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-5 pb-24 sm:pb-28 md:pb-36">
        {/* Closing copy — moved here from ServicesMarketOverview.tsx's
            "Closing" section. Same two-part right/left-aligned
            static-lead-in + scroll-fill-clause pattern, followed by
            the centered mono caption. The Action-step CTA band stays
            behind in ServicesMarketOverview.tsx. */}
        <div className="mt-20 sm:mt-24 md:mt-28">
          {/* Row 1 — placeholder image left, statement right */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-14">
            <div className="aspect-4/3 w-full shrink-0 bg-[#f3f4ee] md:w-2/5">
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

            <p className="text-right text-balance text-[36px] leading-[1.3] font-normal normal-case tracking-tight md:flex-1">
              <span className="text-black-text">
                A website and a few social media accounts can give your business
                an online presence,
              </span>{" "}
              <ScrollFillText text="but that doesn’t automatically bring in customers, especially in a competitive market like Vancouver." />
            </p>
          </div>

          {/* Row 2 — statement left, placeholder image right (mirrored) */}
          <div className="mt-16 flex flex-col items-center gap-10 sm:mt-20 md:flex-row-reverse md:items-center md:gap-14">
            <div className="aspect-4/3 w-full shrink-0 bg-[#f3f4ee] md:w-2/5">
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

            <p className="text-left text-balance text-[36px] leading-[1.3] font-normal normal-case tracking-tight md:flex-1">
              <span className="text-black-text">
                That&rsquo;s where the digital marketers at{" "}
                <PopIn className="inline-block -rotate-2 rounded-md bg-purple-600 px-3 py-1 text-white">
                  Technico
                </PopIn>{" "}
                Digital Solutions come in.
              </span>{" "}
              <ScrollFillText text="We look at how customers find your business, what happens when they reach your website, and where potential leads drop off." />
            </p>
          </div>

          <div className="mt-14 w-full rounded-[30px] bg-black   px-8 py-10 sm:mt-16 sm:px-12 sm:py-12">
            <p className="text-justify indent-8 text-[36px] leading-[1.3] font-normal normal-case tracking-tight text-white">
              SEO, paid ads, content, and social media are then brought together
              to help local businesses like yours generate qualified leads,
              ecommerce stores attract more customers, and growing brands reach
              a wider audience across Canada.
            </p>
          </div>
        </div>
      </div>

      {/* Action step — moved here from ServicesMarketOverview.tsx's
          "Closing" section. Restyled as a purple card attached to
          the left edge of the viewport (rounded on the right only,
          flush against the left edge), rather than a full-width
          dark band. */}
      <div className="bg-white-bg py-16 sm:py-20 md:py-24">
        <div className="mr-auto w-full max-w-3xl rounded-r-[40px] bg-purple-600 px-8 py-14 sm:px-12 sm:py-16 md:py-20">
          <p className="max-w-lg text-[32px] leading-[1.3] font-normal normal-case tracking-tight text-white sm:text-[36px]">
            We go the extra mile to help you fulfill your business plans with
            targeted digital marketing strategies.{" "}
            <ScrollFillText
              text="Partner with us today and see competitive results."
              className="text-white"
            />
          </p>
          <div className="mt-10 w-full max-w-xs uppercase sm:w-auto">
            <Button to="/contact" variant="white-static">
              Book a Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
