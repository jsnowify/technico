import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";

/**
 * The black sheet beneath ServicesHero. app/services/page.tsx owns the stack,
 * exactly like app/page.tsx owns the homepage Hero + HeroReveal transition.
 * No ScrollTrigger, pinning, wheel listeners, or scroll animations here.
 */
export default function ServicesHeroReveal() {
  return (
    <section
      id="services-hero-reveal"
      aria-labelledby="services-hero-reveal-title"
      className="relative z-0 min-h-[100svh] bg-black-bg text-white-text"
    >
      <div className="container-x mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col pt-[clamp(84px,11svh,132px)] pb-[clamp(24px,4svh,56px)] lg:pt-[clamp(100px,13svh,152px)] lg:pb-[clamp(38px,6svh,72px)]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-white-text/40 pb-3 font-mono text-[9px] leading-[1.2] uppercase sm:grid-cols-3 sm:gap-x-5 sm:pb-4 sm:text-xs">
          <span>TECHNICO_</span>
          <span className="sm:text-center">DIGITAL SOLUTIONS</span>
          <span className="col-span-2 text-right sm:col-span-1">
            06 / CAPABILITIES
          </span>
        </div>

        <div className="flex flex-1 items-center py-[clamp(32px,7svh,92px)]">
          <div className="grid w-full grid-cols-1 gap-x-[clamp(28px,6vw,120px)] gap-y-7 lg:grid-cols-[minmax(140px,0.34fr)_minmax(0,1.66fr)] lg:gap-y-10">
            <div className="flex items-start justify-between gap-5 font-mono text-[10px] tracking-[0.06em] text-white-text/50 uppercase sm:text-xs lg:flex-col lg:justify-start lg:gap-5 lg:pt-2">
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-[7px] w-[7px] bg-purple-accent"
                />
                / What we do
              </span>
              <span className="text-white-text/30">01 — 06</span>
            </div>

            <h2
              id="services-hero-reveal-title"
              className="h2-section max-w-[21ch] leading-[1.08] font-medium tracking-heading text-balance"
            >
              Digital marketing services built to deliver real business growth.
            </h2>

            <div className="hidden lg:block" aria-hidden="true" />

            <div className="grid grid-cols-1 items-end gap-7 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 lg:gap-16">
              <p className="body-copy max-w-[54ch] leading-[1.6] tracking-[-0.02em] text-content uppercase">
                Connect search, advertising, content, social media, email, and
                web development through one strategy focused on measurable
                business outcomes.
              </p>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-5 md:justify-end">
                <Button to={SITE_PHONE_HREF} variant="purple-fill" size="md">
                  BOOK A CALL
                </Button>
                <Button to="/contact" variant="underline" size="md">
                  FREE STRATEGY
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.04em] text-white-text/45 uppercase sm:text-xs">
          <span>TECHNICO / DIGITAL MARKETING</span>
          <span className="text-right">BUILT FOR GROWTH_</span>
        </div>
      </div>
    </section>
  );
}
