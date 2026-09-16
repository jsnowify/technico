import Button from "@/components/ui/Button";

interface ServiceImageStatementProps {
  eyebrow: string;
  headline: string;
  /** CTA rendered beside the headline, e.g. { label: "Let's Connect", href: "/contact" }.
   * Optional — omit it for the no-button variant (see doc comment
   * below), where `paragraph` moves up next to the headline instead
   * of overlaying the image. */
  cta?: { label: string; href: string };
  image: { src: string; alt: string };
  /** Which client-supplied notched SVG path clips the photo.
   * "stairStep" (default): top-left block + offset bottom-right
   * block, gap at the top-right — used by "Propel Your Business" /
   * "Slow Page Speed" / "Poor Technical SEO" / "Grow With Your
   * Business".
   * "column": tall left column + top-right extension, gap at the
   * bottom-right — near-square (560x528) aspect, so it runs very
   * tall on full-bleed section widths. Currently unused; keep only
   * if a narrower/constrained layout calls for it. */
  shape?: "stairStep" | "column";
  /** With `cta` set: short statement that fills the empty gap the
   * chosen `shape` leaves — keep this brief (~2-3 lines), long copy
   * will overflow the band it's positioned in.
   * Without `cta`: sits beside the headline instead, so it can run
   * a little longer. */
  paragraph: string;
  /** Optional "•"-prefixed list rendered after `paragraph` (and
   * before `closingParagraph`, if given) — e.g. "Grow With Your
   * Business"'s solar / e-commerce / service-business examples. */
  bullets?: string[];
  /** Optional paragraph rendered after `bullets`, for copy that
   * continues past the list. */
  closingParagraph?: string;
}

/**
 * ServiceImageStatement
 * -----------------------------------------------------------------
 * Eyebrow + headline + CTA row (same floated-eyebrow / flex-row-CTA
 * treatment as ServiceFeatureList's headline), followed by a single
 * photo clipped to a client-supplied "stair-step" SVG path: a
 * top-left block and a bottom-right block, offset and slightly
 * overlapping so they read as one connected shape rather than two
 * separate images.
 *
 * `shape` picks between two client-supplied notched paths (see the
 * SHAPES config below) — each leaves its own empty rectangle for
 * `paragraph` to sit in, so the overlay's position/size classes are
 * defined per-shape rather than hardcoded once.
 *
 * `cta` is optional: omit it for a plain statement block (used for
 * the stacked "Slow Page Speed" / "Poor Technical SEO" blocks) — no
 * button renders beside the headline. The overlay `paragraph` itself
 * also anchors differently depending on `cta`: with a CTA it's
 * nested inside the image's own box, at the shape's own gap.
 * Without a CTA it's a sibling of the header row inside the shared
 * outer wrapper instead, so its non-cta anchor edge lines up with
 * the *wrapper's* edge rather than just the image's — giving the
 * longer no-CTA paragraph the header's height + gap as extra room
 * before it reaches the notch, instead of starting only at the
 * image's own edge.
 *
 * `bullets` (optional): a "•"-prefixed list rendered after
 * `paragraph`, same font treatment as the paragraph text — used by
 * "Grow With Your Business" (stairStep shape) for its solar /
 * e-commerce / service-business examples. `closingParagraph` then
 * renders in the shape's second gap when one is defined (see
 * `closingOverlayClass` below), separate from this paragraph/bullets
 * block.
 */
const SHAPES: Record<
  "stairStep" | "column",
  {
    viewW: number;
    viewH: number;
    path: string;
    aspect: string;
    ctaOverlayClass: string;
    noCtaOverlayClass: string;
    /** Optional: a second empty gap distinct from the primary
     * paragraph/bullets one — e.g. stairStep's bottom-left area,
     * the black space under the top-left image block. When set,
     * `closingParagraph` renders here instead of stacking inline
     * after `bullets` in the main overlay. */
    closingOverlayClass?: string;
  }
