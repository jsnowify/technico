import Button from "@/components/ui/Button";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

interface ServiceImageStatementProps {
  eyebrow: string;
  headline: string;
  /** CTA rendered beside the headline, e.g. { label: "Let's Connect", href: "/contact" }. */
  cta?: { label: string; href: string };
  image: { src: string; alt: string };
  /**
   * Layout of the panel below the headline. Both shapes render the
   * same bordered split; they differ in which side the photograph
   * takes and how tall it runs:
   * "stairStep" (default) — wide landscape photo above a full-width
   * statement, for the broad "here's the problem" blocks.
   * "column" — photo held in a tall left column beside the
   * statement, for blocks that sit next to other panels.
   *
   * The prop name is kept from the previous SVG-clipped version so
   * lib/content/services.ts needs no changes.
   */
  shape?: "stairStep" | "column";
  /** The statement itself. Can now run as long as the content needs
   * — it is no longer positioned inside a fixed notch. */
  paragraph: string;
  /** Optional list rendered after `paragraph` — e.g. "Grow With Your
   * Business"'s solar / e-commerce / service-business examples. */
  bullets?: string[];
  /** Optional paragraph rendered after `bullets`. */
  closingParagraph?: string;
  accent?: ServiceAccent;
}

/**
 * ServiceImageStatement
 * -----------------------------------------------------------------
 * A single claim, stated plainly, with one photograph carrying it.
 *
 * Rebuilt in the service-detail system. The previous version clipped
 * the photo to a client-supplied stair-step SVG path and absolutely
 * positioned the copy into the empty rectangle the path left behind
 * — which meant the copy had a hard length ceiling (noted in the old
 * prop docs as "keep this brief, long copy will overflow") and the
 * notch geometry had to be re-measured for every shape. Here the
 * photo and the statement are cells of the same hairline panel, so
 * the copy sets its own height and nothing can overflow.
 *
 * The section stays quiet on purpose: no hover sweep, no per-row
 * accents. It is the one block on the page that is a statement
 * rather than a list, and it should read that way.
 */
export default function ServiceImageStatement({
  eyebrow,
  headline,
  cta,
  image,
  paragraph,
  bullets,
  closingParagraph,
  shape = "stairStep",
  accent = "purple",
}: ServiceImageStatementProps) {
  const tone = SERVICE_ACCENT[accent];
  const isColumn = shape === "column";

  const statement = (
    <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-9">
      <p className="body-copy max-w-[62ch] leading-[1.62] text-content">
        {paragraph}
      </p>

      {bullets && bullets.length > 0 && (
        <ul className="mt-6 flex flex-col border-t border-white/18">
          {bullets.map((item, index) => (
            <li
              key={index}
              className="body-copy flex items-start gap-4 border-b border-white/18 py-4 leading-[1.6] text-content"
            >
              <span
                aria-hidden="true"
                className={`mt-2 h-px w-6 shrink-0 ${tone.rule}`}
              />
              <span className="max-w-[58ch]">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {closingParagraph && (
        <p className="body-copy mt-6 max-w-[62ch] leading-[1.62] text-content">
          {closingParagraph}
        </p>
      )}
    </div>
  );

  const photo = (
    <div
      className={`relative overflow-hidden ${
        isColumn
          ? "aspect-[4/3] border-b border-white/18 sm:aspect-[16/10] lg:aspect-auto lg:min-h-[460px] lg:border-r lg:border-b-0"
          : "aspect-[16/9] border-b border-white/18 sm:aspect-[21/9]"
      }`}
    >
      {/* Some service placeholders use remote hosts that are not in
          next/image's allowlist, so this remains a plain image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute top-4 left-4 bg-black-bg px-3 py-2 font-mono text-[10px] tracking-[0.06em] text-content uppercase sm:top-6 sm:left-6 sm:text-xs">
        <span aria-hidden="true">{"// "}</span>
        {eyebrow}
      </span>
    </div>
  );

  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        eyebrow={eyebrow}
        headline={headline}
        accent={accent}
        headlineWidth="max-w-[24ch]"
        aside={
          cta ? (
            <Button to={cta.href} variant={tone.button} size="md">
              {cta.label}
            </Button>
          ) : undefined
        }
      />

      <div
        className={`relative mt-12 grid grid-cols-1 border border-white/18 sm:mt-16 ${
          isColumn ? "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]" : ""
        }`}
      >
        <GridCorners accent={accent} />
        {photo}
        {statement}
      </div>
    </section>
  );
}
