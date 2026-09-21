import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";
import PixelRevealImage from "./PixelRevealImage";

const HERO_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789970965/home-imgs/technico-hero.png";

/**
 * Underlying black sheet. The homepage owns its stacking / scroll behavior;
 * this component adds no sticky element or scroll-triggered animation.
 */
export default function HeroReveal() {
  return (
    <section
      id="hero-reveal"
      aria-labelledby="hero-reveal-title"
      className="relative z-10 min-h-[100svh] bg-black-bg text-white-text"
    >
      <div className="hero-reveal-shell container-x mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col pt-[clamp(84px,11svh,132px)] pb-[clamp(24px,4svh,56px)] lg:pt-[clamp(100px,13svh,152px)] lg:pb-[clamp(38px,6svh,72px)]">
        <div className="hero-reveal-meta grid grid-cols-2 gap-x-4 gap-y-3 border-b border-white-text/40 pb-3 font-mono text-[9px] leading-[1.2] uppercase sm:grid-cols-3 sm:gap-x-5 sm:pb-4 sm:text-xs">
          <span>TECHNICO_</span>
          <span className="sm:text-center">DIGITAL MARKETING AGENCY</span>
          <span className="col-span-2 text-right sm:col-span-1">
            PROFIT OVER TRAFFIC_
          </span>
        </div>

        <div className="hero-reveal-content grid flex-1 grid-cols-1 items-center gap-x-[clamp(24px,4vw,82px)] gap-y-6 pt-[clamp(24px,4svh,54px)] sm:gap-y-9 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] lg:gap-y-12 lg:pt-[clamp(42px,7svh,90px)]">
          <div className="min-w-0">
            <h1
              id="hero-reveal-title"
              className="h2-section max-w-[19ch] leading-[1.08] font-medium tracking-heading text-balance"
            >
              Digital marketing agency that prioritize your profit, not just
              traffic.
            </h1>

            <p className="hero-reveal-copy body-copy mt-4 max-w-[48ch] leading-[1.55] tracking-[-0.02em] text-content uppercase sm:mt-5 lg:mt-6 lg:max-w-[43ch]">
              Achieve business success through effective brand development.
              Explore new digital marketing opportunities with Technico Digital
              Solutions.
            </p>

            <div className="hero-reveal-actions mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-8 lg:mt-9 lg:gap-x-9">
              <Button to={SITE_PHONE_HREF} variant="purple-fill" size="md">
                BOOK A CALL
              </Button>
              <Button to="/contact" variant="underline" size="md">
                FREE STRATEGY
              </Button>
            </div>
          </div>

          {/* Class name kept: globals.css hides this column on short phones. */}
          <div className="hero-reveal-signal-column min-w-0 lg:self-center">
            <figure className="relative aspect-[16/9] min-w-0 overflow-hidden border border-white-text/20 sm:aspect-[16/10] lg:aspect-[4/3] lg:max-h-[56svh]">
              <PixelRevealImage
                src={HERO_IMAGE}
                alt="Technico Digital Solutions, a digital marketing agency that prioritizes profit over traffic"
                sizes="(min-width: 1024px) 42vw, 100vw"
                revealId="home-hero-reveal"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-black-bg/86 p-4 font-mono text-[9px] tracking-[0.05em] text-content-muted uppercase sm:text-[10px]">
                <span>{"// Technico Digital Solutions"}</span>
                <span>Home / 00</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
