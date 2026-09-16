"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import HoverImageSwap from "@/components/services/HoverImageSwap";
import ScrollFillText from "@/components/motion/ScrollFillText";

/* ================================================================
   SERVICES MARKET OVERVIEW
   ================================================================
   REDESIGN PASS — sentence 1 + sentence 2 (the "Technico Digital
   Solutions provides digital marketing services..." / "Our digital
   experts support businesses across..." pair) no longer render as
   two separate heading + HoverImageSwap-list + caption blocks. Per
   your screenshot, they're now ONE flowing paragraph in a two-column
   layout — a headline on the left, the full paragraph on the right
   — on a dark section instead of white. The IMPROVE_ITEMS /
   INDUSTRY_ITEMS image lists are gone: the screenshot's version of
   this block has no imagery, just text, so those hover-image wells
   were dropped rather than kept unused.

   Every phrase that used to be its own hover-list label (Search
   Visibility, Reach Qualified Audiences, Generate Leads, Healthcare
   and Dental, Legal Services, Automotive, Solar and Renewable
   Energy, Construction, Electrical, Home Improvement, SEO, Paid
   Advertising, Web Design and Development, Content) is now an inline
   <Highlight> span in the paragraph — bold + underlined, sitting on
   its own rounded gray chip (bg-white/10) by default, that swaps to
   a solid purple chip with dark text on hover/focus, matching your
   screenshot exactly (gray-rounded-bg by default, purple-bg on
   hover, not just a hover-only tint). No wording changed — this is
   the same two sentences, just reflowed as continuous prose instead
   of being cut into heading/list/caption fragments.

   "digital marketing services" — ACTIVE BY DEFAULT
   ------------------------------------------------------------
   This link (<HighlightLink>) stays in the purple/active look at
   rest, instead of only turning purple on its own hover — that's
   what makes this a client component now. Every plain <Highlight>
   reports its own hover/focus up to this component via
   `onHoverChange`; while ANY of them is hovered/focused, the link
   drops back to the normal gray-chip look, and the moment nothing
   else is hovered it returns to purple/active. Hovering the link
   itself still just keeps it purple (no visible change) since
   `hover:`/`focus-visible:` on the link are the same purple classes
   as its `active` state.

   ASSUMPTION FLAGGED: the left-column headline "Join the growing
   number of clients who trust Technico Digital Solutions." is new
   copy — it wasn't part of the previously established sentences,
   it's only in your screenshot. Kept it since it's your own mock,
   but flagging it here in case it wasn't meant to be added copy.

   NOT touched (copy/structure-wise): sentence 3+4's actual wording
   still lives right below — only its presentation changed: the
   ChannelsJigsawCard two-panel puzzle shape was replaced with a
   plain full-width rounded photo (per your screenshot), and the
   CHANNEL_ITEMS hover list underneath it is untouched per your
   explicit "don't touch my hoverimg" — its variant="dark" prop and
   everything else about it is exactly as it was.

   SPACING FIX (this pass)
   ------------------------------------------------------------
   The "[ ] Growth Strategy" closing sentence ("You don't have to
   rely on just one marketing channel... / We look at where your
   customers are searching...") had visibly uneven word-gaps across
   its lines. Root cause was `text-justify` on that <p>:
     - `text-justify` stretches word-spacing per line to fill the
       full column width, EXCEPT the last line of the block, which
       browsers always render as natural/left-aligned — so the final
       line ("website, and how") reads at a different rhythm than
       the justified lines above it. Expected justify behavior, not
       a bug, but it read as "off" at this short paragraph length.
     - This was made more noticeable by ScrollFillText's markup: the
       animated clause splits into one <span data-fill-word> per
       word (see ScrollFillText.tsx), so that portion of the line
       has many more inline-element boundaries than the plain lead-in
       span, which is one continuous text run. More boundaries in the
       same line gives the browser more places to distribute justify
       spacing unevenly, and some WebKit versions are inconsistent
       justifying across many nested inline spans specifically.
   Fix: dropped `text-justify`, kept `text-left` (browser default,
   made explicit). Justify is best suited to long multi-line text
   columns; at 3–4 lines it was creating more visual noise than it
   solved. No wording, sizing, or ScrollFillText usage changed.
   ================================================================ */

