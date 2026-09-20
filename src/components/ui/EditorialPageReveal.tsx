import type { ReactNode } from "react";
import GridCorners from "@/components/ui/GridCorners";
import PixelRevealImage from "@/components/home/PixelRevealImage";

interface EditorialPageRevealProps {
  id: string;
  page: string;
  code: string;
  image: string;
  imageAlt?: string;
  imageLabel: string;
  heading: ReactNode;
  actions?: ReactNode;
  compactHeading?: boolean;
}

export default function EditorialPageReveal({
  id,
  page,
  code,
  image,
  imageAlt = "",
  imageLabel,
  heading,
  actions,
  compactHeading = false,
}: EditorialPageRevealProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative z-0 min-h-[100svh] bg-black-bg text-white-text"
    >
      <div className="container-x mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col pt-[clamp(84px,11svh,132px)] pb-[clamp(26px,5svh,60px)] lg:pt-[clamp(100px,13svh,152px)]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-white/35 pb-3 font-mono text-[9px] leading-[1.2] uppercase sm:grid-cols-3 sm:pb-4 sm:text-xs">
          <span>TECHNICO_</span>
          <span className="sm:text-center">DIGITAL SOLUTIONS</span>
          <span className="col-span-2 text-right sm:col-span-1">{code}</span>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-x-[clamp(28px,5vw,92px)] gap-y-7 py-[clamp(28px,6svh,78px)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <figure className="relative aspect-[16/9] min-w-0 overflow-hidden border border-white/20 sm:aspect-[16/10] lg:aspect-[4/3]">
            <GridCorners />
            <PixelRevealImage
              src={image}
              alt={imageAlt}
              sizes="(min-width: 1024px) 52vw, 100vw"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-black-bg/86 p-4 font-mono text-[9px] tracking-[0.05em] text-content uppercase backdrop-blur-sm sm:p-5 sm:text-xs">
              <span>{imageLabel}</span>
              <span>{page} / 00</span>
            </figcaption>
          </figure>

          <div className="min-w-0 lg:pr-[clamp(0px,3vw,54px)]">
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.05em] text-content-muted uppercase sm:text-xs">
              <span aria-hidden="true" className="h-[7px] w-[7px] bg-accent" />
              / {page}
            </p>
            <h2
              id={`${id}-title`}
              className={`${compactHeading ? "text-[clamp(1.7rem,8vw,2.75rem)]" : "h2-section"} max-w-[21ch] leading-[1.08] font-medium tracking-heading text-balance`}
            >
              {heading}
            </h2>
            {actions && <div className="mt-7 sm:mt-9">{actions}</div>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/20 pt-4 font-mono text-[9px] tracking-[0.04em] text-content-muted uppercase sm:text-xs">
          <span>TECHNICO / DIGITAL MARKETING</span>
          <span>Stage 02 / 02</span>
        </div>
      </div>
    </section>
  );
}
