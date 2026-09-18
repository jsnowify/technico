import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";
import StatCounter from "./StatCounter";

const STATS = [
  { value: "1.37M", label: "Employer businesses in Canada" },
  { value: "$21.1B", label: "Canadian digital advertising market" },
  { value: "+16%", label: "Digital ad market growth in 2025" },
  {
    value: "#1",
    label: "Search remains Canada’s largest digital ad category",
  },
] as const;

const MARKET_NOTES = [
  "A website and a few social media accounts can give your business an online presence, but that doesn’t automatically bring in customers, especially in a competitive market like Vancouver.",
  "That’s where the digital marketers at Technico Digital Solutions come in. We look at how customers find your business, what happens when they reach your website, and where potential leads drop off.",
  "SEO, paid ads, content, and social media are brought together to help local businesses generate qualified leads, ecommerce stores attract customers, and growing brands reach audiences across Canada.",
] as const;

export default function ServicesMarketStats() {
  return (
    <section className="bg-black-bg text-white">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Canadian businesses</span>
          </div>

          <h2 className="h2-section max-w-[20ch] leading-[1.08] font-medium tracking-heading text-white">
            Canadian businesses are competing in a digital-first market.
          </h2>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:mt-10 xl:grid-cols-4">
          {STATS.map((stat, index) => (
            <article
              key={stat.label}
              className="flex min-h-[230px] min-w-0 flex-col justify-between overflow-hidden bg-black-bg p-5 sm:min-h-[250px] sm:p-7 lg:p-8"
            >
              <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
                <span className="shrink-0">
                  S / {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-right">Canada</span>
              </div>

              <StatCounter
                value={stat.value}
                className="mt-9 max-w-full text-[clamp(2.75rem,5vw,5rem)] leading-none font-medium tracking-[-0.06em] text-purple-accent"
              />
              <p className="body-copy mt-5 max-w-[30ch] text-wrap leading-[1.4] tracking-[-0.02em] break-words text-content uppercase hyphens-auto">
                {stat.label}
              </p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-px border-x border-b border-white/15 bg-white/15 xl:grid-cols-3">
          {MARKET_NOTES.map((note, index) => (
            <article
              key={note}
              className="flex min-h-[240px] min-w-0 flex-col overflow-hidden bg-black-bg p-5 sm:p-7 lg:p-8 xl:min-h-[300px]"
            >
              <span className="font-mono text-[10px] tracking-[0.08em] text-purple-accent uppercase sm:text-xs">
                / Market note {String(index + 1).padStart(2, "0")}
              </span>
              <p className="body-copy mt-auto max-w-[62ch] pt-10 leading-[1.6] tracking-[-0.02em] break-words text-content hyphens-auto xl:pt-12">
                {note}
              </p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-px border-x border-b border-white/15 bg-white/15 xl:grid-cols-[minmax(0,1fr)_minmax(360px,auto)]">
          <div className="min-w-0 bg-black-bg p-5 sm:p-7 lg:p-8">
            <h3 className="h3-section max-w-[34ch] leading-[1.15] font-medium tracking-heading text-white">
              We go the extra mile to help you fulfill your business plans.
            </h3>
            <p className="body-copy mt-4 max-w-[62ch] leading-[1.6] text-content">
              Partner with us for targeted digital marketing strategies built
              around measurable, competitive results.
            </p>
          </div>

          <div className="flex min-w-0 flex-col items-start justify-center gap-5 overflow-hidden bg-black-bg p-5 sm:flex-row sm:flex-wrap sm:items-center sm:p-7 lg:p-8 xl:flex-nowrap">
            <Button to={SITE_PHONE_HREF} variant="purple-fill">
              Book a Call
            </Button>
            <Button to="/contact" variant="underline">
              Free Strategy
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
