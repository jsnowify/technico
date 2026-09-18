import Link from "next/link";
import PixelRevealImage from "@/components/home/PixelRevealImage";

const MARKET_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/q_auto:best/v1789032026/temporary-placeholder/Gemini_Generated_Image_3f5bts3f5bts3f5b_qjxyw0.avif";

const CHANNELS = [
  {
    label: "SEO",
    href: "/services/search-engine-optimization",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236387/services-overview/technico-digital-solutions-seo_ngn3yp.png",
  },
  {
    label: "Paid Ads",
    href: "/services/advertising",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236388/services-overview/technico-digital-solutions-paid-ads_ekfejq.png",
  },
  {
    label: "Content",
    href: "/services/creative-design-and-content",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236387/services-overview/technico-digital-solutions-content_d2jxv6.png",
  },
  {
    label: "Social Media",
    href: "/services/social-media-management",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236388/services-overview/technico-digital-solutions-social-media_ip5tiw.png",
  },
  {
    label: "Email",
    href: "/services/email-marketing",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788236387/services-overview/technico-digital-solutions-email_b7uvnh.png",
  },
] as const;

export default function ServicesMarketOverview() {
  return (
    <section className="bg-black-bg text-white">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Market overview</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-12">
            <h2 className="h2-section max-w-[21ch] leading-[1.08] font-medium tracking-heading text-white">
              Turn digital attention into qualified leads and measurable growth.
            </h2>

            <p className="body-copy max-w-[54ch] leading-[1.65] tracking-[-0.02em] text-content">
              Technico Digital Solutions provides digital marketing services for
              businesses seeking to improve search visibility, reach qualified
              audiences, generate leads, and convert more online interactions
              into customers. We support healthcare, legal, automotive,
              renewable energy, construction, electrical, home improvement, and
              other local service industries through campaigns built around
              measurable business goals.
            </p>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 lg:mt-10 lg:grid-cols-12">
          <figure className="relative min-h-[320px] overflow-hidden bg-black-bg sm:aspect-video lg:col-span-7 lg:aspect-auto lg:min-h-[600px]">
            <PixelRevealImage
              src={MARKET_IMAGE}
              alt="A coordinated digital marketing strategy built for measurable growth"
              sizes="(min-width: 1024px) 58vw, 100vw"
              revealId="services-market-overview"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/75 via-black/5 to-black/20"
            />

            <figcaption className="absolute inset-0 flex flex-col justify-between gap-6 p-5 font-mono text-[10px] tracking-[0.07em] text-white uppercase sm:p-7 sm:text-xs lg:p-8">
              <span>/ Growth infrastructure</span>
              <span className="self-end text-white/60">Market / 01</span>
            </figcaption>
          </figure>

          <article className="flex flex-col justify-between gap-12 bg-black-bg p-5 sm:p-7 lg:col-span-5 lg:p-8">
            <div>
              <div className="flex items-center justify-between gap-5 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
                <span>01</span>
                <span>Connected strategy</span>
              </div>

              <h3 className="h3-section mt-6 max-w-[22ch] leading-[1.15] font-medium tracking-heading text-white">
                One growth system, not a collection of disconnected channels.
              </h3>
            </div>

            <div>
              <p className="body-copy leading-[1.65] tracking-[-0.02em] text-content">
                You don&rsquo;t have to rely on just one marketing channel to
                grow your business. We look at where your customers are
                searching, what they see when they land on your website, and how
                every channel can work together.
              </p>
              <p className="body-copy mt-5 leading-[1.65] tracking-[-0.02em] text-content">
                SEO, paid advertising, web design, content, social media, and
                email are coordinated to bring in leads and turn more of those
                leads into customers.
              </p>
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-px border-x border-b border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
          {CHANNELS.map((channel, index) => (
            <Link
              key={channel.label}
              href={channel.href}
              aria-label={`Explore ${channel.label} services`}
              data-cursor="highlight"
              className={`group relative aspect-[4/3] min-h-[220px] overflow-hidden bg-black-bg sm:aspect-square ${
                index === CHANNELS.length - 1
                  ? "sm:col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <PixelRevealImage
                src={channel.image}
                alt=""
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                revealId={`services-market-channel-${index}`}
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-black/20 transition-colors duration-300 group-hover:from-purple-accent/90 group-hover:via-purple-accent/20"
              />

              <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-6">
                <span className="font-mono text-[10px] tracking-[0.08em] text-white/60 uppercase sm:text-xs">
                  / {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex items-end justify-between gap-4">
                  <h3 className="text-[clamp(1.15rem,2vw,1.6rem)] leading-[1.05] font-medium tracking-heading text-white uppercase">
                    {channel.label}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="text-lg text-white transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                  >
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
