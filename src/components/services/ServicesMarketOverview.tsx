import Link from "next/link";
import TextRevealBlock from "@/components/motion/TextRevealBlock";
import ScrollFillText from "@/components/motion/ScrollFillText";
import GlossyButton from "@/components/ui/GlossyButton";
import HoverImageSwap from "@/components/services/HoverImageSwap";
import StatCounter from "./StatCounter";

/* ================================================================
   SERVICES MARKET OVERVIEW
   ================================================================
   Implements the layout you built (see SERVICES_OVERVIEW.png):
   heading fragment -> hover-swap list + image well -> small caption,
   twice, then the stats row, then a two-tone closing statement, then
   the CTA band. This pass is layout-only, spacing-consistency work
   plus the hover-swap interaction and a purple accent — it does not
   redesign anything beyond what's in your mock.

   SIZE/SPACING PASS — this component now runs wider and roomier than
   the first build: the shared container went from max-w-6xl to
   max-w-7xl (with px-8/px-12 added at sm/lg so content actually
   reaches toward the edges instead of floating in a narrow column),
   every heading stepped up a size (topping out around 64px on
   desktop instead of 50px), the HoverImageSwap columns/gap and list
   type grew to match, and the vertical rhythm between blocks, the
   stats cards, and the closing/CTA padding all deepened so the
   section reads closer to the scale in your screenshot. Nothing
   about the copy, order, or interaction changed — this is spacing
   and type-scale only.

   COPY — same sentences, reassembled the way your mock chunks them
   ------------------------------------------------------------
   Nothing here is new or reworded. Each heading + list + caption
   trio reassembles one full original sentence in order, e.g.:
     "...seeking to improve" + "Search Visibility" + "Reach
     Qualified Audiences" + "Generate Leads" + "and convert more
     online interactions into customers."
   concatenates back to the exact original first sentence. Same for
   the industries heading/list/caption, and for the closing
   two-tone-heading + caption pairs.

   The second intro paragraph ("You don't have to rely on just one
   marketing channel...") is now included as a third heading + list +
   caption block, using the same reassembly technique: the lead-in
   runs up through "...and how", the five-item list is the channel
   enumeration ("SEO, paid ads, content, social media, and email"),
   and the caption is the closing clause. Unlike the first two blocks
   its heading isn't width-capped down to max-w-3xl/4xl — it runs the
   full section width, since it's a longer lead-in and you asked for
   this block not to read as a small centered aside.

   Also not silently changed: the CTA button here still reads "Book
   a Strategy Call" (uppercased via CSS to match the mock's visual
   style) rather than the mock's "FREE STRATEGY" — that's a copy
   change, not a layout one, so it's left for you to confirm rather
   than assumed.

   INTERACTION
   ------------------------------------------------------------
   Both list+image blocks use HoverImageSwap (client component):
   hovering/focusing a label cross-fades the image well to that
   item's image and dims the other labels — the "search visibility
   down to generate leads" hover motion you described, reused
   identically for the industries list.

   IMAGES — still placeholders, still unchanged in *source*
   ------------------------------------------------------------
   Every image well still points at the same four existing
   /approach/technico-step-*.jpg files, just fanned out across more
   hover targets by reuse/cycling — there weren't more real photo
   assets in the project to draw from. Swap for real photography
   per list item once it's picked.

   PURPLE ACCENT
   ------------------------------------------------------------
   Added, kept minimal: the inline "digital marketing services"
   link, the small dot marking the active hover-list item, and the
   existing purple CTA button (GlossyButton's default).
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

const IMPROVE_ITEMS = [
  {
    label: "Search Visibility",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236391/services-overview/technico-digital-solutions-search-visibility_mrloi9.png",
  },
  {
    label: "Reach Qualified Audiences",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236390/services-overview/technico-digital-solutions-search-visibility_2_nzcq26.png",
  },
  {
    label: "Generate Leads",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236390/services-overview/technico-digital-solutions-generate-leads_toppvz.png",
  },
] as const;

const INDUSTRY_ITEMS = [
  {
    label: "Healthcare and Dental",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236392/services-overview/technico-digital-solutions-healthcare-and-dental_scpht3.png",
  },
  {
    label: "Legal Services",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236392/services-overview/technico-digital-solutions-legal-services_hpn9ye.png",
  },
  {
    label: "Automotive",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236392/services-overview/technico-digital-solutions-automotive_zkrens.png",
  },
  {
    label: "Solar and Renewable Energy",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236389/services-overview/technico-digital-solutions-solar-and-renewable-energy_wnh6yi.png",
  },
  {
    label: "Construction",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236389/services-overview/technico-digital-solutions-construction_urbfnb.png",
  },
  {
    label: "Electrical",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236389/services-overview/technico-digital-solutions-electrical_u2quqj.png",
  },
  {
    label: "Home Improvement",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236389/services-overview/technico-digital-solutions-home-improvement_lmnxfl.png",
  },
] as const;

const CHANNEL_ITEMS = [
  {
    label: "SEO",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236387/services-overview/technico-digital-solutions-seo_ngn3yp.png",
  },
  {
    label: "Paid Ads",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236388/services-overview/technico-digital-solutions-paid-ads_ekfejq.png",
  },
  {
    label: "Content",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236387/services-overview/technico-digital-solutions-content_d2jxv6.png",
  },
  {
    label: "Social Media",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236388/services-overview/technico-digital-solutions-social-media_ip5tiw.png",
  },
  {
    label: "Email",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236387/services-overview/technico-digital-solutions-email_b7uvnh.png",
  },
] as const;

export default function ServicesMarketOverview() {
  return (
    <>
      {/* Intro */}
      <section className="bg-white-bg">
        <div className="w-full px-5 pt-20 sm:pt-28 md:pt-32">
          <span className="mb-8 block font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:mb-10 sm:text-sm">
            Overview
          </span>

          {/* Sentence 1, heading fragment */}
          <h2 className="max-w-5xl text-4xl leading-[1.1] font-semibold tracking-tight text-black-text capitalize sm:text-5xl md:text-6xl md:leading-[1.08] lg:text-[64px]">
            <TextRevealBlock
              as="div"
              lines={["Technico Digital Solutions"]}
              className="inline-block align-baseline"
              revealColorDark="#000000"
              scrollTrigger
            />{" "}
            provides{" "}
            <Link
              href="/services"
              className="text-purple-secondary underline decoration-1 underline-offset-4 hover:text-purple-accent"
            >
              <TextRevealBlock
                as="div"
                lines={["digital marketing services"]}
                className="inline-block align-baseline"
                revealColorDark="#000000"
                scrollTrigger
              />
            </Link>{" "}
            for businesses seeking to improve
          </h2>

          {/* Sentence 1, list + image (image left, list right) */}
          <div className="mt-14 sm:mt-16 md:mt-20">
            <HoverImageSwap items={IMPROVE_ITEMS} imageFirst />
            <p className="mt-8 max-w-md font-mono text-sm leading-relaxed tracking-wide text-black-text/50 uppercase sm:text-base">
              and convert more online interactions into customers.
            </p>
          </div>
        </div>

        {/* Sentence 2, heading fragment — right-aligned per the mock */}
        <div className="w-full mt-28 px-5 sm:mt-36 md:mt-44">
          <TextRevealBlock
            as="h2"
            lines={["Our digital experts support businesses across"]}
            className="ml-auto max-w-4xl text-right text-4xl leading-[1.1] font-semibold tracking-tight text-black-text capitalize sm:text-5xl md:text-6xl md:leading-[1.08] lg:text-[64px]"
            revealColorDark="#000000"
            scrollTrigger
          />

          {/* Sentence 2, list + image (list left, image right) */}
          <div className="mt-14 sm:mt-16 md:mt-20">
            <HoverImageSwap items={INDUSTRY_ITEMS} imageFirst={false} />
            <p className="mt-8 max-w-xl font-mono text-sm leading-relaxed tracking-wide text-black-text/50 uppercase sm:text-base">
              and other local service industries through SEO, paid advertising,
              web design and development, content, and digital campaigns built
              around measurable business goals.
            </p>
          </div>
        </div>

        {/* Sentence 3+4, heading fragment — full section width, not
            capped down to a narrow centered column like the closing
            statements below. */}
        <div className="w-full mt-28 px-5 sm:mt-36 md:mt-44">
          <h2 className="w-full text-4xl leading-[1.1] font-semibold tracking-tight text-black-text capitalize sm:text-5xl md:text-6xl md:leading-[1.08] lg:text-[64px]">
            <TextRevealBlock
              as="div"
              lines={[
                "You don\u2019t have to rely on just one marketing channel to grow your business.",
              ]}
              className="inline-block align-baseline text-black-text"
              revealColorDark="#000000"
              scrollTrigger
            />{" "}
            <ScrollFillText text="We look at where your customers are searching, what they see when they land on your website, and how" />
          </h2>

          {/* Sentence 3+4, list + image (image left, list right) */}
          <div className="mt-14 sm:mt-16 md:mt-20">
            <HoverImageSwap items={CHANNEL_ITEMS} imageFirst />
            <p className="mt-8 max-w-md font-mono text-sm leading-relaxed tracking-wide text-black-text/50 uppercase sm:text-base">
              can work together to bring in leads and turn more of those leads
              into customers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white-bg">
        <div className="mx-auto max-w-[100rem] px-6 pt-28 pb-24 sm:px-10 sm:pt-32 sm:pb-28 md:pt-40 md:pb-36 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex items-center justify-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-secondary"
            />
            <span className="font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
              The Canadian Market
            </span>
          </div>

          <TextRevealBlock
            as="h2"
            lines={[
              "Canadian Businesses Are Competing",
              "in a Digital-First Market",
            ]}
            className="mx-auto mt-8 max-w-4xl text-center text-[2.25rem] leading-[1.15] font-semibold tracking-tight text-black-text sm:mt-10 sm:text-[48px] sm:leading-[1.1] sm:tracking-[-1.5px] md:text-[58px] md:leading-[1.08] md:tracking-[-2px] lg:text-[64px]"
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
                  className="text-4xl font-semibold tracking-tight text-black-text sm:text-5xl"
                />
                <p className="mt-4 text-xs font-medium tracking-wide text-black-text/50 uppercase sm:mt-5 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-white-bg">
        <div className="w-full px-5 pt-8 pb-20 sm:pb-28 md:pb-32">
          {/* Closing, part 1 — right-aligned, balanced wrap, pushed
              toward the right edge (20px gutter) rather than
              centered in a narrow container, so it visually leads
              into part 2 below it sitting on the left. The bold
              lead-in is static; only the dimmed clause after it
              scroll-fills word by word. */}
          <p className="ml-auto max-w-2xl text-right text-balance text-3xl leading-[1.3] font-semibold tracking-tight capitalize sm:text-4xl md:text-5xl md:leading-[1.25] lg:max-w-3xl">
            <span className="sr-only">Start here: </span>
            <span className="text-black-text">
              A website and a few social media accounts can give your business
              an online presence,
            </span>{" "}
            <ScrollFillText text="but that doesn’t automatically bring in customers, especially in a competitive market like Vancouver." />
          </p>

          {/* Closing, part 2 — left-aligned, balanced wrap, pushed
              toward the left edge (20px gutter), mirroring part 1.
              Same static-lead-in + scroll-fill-clause pattern. */}
          <p className="mr-auto mt-20 max-w-2xl text-left text-balance text-3xl leading-[1.3] font-semibold tracking-tight capitalize sm:mt-24 sm:text-4xl md:text-5xl md:leading-[1.25] lg:max-w-3xl">
            <span className="text-black-text">
              That&rsquo;s where the digital marketers at Technico Digital
              Solutions come in.
            </span>{" "}
            <ScrollFillText text="We look at how customers find your business, what happens when they reach your website, and where potential leads drop off." />
          </p>

          <p className="mx-auto mt-14 max-w-2xl text-center font-mono text-sm leading-relaxed tracking-wide text-black-text/50 uppercase sm:mt-16 sm:text-base">
            SEO, paid ads, content, and social media are then brought together
            to help local businesses like yours generate qualified leads,
            ecommerce stores attract more customers, and growing brands reach a
            wider audience across Canada.
          </p>
        </div>

        {/* Action step */}
        <div className="bg-black-bg px-6 py-20 text-center sm:py-28 md:py-36">
          <p className="mx-auto max-w-3xl text-2xl leading-[1.35] font-semibold tracking-tight text-white capitalize sm:text-3xl md:text-4xl">
            We go the extra mile to help you fulfill your business plans with
            targeted digital marketing strategies. Partner with us today and see
            competitive results.
          </p>
          <div className="mx-auto mt-10 w-full max-w-xs uppercase sm:w-auto">
            <GlossyButton to="/contact">Book a Strategy Call</GlossyButton>
          </div>
        </div>
      </section>
    </>
  );
}
