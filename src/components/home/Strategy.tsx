import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";
import PixelRevealImage from "./PixelRevealImage";

const EXPERTISE_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/f_avif/q_auto:best/f_webp/q_auto:best/dpr_auto/f_avif/q_auto:best/home-imgs/technico_growth_mj93a5.png";

export default function Strategy() {
  return (
    <section className="bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Our expertise</span>
          </div>

          <h2 className="h2-section max-w-[22ch] leading-[1.08] font-medium tracking-heading text-white">
            We drive your brand forward, automate strategies, and boost revenue.
          </h2>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 lg:mt-10 lg:grid-cols-12">
          <figure className="relative aspect-square overflow-hidden bg-black-bg sm:aspect-[4/3] lg:col-span-5 lg:row-span-2 lg:aspect-square">
            <PixelRevealImage
              src={EXPERTISE_IMAGE}
              alt="Technology-led business growth through digital marketing strategy"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20"
            />

            <figcaption className="absolute inset-0 flex flex-col justify-between gap-6 p-5 font-mono text-[10px] tracking-[0.06em] text-white uppercase sm:p-7 sm:text-xs lg:p-8">
              <span>/ Establish your brand as a market leader</span>
              <span className="self-end text-white/55">Image / 02</span>
            </figcaption>
          </figure>

          <article className="bg-black-bg p-5 sm:p-7 lg:col-span-7 lg:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
              <span>01</span>
              <span>Technology + strategy</span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-8 lg:gap-12">
              <div>
                <h3 className="h3-section font-medium tracking-heading text-white">
                  Built around the way your business grows.
                </h3>
                <p className="body-copy mt-4 leading-[1.6] tracking-[-0.02em] text-content uppercase">
                  Our expertise lies in leveraging the latest technology to
                  assist you in scaling your businesses, whether through
                  generating more appointments or driving increased sales.
                </p>
              </div>

              <blockquote className="border-l border-purple-accent pl-5 sm:pl-6">
                <p className="body-copy leading-[1.6] tracking-[-0.02em] text-white uppercase">
                  &ldquo;A powerful marketing strategy is not just about
                  promotions; it&rsquo;s about maximizing revenue opportunities
                  through strategic outreach.&rdquo;
                </p>
              </blockquote>
            </div>
          </article>

          <article className="flex flex-col justify-between gap-8 bg-black-bg p-5 sm:p-7 lg:col-span-7 lg:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
              <span>02</span>
              <span>Market position</span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(150px,0.65fr)_minmax(0,1.35fr)] sm:gap-8 lg:gap-12">
              <h3 className="h3-section font-medium tracking-heading text-white">
                Recognition that compounds.
              </h3>
              <p className="body-copy leading-[1.65] tracking-[-0.02em] text-content">
                Successful marketing strategies are the key drivers of revenue
                acceleration. A digital campaign gets you the recognition you
                deserve and brings you new, high-intent customers. Technico
                Digital Solutions supports businesses of all sizes to grow and
                succeed. Our business solutions provide a holistic,
                multi-faceted approach that supports your online presence,
                driving growth, market position, and revenues.
              </p>
            </div>

            <div className="flex flex-col items-start gap-6 xl:flex-row xl:items-center">
              <Button to={SITE_PHONE_HREF} variant="purple-fill">
                Book a Call
              </Button>
              <Button to="/contact" variant="underline">
                Free Strategy
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
