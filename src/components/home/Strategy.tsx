import Button from "@/components/ui/Button";
import GlossyButton from "@/components/ui/GlossyButton";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   HOME STRATEGY (third section)
   ================================================================
   Black section framing a two-tone split panel: a purple "philosophy"
   quote on the left, a muted-paper "why it works" explainer on the
   right, then the same Book a Call / Free Strategy CTA pairing used
   in Overview. Static server-rendered JSX, no scroll/entrance
   animation — matches Overview's approach for non-hero sections.

   Kept flat-cornered and edge-aligned within the shared max-w-6xl
   container (Overview's own panel convention) rather than a rounded
   card, so the two content sections read as one consistent system.
   ================================================================ */

export default function Strategy() {
  return (
    <section className="bg-black-bg">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-20 sm:pt-24 sm:pb-24 md:pt-28 md:pb-28">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-white" />
          <span className="font-mono text-xs tracking-[0.14em] text-white/70 uppercase text-balance sm:text-sm">
            Establish Your Brand As A Market Leader
          </span>
        </div>

        {/* Headline */}
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-center text-[2rem] leading-[1.15] font-normal tracking-tight text-white sm:text-[42px] sm:leading-[1.1] sm:tracking-[-1.5px] md:text-[50px] md:leading-[52px] md:tracking-[-2px]">
          We drive your brand forward, automate strategies, and boost revenue.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-white/60 text-pretty sm:text-base">
          Our expertise lies in leveraging the latest technology to help you
          scale — whether that means generating more appointments or driving
          increased sales.
        </p>

        {/* Split panel */}
        <div className="mt-16 grid grid-cols-1 gap-3 sm:mt-20 md:mt-24 md:grid-cols-2">
          {/* Philosophy / quote */}
          <div className="relative flex flex-col justify-center overflow-hidden bg-purple-secondary px-8 py-16 sm:px-10 sm:py-20 md:px-12 md:py-24">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 left-4 font-serif text-[9rem] leading-none text-white/10 select-none sm:text-[11rem]"
            >
              &ldquo;
            </span>
            <div className="relative mx-auto max-w-sm text-center">
              <span className="mb-6 block font-mono text-xs tracking-[0.2em] text-white/50 uppercase">
                Our Philosophy
              </span>
              <p className="font-mono text-lg leading-loose tracking-wide text-white uppercase text-balance sm:text-xl">
                A powerful marketing strategy isn&rsquo;t just about promotions
                — it&rsquo;s about maximizing revenue opportunities through
                strategic outreach.
              </p>
            </div>
          </div>

          {/* Why it works */}
          <div className="flex flex-col justify-center bg-[#f3f4ee] px-8 py-16 sm:px-10 sm:py-20 md:px-12 md:py-24">
            <div className="mx-auto max-w-sm text-center">
              <span className="mb-6 block font-mono text-xs tracking-[0.2em] text-black-text/40 uppercase">
                Why It Works
              </span>
              <p className="font-mono text-sm leading-loose tracking-wide text-black-text/80 uppercase text-pretty sm:text-base">
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

        {/* CTAs */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:mt-16 sm:flex-row">
          <div className="w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="light" size="lg">
              Book a Call
            </Button>
          </div>
          <div className="w-full max-w-xs sm:w-auto">
            <GlossyButton to="/contact">Free Strategy</GlossyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
