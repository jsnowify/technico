import Button from "@/components/ui/Button";
import PixelRevealImage from "@/components/home/PixelRevealImage";
import { SITE_PHONE_HREF } from "@/lib/constants";

const STRATEGY_ROWS = [
  {
    number: "01",
    text: "A Law Firm May Need Qualified Local Leads From High-Intent Searches, While A Solar Company May Need To Educate Homeowners Before Turning Interest Into Quote Requests.",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788935799/temporary-placeholder/Gemini_Generated_Image_3nu4uo3nu4uo3nu4_o2cn3b.jpg",
  },
  {
    number: "02",
    text: "Our Digital Team Works With Businesses Across Industries, Locations, And Stages Of Growth, Building Strategies That Focus On How Your Customers Search, Compare, And Take Action.",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788935799/temporary-placeholder/Gemini_Generated_Image_3nu4uo3nu4uo3nu4_o2cn3b.jpg",
  },
  {
    number: "03",
    text: "The Goal Is To Turn Your Digital Presence Into More Local Leads, Ecommerce Sales, Appointment Bookings, And Opportunities To Grow Into New Markets.",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788935799/temporary-placeholder/Gemini_Generated_Image_3nu4uo3nu4uo3nu4_o2cn3b.jpg",
  },
] as const;

export default function ServicesTailoredStrategy() {
  return (
    <section className="bg-black-bg text-white">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Tailored strategy</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:gap-12">
            <h2 className="h2-section max-w-[20ch] leading-[1.08] font-medium tracking-heading text-white">
              Digital marketing built around your business, market, and
              customers.
            </h2>
            <div>
              <p className="body-copy max-w-[44ch] leading-[1.6] tracking-[-0.02em] text-content uppercase">
                Your business doesn&rsquo;t need the same marketing strategy as
                everyone else. We deliver the right message to your ideal
                audience through a plan made for your goals.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                <Button to={SITE_PHONE_HREF} variant="purple-fill">
                  Book a Call
                </Button>
                <Button to="/contact" variant="underline">
                  Free Strategy
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 lg:mt-10 lg:grid-cols-12">
          {STRATEGY_ROWS.map((row, index) => (
            <article
              key={row.number}
              className={`flex min-w-0 flex-col bg-black-bg ${
                index === 0
                  ? "lg:col-span-7"
                  : index === 1
                    ? "lg:col-span-5"
                    : "lg:col-span-12 lg:grid lg:grid-cols-2"
              }`}
            >
              <figure
                className={`relative aspect-[16/10] overflow-hidden bg-black-bg ${
                  index === 2 ? "lg:aspect-auto lg:min-h-[380px]" : ""
                }`}
              >
                <PixelRevealImage
                  src={row.image}
                  alt="Technico digital marketing strategy planning session"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  revealId={`services-tailored-${row.number}`}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/15"
                />
                <figcaption className="absolute inset-x-0 top-0 flex items-center justify-between gap-5 p-5 font-mono text-[10px] tracking-[0.08em] text-white uppercase sm:p-7 sm:text-xs lg:p-8">
                  <span>/ Strategy {row.number}</span>
                  <span className="text-white/60">Built for your market</span>
                </figcaption>
              </figure>

              <div className="flex flex-1 flex-col p-5 sm:p-7 lg:p-8">
                <div className="flex items-center justify-between gap-5 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
                  <span>{row.number}</span>
                  <span>Tailored execution</span>
                </div>
                <p className="body-copy mt-auto max-w-[58ch] pt-10 leading-[1.65] tracking-[-0.02em] text-content uppercase">
                  {row.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
