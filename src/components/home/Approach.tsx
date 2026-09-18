import { APPROACH_STEPS } from "@/lib/constants";
import PixelRevealImage from "./PixelRevealImage";

export default function Approach() {
  return (
    <section id="approach" className="bg-black-bg text-white">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Our approach</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:gap-12">
            <h2 className="h2-section max-w-[20ch] leading-[1.08] font-medium tracking-heading text-white">
              A clear process built to propel your business forward.
            </h2>
            <p className="body-copy max-w-[48ch] leading-[1.6] tracking-[-0.02em] text-content uppercase lg:pt-1">
              We give you a tailored digital marketing strategy to boost
              appointments, optimize ad performance, enhance SEO efforts, and
              streamline client management for maximum growth and
              profitability.
            </p>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-2 lg:mt-10">
          {APPROACH_STEPS.map((step, index) => {
            const number = String(index + 1).padStart(2, "0");

            return (
              <article
                key={step.step}
                className="flex min-w-0 flex-col bg-black-bg"
              >
                <figure className="relative aspect-[16/10] overflow-hidden bg-black-bg">
                  <PixelRevealImage
                    src={step.image}
                    alt={`Technico Digital Solutions — ${step.title}`}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-black/20"
                  />

                  <figcaption className="absolute inset-0 flex items-start justify-between gap-5 p-5 font-mono text-[10px] tracking-[0.08em] text-white uppercase sm:p-7 sm:text-xs lg:p-8">
                    <span>/ Process {number}</span>
                    <span className="text-right text-white/60">
                      {step.step} — {String(APPROACH_STEPS.length).padStart(2, "0")}
                    </span>
                  </figcaption>
                </figure>

                <div className="flex flex-1 flex-col p-5 sm:p-7 lg:p-8">
                  <div className="flex items-center justify-between gap-5 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] text-white/45 uppercase sm:text-xs">
                    <span>{number}</span>
                    <span>Technico process</span>
                  </div>

                  <h3 className="h3-section mt-6 max-w-[24ch] leading-[1.12] font-medium tracking-heading text-white uppercase">
                    {step.title}
                  </h3>

                  <p className="body-copy mt-5 max-w-[62ch] leading-[1.65] tracking-[-0.02em] text-content">
                    {step.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-px border-x border-b border-white/15 bg-white/15 sm:grid-cols-4">
          {APPROACH_STEPS.map((step, index) => (
            <div
              key={`timeline-${step.step}`}
              className="flex items-center gap-4 bg-black-bg px-5 py-4 font-mono text-[10px] tracking-[0.06em] text-white/50 uppercase sm:px-4 sm:text-[11px] lg:px-6"
            >
              <span className="text-purple-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{step.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
