import ScrollFillText from "@/components/motion/ScrollFillText";
import RevealUpText from "@/components/motion/RevealUpText";
import HoverImageSwap from "@/components/services/HoverImageSwap";
import ChannelsJigsawCard from "@/components/services/ChannelsJigsawCard";

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
        <div className="relative w-full px-5 pt-12 pb-5 sm:pt-14 md:pt-16">
          {/* Kicker row — three-part S.001 / OVERVIEW / S.001 strip,
              matching the reference's mirrored-label header exactly
              (same index left and right, section name centered)
              instead of the old index+tagline pairing. */}
          <div className="mb-10 flex items-center justify-between gap-6 sm:mb-12 md:mb-14">
            <span className="font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
              S.001
            </span>
            <span className="font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
              Overview
            </span>
            <span className="font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
              S.001
            </span>
          </div>

          {/* Sentence 1, heading fragment — bold/black weight,
              natural paragraph wrap (words flow left-to-right and
              wrap normally, no edge-to-edge justify stretch, no
              first-line indent), tighter leading to match the
              reference's denser stack, and a plain black underline
              in place of the purple link treatment. */}
          <h2 className="w-full text-[42px] leading-[1.05] font-medium tracking-[-1px] text-black-text capitalize sm:text-[56px] sm:tracking-[-1.5px] md:text-[72px] md:tracking-[-2px] lg:text-[88px] lg:tracking-[-3px] xl:text-[72px]">
            {/* Rise-up-on-scroll (see /components/motion/RevealUpText.tsx)
                — same word-by-word "y:80, stagger, circ.out" shape as
                the GSAP "Animate text on Scroll" demo, restart/reverse
                on re-crossing the trigger. Swapped in for this
                heading in place of ScrollFillText's opacity fill;
                the /services link stays a real <Link> inside it. */}
            <RevealUpText
              segments={[
                { text: "Technico Digital Solutions provides" },
                {
                  text: "digital marketing services",
                  href: "/services",
                  className:
                    "underline decoration-2 underline-offset-4 hover:text-black-text/70",
                },
                { text: "for businesses seeking to improve" },
              ]}
            />
          </h2>

          {/* Sentence 1, list + image (image left, list right) */}
          <div className="mt-14 sm:mt-16 md:mt-20">
            <HoverImageSwap
              items={IMPROVE_ITEMS}
              imageFirst
              caption={
                <p
                  key="improve-caption"
                  className="mt-8 max-w-md text-[36px] leading-[1.15] tracking-tight text-black-text"
                >
                  <ScrollFillText
                    text="and convert more online interactions into customers."
                    accent
                  />
                </p>
              }
            />
          </div>
        </div>

        {/* Sentence 2, heading fragment — right-aligned per the mock */}
        <div className="w-full mt-28 px-5 sm:mt-36 md:mt-44">
          <RevealUpText
            as="h2"
            text="Our digital experts support businesses across"
            className="ml-auto max-w-4xl text-right text-[42px] leading-[0.95] font-medium tracking-[-1px] text-black-text capitalize sm:text-[56px] sm:tracking-[-1.5px] md:text-[72px] md:tracking-[-2px] lg:text-[88px] lg:tracking-[-3px] xl:text-[72px]"
          />

          {/* Sentence 2, list + image (list left, image right) */}
          <div className="mt-14 sm:mt-16 md:mt-20">
            <HoverImageSwap
              items={INDUSTRY_ITEMS}
              imageFirst={false}
              caption={
                <p
                  key="industry-caption"
                  className="mt-8 max-w-xl text-[36px] leading-[1.15] tracking-tight text-black-text"
                >
                  <ScrollFillText
                    text="and other local service industries through SEO, paid advertising, web design and development, content, and digital campaigns built around measurable business goals."
                    accent
                  />
                </p>
              }
            />
          </div>
        </div>

        {/* Sentence 3+4 — the "you don't have to rely on just one
            channel..." / "we look at where your customers are
            searching..." pairing now lives inside the two-panel
            jigsaw card (see ChannelsJigsawCard.tsx / CARD_SVG.svg)
            instead of a plain stacked heading. Position in the
            section, and everything below it, is unchanged. */}
        <div className="w-full mt-28 px-5 sm:mt-36 md:mt-44">
          <ChannelsJigsawCard />

          {/* Sentence 3+4, list + image (image left, list right) */}
          <div className="mt-14 sm:mt-16 md:mt-20">
            <HoverImageSwap
              items={CHANNEL_ITEMS}
              imageFirst
              caption={
                <p
                  key="channel-caption"
                  className="mt-8 max-w-md text-[36px] leading-[1.15] tracking-tight text-black-text"
                >
                  <ScrollFillText
                    text="can work together to bring in leads and turn more of those leads into customers."
                    accent
                  />
                </p>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
