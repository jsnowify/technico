import Button from "@/components/ui/Button";
import GlossyButton from "@/components/ui/GlossyButton";
import RevealUpText from "@/components/motion/RevealUpText";
import TiltIn from "@/components/motion/TiltIn";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   HOME STRATEGY (third section)
   ================================================================
   Rebuilt to mirror Overview.tsx's layout structure exactly, just
   re-themed for this section's dark background:
     [ Eyebrow ]  bracket label, left-aligned
     Big left-aligned headline
     Book a Call / Free Strategy CTA row
     ---------------------------------------------------------
     Panel grid — single shared border-t + divide-x line (not a
     colored gap), each panel a plain title + paragraph block
     ---------------------------------------------------------
   Same left-aligned eyebrow/headline/CTA block Overview uses (was
   previously a centered dot-eyebrow + centered headline here), and
   the same border-t/divide-x grid convention Overview's 3-panel
   feature grid uses (was previously a 2-color bg-purple-secondary /
   bg-[#f3f4ee] split with a gap-3 seam). Two panels instead of
   three, since this section only ever had two content blocks
   (Philosophy / Why It Works) — everything else, including the
   plain dark panel backgrounds instead of colored ones, follows
   Overview's convention.

   Container still mirrors Overview's exact margin strategy — mx-4
   on mobile, mx-[70px] from sm: up — so the left/right border rule
   lines keep running unbroken from Overview into this section.

   NOTE: outer wrapper uses the full `border` shorthand (not just
   border-x) so the top/bottom edges close the frame into an actual
   rectangle instead of leaving the vertical lines open-ended at the
   section seam. Also intentionally has no pb-* (matches Overview,
   which only sets pt-16) — the panel grid's own py-16/py-20/py-24
   supplies the bottom spacing, so the divide-x line runs all the
   way to where the section actually ends.

   CASING: `uppercase` removed from the eyebrow, headline, and panel
   titles below (previously matched Overview's all-caps treatment) —
   these now render in the normal sentence/title casing already
   present in the text content itself, nothing else changed.

   PANELS: white (bg-white-bg) against the section's black bg, same
   treatment as Overview.tsx's feature grid — panel text/divider
   colors flipped to black-text variants accordingly, and the grid
   wrapper uses -mx-4 sm:mx-[-30px] to cancel the parent's px-4
   sm:px-[30px] padding so the white panel bg runs edge-to-edge to
   the outer border frame instead of leaving a black gap.

   ICONS: same 70x70-octagon-frame treatment as Overview.tsx's
   PanelIcon — a subtle octagon outline behind a centered glyph, dark
   (black-text/50) by default since these panels are white, brightening
   to white on hover to match the solid purple/pink fill sliding up
   underneath. Each glyph is inset-scaled from its own source viewBox
   to fit the 42x42 slot inside the 70x70 frame (both source icons
   share the same 122.88 width, so both use the same scale factor,
   just different vertical centering to match their own aspect
   ratio). Wrapped in TiltIn for the same scroll-into-view settle
   Overview.tsx's icons use, then a CSS group-hover tilt on top.
   ================================================================ */

function PanelIcon({ variant }: { variant: "chart" | "growth" }) {
  const OCTAGON = "M21 0H49L70 21V49L49 70H21L0 49V21Z";
  const ICON_BOX =
    "h-24 w-24 text-black-text/50 transition-[color,transform] duration-500 ease-out group-hover:-rotate-6 group-hover:text-white";
  const octagon = (
    <path
      d={OCTAGON}
      stroke="var(--color-black-text)"
      strokeWidth={1}
      opacity={0.15}
    />
  );

  // "Our Philosophy" — column-chart-icon.svg (source viewBox
  // 122.88x105.98).
  if (variant === "chart") {
    return (
      <svg viewBox="0 0 70 70" className={ICON_BOX} fill="none">
        {octagon}
        <g transform="translate(14 16.89) scale(0.3418)" fill="currentColor">
          <path d="M122.88,105.98H9.59v-0.02c-2.65,0-5.05-1.08-6.78-2.81c-1.72-1.72-2.79-4.11-2.79-6.75H0V0h12.26v93.73h110.62V105.98 L122.88,105.98z M83.37,45.6h19.55c1.04,0,1.89,0.85,1.89,1.89v38.46c0,1.04-0.85,1.89-1.89,1.89H83.37 c-1.04,0-1.89-0.85-1.89-1.89V47.5C81.48,46.46,82.33,45.6,83.37,45.6L83.37,45.6z M25.36,22.07h19.55c1.04,0,1.89,0.85,1.89,1.89 v62c0,1.04-0.85,1.89-1.89,1.89H25.36c-1.04,0-1.89-0.85-1.89-1.89v-62C23.47,22.92,24.32,22.07,25.36,22.07L25.36,22.07 L25.36,22.07z M54.37,8.83h19.54c1.04,0,1.89,0.85,1.89,1.89v75.24c0,1.04-0.85,1.89-1.89,1.89H54.37c-1.04,0-1.89-0.85-1.89-1.89 V10.72C52.48,9.68,53.33,8.83,54.37,8.83L54.37,8.83z" />
        </g>
      </svg>
    );
  }

  // "Why It Works" — chart-arrow-up-icon.svg (source viewBox
  // 122.88x116.68).
  return (
    <svg viewBox="0 0 70 70" className={ICON_BOX} fill="none">
      {octagon}
      <g transform="translate(14 15.06) scale(0.3418)" fill="currentColor">
        <path d="M69.53,91.55l13.23,13.23c3.2,0.09,5.77,2.72,5.77,5.95c0,3.29-2.66,5.95-5.95,5.95c-3.29,0-5.95-2.67-5.95-5.95 c0-0.36,0.03-0.72,0.09-1.07L65.21,98.16v8.46l-8.24,0v-8.23l-11.69,11.7c0.02,0.21,0.03,0.43,0.03,0.65c0,0,0,0,0,0 c0,3.29-2.66,5.95-5.96,5.95c-3.29,0-5.95-2.67-5.95-5.95c0-3.29,2.67-5.95,5.95-5.95c0.1,0,0.2,0,0.29,0.01l13.23-13.23L0,91.55 V15.71c0-0.05,0-0.09,0-0.14V7.52c0-0.87,0.72-1.57,1.61-1.57h55.36V0h8.24v5.95h56.06c0.89,0,1.61,0.71,1.61,1.57v8.05 c0,0.03,0,0.05,0,0.08v75.89H69.53L69.53,91.55z M26.89,62.71l23.26-22.74c5.76,5.76,11.46,11.46,17.28,17.21l15.41-15.6 l-7.15-7.15l20.12-0.18v20.29l-6.87-6.87c-7.16,7.25-14.29,14.48-21.47,21.67L50.03,52.12L32.99,68.81L26.89,62.71L26.89,62.71 L26.89,62.71z M113.79,21.73H8.92v60.64h104.87V21.73L113.79,21.73z" />
      </g>
    </svg>
  );
}

export default function Strategy() {
  return (
    <section className="bg-black-bg">
      <div className="mx-4 border border-white/10 px-4 pt-16 sm:mx-[70px] sm:px-[30px]">
        {/* Eyebrow */}
        <p className="font-mono text-xs tracking-[0.14em] text-white/70 uppercase">
          [ Establish Your Brand as a Market Leader ]
        </p>

        {/* Headline — word-by-word scroll rise-in via RevealUpText,
            same classes it replaced. */}
        <RevealUpText
          as="h2"
          text="We drive your brand forward, automate strategies, and boost revenue."
          className="mt-4 max-w-4xl text-[32px] leading-[1.1] font-medium tracking-tight text-white sm:text-[42px] md:text-[56px] lg:text-[64px]"
        />
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/60">
          Our expertise lies in leveraging the latest technology to help you
          scale — whether that means generating more appointments or driving
          increased sales.
        </p>

        {/* CTAs — same Book a Call / Free Strategy pairing as
            Overview. */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <div className="w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="white-static" size="lg">
              Book a Call
            </Button>
          </div>
          <div className="w-full max-w-xs sm:w-auto">
            <GlossyButton to="/contact">Free Strategy</GlossyButton>
          </div>
        </div>

        {/* Panel grid — same shared border-t + divide-x convention
            as Overview's feature grid, 2 columns instead of 3.
            White panel bg + -mx-4 sm:mx-[-30px] edge-to-edge fix,
            matching Overview.tsx. */}
        <div className="mt-16 -mx-4 grid grid-cols-1 divide-y divide-black-text/10 border-t border-black-text/10 sm:mx-[-30px] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="group relative overflow-hidden bg-white-bg px-4 py-16 sm:px-8 sm:py-20 md:py-24">
            {/* Hover fill — solid purple, hidden below the fold and
                slid up to cover the panel on hover (same slide-from-
                bottom treatment as Overview.tsx). */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 translate-y-full bg-purple-accent transition-transform duration-500 ease-out group-hover:translate-y-0"
            />
            <div className="relative">
              <TiltIn>
                <PanelIcon variant="chart" />
              </TiltIn>

              <span className="mt-6 mb-6 block font-mono text-xs tracking-[0.2em] text-black-text/50 transition-colors duration-300 group-hover:text-white/70">
                Our Philosophy
              </span>
              <RevealUpText
                as="h3"
                text="Revenue, By Design"
                className="text-[25px] font-medium tracking-wide text-black-text transition-colors duration-300 group-hover:text-white"
              />
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-black-text/70 transition-colors duration-300 group-hover:text-white/90">
                A powerful marketing strategy isn&rsquo;t just about promotions
                — it&rsquo;s about maximizing revenue opportunities through
                strategic outreach.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white-bg px-4 py-16 sm:px-8 sm:py-20 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 translate-y-full bg-pink-accent transition-transform duration-500 ease-out group-hover:translate-y-0"
            />
            <div className="relative">
              <TiltIn>
                <PanelIcon variant="growth" />
              </TiltIn>

              <span className="mt-6 mb-6 block font-mono text-xs tracking-[0.2em] text-black-text/50 transition-colors duration-300 group-hover:text-white/70">
                Why It Works
              </span>
              <RevealUpText
                as="h3"
                text="Growth, Compounded"
                className="text-[25px] font-medium tracking-wide text-black-text transition-colors duration-300 group-hover:text-white"
              />
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-black-text/70 transition-colors duration-300 group-hover:text-white/90">
                Successful marketing strategies are the biggest driver of
                revenue acceleration. A strong digital campaign builds the
                recognition you deserve and brings in new, high-intent
                customers. Technico Digital Solutions supports businesses of
                every size with a holistic approach built to grow your online
                presence, market position, and revenue together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