> = {
  /** Top-left block + offset bottom-right block. Gap at the
   * top-right, roughly x:[706,1200] y:[0,230] of the 1200x474
   * viewBox (right ~41% of width, top ~48.5% of height). */
  stairStep: {
    viewW: 1200,
    viewH: 474,
    path: "M1200 454C1200 465.046 1191.05 474 1180 474H663C651.954 474 643 465.046 643 454V250C643 238.954 634.046 230 623 230H20C8.95431 230 0 221.046 0 210V20C0 8.9543 8.95431 0 20 0H666C677.046 0 686 8.95431 686 20V210C686 221.046 694.954 230 706 230H1180C1191.05 230 1200 238.954 1200 250V454Z",
    aspect: "aspect-[1200/474]",
    // Anchored from the top: matches the image's own top / the notch gap.
    ctaOverlayClass:
      "absolute top-0 right-0 left-[59%] flex h-[48.5%] items-start pr-2 sm:pr-4",
    // No-CTA: top:0 lines up with the header row's top (i.e. the headline).
    noCtaOverlayClass: "absolute top-0 right-0 left-[59%] pr-2 sm:pr-4",
    // Second gap: bottom-left, under the top-left image block —
    // roughly x:[0,643] y:[230,454] of the 1200x474 viewBox (left
    // ~54% of width, bottom ~48% of height). Padded on all sides so
    // the text doesn't hug the notch edge above or the bottom-right
    // image block that starts right after this box.
    closingOverlayClass:
      "absolute top-[48.5%] bottom-0 left-0 w-[54%] p-4 sm:p-6 md:p-8",
  },
  /** Tall left column + top-right extension. Gap at the
   * bottom-right, roughly x:[275,560] y:[308,528] of the 560x528
   * viewBox (right ~51% of width, bottom ~41.7% of height). */
  column: {
    viewW: 560,
    viewH: 528,
    path: "M560 268C560 290.091 542.091 308 520 308H315C292.909 308 275 325.909 275 348V488C275 510.091 257.091 528 235 528H40C17.9086 528 0 510.091 0 488V40C0 17.9086 17.9086 0 40 0H520C542.091 0 560 17.9086 560 40V268Z",
    aspect: "aspect-[560/528]",
    // Anchored from the bottom: matches the image's own bottom / the notch gap.
    ctaOverlayClass:
      "absolute right-0 bottom-0 left-[49%] flex h-[41.7%] items-start pr-2 sm:pr-4",
    // No-CTA: bottom:0 lines up with the image's own bottom (wrapper edge).
    noCtaOverlayClass: "absolute right-0 bottom-0 left-[49%] pr-2 sm:pr-4",
  },
} as const;