const HIGHLIGHT_BASE =
  "-mx-1 box-decoration-clone rounded-lg px-2 py-1 font-normal underline decoration-2 underline-offset-4 transition-colors duration-200";
const HIGHLIGHT_IDLE = "bg-white/10 text-white decoration-white";
const HIGHLIGHT_ACTIVE =
  "bg-purple-accent text-black-text decoration-black-text";

function Highlight({
  children,
  onHoverChange,
}: {
  children: ReactNode;
  /** Lets the parent know this phrase is hovered/focused, so it can
   *  drop the "digital marketing services" link out of its default
   *  active look while attention is elsewhere. */
  onHoverChange?: (hovered: boolean) => void;
}) {
  return (
    <span
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      className={`${HIGHLIGHT_BASE} ${HIGHLIGHT_IDLE} hover:bg-purple-accent hover:text-black-text hover:decoration-black-text`}
    >
      {children}
    </span>
  );
}

function HighlightLink({
  href,
  children,
  active,
}: {
  href: string;
  children: ReactNode;
  /** Show the purple/active look at rest, not just on hover/focus. */
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${HIGHLIGHT_BASE} outline-none ${active ? HIGHLIGHT_ACTIVE : HIGHLIGHT_IDLE} hover:bg-purple-accent hover:text-black-text hover:decoration-black-text focus-visible:bg-purple-accent focus-visible:text-black-text focus-visible:decoration-black-text`}
    >
      {children}
    </Link>
  );
}

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
  // True while any OTHER highlighted phrase is hovered/focused — used
  // to drop "digital marketing services" out of its default-active
  // purple look, per your ask.
  const [otherHighlighted, setOtherHighlighted] = useState(false);

  return (
    <>
      {/* Intro — sentence 1 + sentence 2, flowing paragraph on dark bg.
          bg-[#0A0A0C] matches ServicesHero's section exactly (that
          component doesn't use the black-bg token, it's a one-off hex),
          so this section reads as the same dark as the hero instead of
          a slightly-different black.

          ONE <section>, not two: this used to be two separate <section>
          elements stacked back to back, each with its own top+bottom
          padding — since both landed on the same bg, those two paddings
          just added together into one huge, inconsistent gap between
          the paragraph and the jigsaw card. Merged into a single
          section with one outer padding and one explicit `mt-*` gap
          between the two blocks, so the spacing is controlled in one
          place instead of being the sum of two unrelated ones. */}
      <section className="bg-[#0A0A0C]">
        {/* Container matches the homepage's own pattern (Services.tsx /
            QuestionsAnswers.tsx / FAQ.tsx): px-6/8/12 stepping up to a
            fixed lg:px-[90px] gutter, not a centered max-w column — so
            this lines up edge-to-edge with those sections instead of
            floating narrower inside its own max-width box. */}
        <div className="container-x section-y">
          {/* Headline + paragraph side by side from lg up (same
              flex-row/items-start shape as Services.tsx's header row),
              stacked on mobile. */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            {/* Left column — new headline (see note above). Same
                indent-8/10/12 -> 44px cap and fixed lg:w-[700px] column
                width as every other homepage section's paragraph-pair
                heading (Services.tsx, QuestionsAnswers.tsx, Qualify.tsx),
                so this headline reads at the same scale as the rest of
                the site instead of its own one-off size. Plain static
                heading now, no reveal animation. */}
            <h2 className="indent-8 text-[32px] leading-[1.15] font-medium tracking-heading text-white sm:indent-10 sm:text-[40px] md:indent-12 md:text-[44px] lg:w-[700px] lg:shrink-0">
              Join the growing number of clients who trust Technico Digital
              Solutions.
            </h2>

            {/* Right column — sentence 1 + sentence 2 as one paragraph,
                now the same 18px body size + leading-relaxed used for
                paragraph copy across the rest of the site (Services.tsx,
                ServiceIntroPanel.tsx), plus a touch of tracking so the
                wider letter-spacing doesn't read cramped at this size.
                Not wrapped in RevealUpText: that component splits text
                word-by-word into its own masked spans, which would
                break the multi-word <Highlight>/<HighlightLink>
                background boxes below (they need a single continuous
                inline run for box-decoration-clone to paint correctly). */}
            <p className="text-[18px] leading-relaxed font-normal tracking-[0.01em] text-white-text/45">
              Technico Digital Solutions provides{" "}
              <HighlightLink href="/services" active={!otherHighlighted}>
                digital marketing services
              </HighlightLink>{" "}
              for businesses seeking to improve{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Search Visibility
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Reach Qualified Audiences
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Generate Leads
              </Highlight>
              , and convert more online interactions into customers. Our digital
              experts support businesses across{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Healthcare and Dental
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Legal Services
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Automotive
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Solar and Renewable Energy
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Construction
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Electrical
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Home Improvement
              </Highlight>
              , and other local service industries through{" "}
              <Highlight onHoverChange={setOtherHighlighted}>SEO</Highlight>,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Paid Advertising
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>
                Web Design and Development
              </Highlight>
              ,{" "}
              <Highlight onHoverChange={setOtherHighlighted}>Content</Highlight>
              , and digital campaigns built around measurable business goals.
            </p>
          </div>

          {/* Sentence 3+4 — same wording, new presentation per your
              screenshot: a plain full-width rounded photo (was the
              two-panel ChannelsJigsawCard puzzle shape), a "[ ] Growth
              Strategy" eyebrow, then the sentence itself as one
              right-aligned block — the lead-in bold/white, the rest
              (starting at "We look at...") muted/white-40, instead of
              being split across a bold heading + separate paragraph. */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-[30px] sm:aspect-video lg:aspect-[21/9]">
              <Image
                src="https://res.cloudinary.com/dp9bjis3z/image/upload/q_auto:best/v1789032026/temporary-placeholder/Gemini_Generated_Image_3f5bts3f5bts3f5b_qjxyw0.avif"
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:mt-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <span className="font-mono text-xs tracking-[0.16em] text-white/50 uppercase sm:text-sm">
                [ ] Growth Strategy
              </span>

              {/* text-justify removed — see "SPACING FIX" note at top
                  of file. Was producing visibly uneven word-gaps
                  because this is a short (3–4 line) block and the
                  animated clause's per-word <span> markup gives the
                  browser more places to distribute justify spacing
                  unevenly than the plain lead-in's single text run.
                  text-left is the explicit, honest default here. */}
              <p className="indent-24 text-left text-[36px] leading-[1.3] font-normal tracking-tight lg:w-[720px] lg:shrink-0">
                <span className="font-normal text-white">
                  You don&apos;t have to rely on just one marketing channel to
                  grow your business.
                </span>{" "}
                <ScrollFillText
                  text="We look at where your customers are searching, what they see when they land on your website, and how"
                  className="text-white"
                />
              </p>
            </div>

            {/* Untouched per your ask — same HoverImageSwap call, same
                variant="dark", same caption, same everything. */}
            <div className="mt-14 sm:mt-16 md:mt-20">
              <HoverImageSwap
                items={CHANNEL_ITEMS}
                imageFirst
                variant="dark"
                caption={
                  <p
                    key="channel-caption"
                    className="mt-8 max-w-md text-[36px] leading-[1.15] tracking-tight text-white"
                  >
                    can work together to bring in leads and turn more of those
                    leads into customers.
                  </p>
                }
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