export default function ServiceImageStatement({
  eyebrow,
  headline,
  cta,
  image,
  paragraph,
  bullets,
  closingParagraph,
  shape = "stairStep",
}: ServiceImageStatementProps) {
  const {
    viewW,
    viewH,
    path,
    aspect,
    ctaOverlayClass,
    noCtaOverlayClass,
    closingOverlayClass,
  } = SHAPES[shape];

  return (
    <section className="bg-black-bg px-10 py-20 sm:py-24 md:py-28">
      <div className="relative">
        {/* ==========================================================
            EYEBROW + HEADLINE + CTA (CTA variant only)
        ========================================================== */}

        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
          {/* max-w kept at the ~58% column width both shapes' headline
              row uses, so the headline wraps inside a sensible column
              instead of stretching across the CTA's empty space and
              wrapping wherever that happens to land. No-CTA variant:
              still capped the same way so the headline doesn't run
              the full section width just because nothing's next to it. */}
          <div className="max-w-full lg:max-w-[58%]">
            <span className="float-left mt-3 mr-4 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 bg-white/70"
              />
              <span className="text-sm leading-none font-light tracking-widest whitespace-nowrap text-white/70 uppercase">
                {eyebrow}
              </span>
            </span>

            <h2 className="text-[32px] leading-[1.15] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
              {headline}
            </h2>

            <div className="clear-both" />
          </div>

          {cta && (
            <Button to={cta.href} variant="purple">
              {cta.label}
            </Button>
          )}
        </div>

        {/* ==========================================================
            NOTCHED PHOTO (+ overlaid statement, CTA variant only —
            anchored edge here matches the shape's own notch gap)
        ========================================================== */}

        <div className={`relative mt-8 w-full sm:mt-10 ${aspect}`}>
          <svg
            viewBox={`0 0 ${viewW} ${viewH}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <clipPath id="service-image-statement-clip">
                <path d={path} />
              </clipPath>
            </defs>
            <g clipPath="url(#service-image-statement-clip)">
              <path d={path} fill="#1A1B1E" />
              <foreignObject x="0" y="0" width={viewW} height={viewH}>
                <div
                  // @ts-expect-error -- xmlns required for the foreignObject's
                  // root element to render as HTML rather than SVG.
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {/* Plain <img>, not next/image — same reasoning as
                      ServiceFeatureCard: the placeholder host isn't in
                      next.config.js's images.remotePatterns yet. Swap
                      to next/image once the real photo is hosted
                      somewhere already whitelisted. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </foreignObject>
            </g>
          </svg>

          {cta && (
            <div className={ctaOverlayClass}>
              {/* Inner flex-col wrapper: `ctaOverlayClass` itself is a
                  flex row (for vertical centering via items-start), so
                  paragraph/bullets need their own column container
                  instead of laying out side-by-side. */}
              <div className="flex flex-col gap-3">
                <p className="text-justify text-sm leading-relaxed font-light text-white/70 sm:text-base md:text-lg">
                  {paragraph}
                </p>
                {bullets && bullets.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {bullets.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-relaxed font-light text-white/70 sm:text-base md:text-lg"
                      >
                        <span aria-hidden="true">•</span>
                        <span className="text-justify">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {/* No dedicated second gap for this shape (e.g.
                    "column") — fall back to stacking closingParagraph
                    right here instead of losing it. */}
                {closingParagraph && !closingOverlayClass && (
                  <p className="text-justify text-sm leading-relaxed font-light text-white/70 sm:text-base md:text-lg">
                    {closingParagraph}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* closingParagraph, second gap: only rendered here when the
              shape defines one (stairStep's bottom-left area, under
              the top-left image block) — positioned in the image's
              own coordinate space, same as ctaOverlayClass, since the
              gap is measured against the viewBox. */}
          {closingParagraph && closingOverlayClass && (
            <div className={closingOverlayClass}>
              <p className="text-justify text-sm leading-relaxed font-light text-white/70 sm:text-base md:text-lg">
                {closingParagraph}
              </p>
            </div>
          )}
        </div>

        {/* No-CTA variant: paragraph (+ bullets) is a sibling of the
            header row (not nested in the image box above), so it
            lines up with the wrapper's edge instead of just the
            image's, giving it room to grow through the header + gap
            before the notch. */}
        {!cta && (
          <div className={`${noCtaOverlayClass} flex flex-col gap-4`}>
            <p className="text-justify text-sm leading-relaxed font-light text-white/70 sm:text-base md:text-lg">
              {paragraph}
            </p>
            {bullets && bullets.length > 0 && (
              <ul className="flex flex-col gap-2">
                {bullets.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed font-light text-white/70 sm:text-base md:text-lg"
                  >
                    <span aria-hidden="true">•</span>
                    <span className="text-justify">{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {/* No dedicated second gap for this shape — fall back to
                stacking closingParagraph right here. */}
            {closingParagraph && !closingOverlayClass && (
              <p className="text-justify text-sm leading-relaxed font-light text-white/70 sm:text-base md:text-lg">
                {closingParagraph}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
