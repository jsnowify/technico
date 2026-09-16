import GeometricIcon from "@/components/ui/icons";
import Button from "@/components/ui/Button";

interface FeatureListItem {
  text: string;
  /** Substring of `text` to render underlined — omit for a plain line. */
  emphasis?: string;
}

interface ServiceFeatureListProps {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  listHeading: string;
  items: FeatureListItem[];
  /** "pink" | "purple" — matches getServiceAccent(), same as the hero badge. */
  accent: "pink" | "purple";
  /** Optional — renders a notched photo card under the paragraphs
   *  (left column) when provided. Omit to leave that space blank,
   *  same as before this prop existed. */
  image?: { src: string; alt: string };
  /** Optional CTA rendered beside the headline — defaults to /contact,
   *  same convention as ServiceHighlights. */
  cta?: { label: string; href: string };
}

const IMAGE_VIEW_W = 716;
const IMAGE_VIEW_H = 682;

// Client-supplied shape (see the section's own SVG reference) — same
// notch-corner technique as ServiceFeatureCard/ChannelsJigsawCard:
// drawn at its native viewBox with preserveAspectRatio="none" against
// an aspect-716/682 wrapper so the notch scales uniformly instead of
// stretching.
const IMAGE_CARD_PATH =
  "M716 475C716 502.614 693.614 525 666 525H609C581.386 525 559 547.386 559 575V632C559 659.614 536.614 682 509 682H50C22.3857 682 0 659.614 0 632V50C0 22.3858 22.3858 0 50 0H666C693.614 0 716 22.3858 716 50V475Z";

/**
 * ServiceFeatureList
 * -----------------------------------------------------------------
 * Plain bg-black-bg section (no card panel — sits directly on the
 * page background, same as the "hero" block). Left column is the
 * eyebrow + headline, with the eyebrow floated left so the headline
 * text wraps around it on the first line only, then continues full
 * width on subsequent lines. Below the paragraphs, an optional
 * notched photo card fills what used to be blank space (same
 * clipPath technique as ServiceFeatureCard). Right column is a
 * sub-heading followed by a single-column list with the same
 * GeometricIcon-badge + divider treatment as ServiceFeatureCard's
 * checklist.
 */
export default function ServiceFeatureList({
  eyebrow,
  headline,
  paragraphs,
  listHeading,
  items,
  accent,
  image,
  cta = { label: "Let's connect", href: "/contact" },
}: ServiceFeatureListProps) {
  const accentBg = accent === "pink" ? "bg-pink-accent" : "bg-purple-accent";

  // Shortest text first, longest last — reads as a clean visual ramp
  // top-to-bottom instead of whatever order the content was authored
  // in. Sorted by character count (not word count — two items can
  // have the same number of words but very different lengths) on a
  // copy so the original `items` prop order (and its indices used
  // for icon selection below) stays intact.
  const sortedItems = [...items].sort((a, b) => a.text.length - b.text.length);

  return (
    <section className="bg-black-bg px-10 py-20 sm:py-24 md:py-28">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:grid-rows-[auto_auto] md:gap-x-16 md:gap-y-10">
        {/* ========================================================
            ROW 1, LEFT: EYEBROW (floated) + HEADLINE, WRAPPING
            AROUND IT. Right column has nothing in this row, so
            row 2 (paragraphs / list) sits level regardless of how
            many lines the headline wraps to.
        ======================================================== */}

        <div className="md:col-start-1 md:row-start-1">
          <span className="float-left mt-3 mr-4 flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-white/70" />
            <span className="text-sm leading-none font-light tracking-widest whitespace-nowrap text-white/70 uppercase">
              {eyebrow}
            </span>
          </span>

          <h2 className="text-[32px] leading-[1.15] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
            {headline}
          </h2>

          <div className="clear-both" />
        </div>

        {/* ========================================================
            ROW 2, LEFT: PARAGRAPHS
        ======================================================== */}

        <div className="mt-6 space-y-4 md:col-start-1 md:row-start-2 md:mt-0">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed font-light text-justify indent-6 text-white/50 sm:indent-8"
            >
              {paragraph}
            </p>
          ))}

          {/* Notched photo card — fills the leftover space below the
              paragraphs (previously blank). Same clipPath + aspect
              wrapper technique as ServiceFeatureCard/ChannelsJigsawCard,
              at the shape supplied for this section. Optional: omit
              `image` to leave this column exactly as it was before. */}
          {image && (
            <div className="relative aspect-716/682 w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${IMAGE_VIEW_W} ${IMAGE_VIEW_H}`}
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <clipPath id="service-feature-list-image-clip">
                    <path d={IMAGE_CARD_PATH} />
                  </clipPath>
                </defs>
                <g clipPath="url(#service-feature-list-image-clip)">
                  <path d={IMAGE_CARD_PATH} fill="#1A1B1E" />
                  <foreignObject
                    x="0"
                    y="0"
                    width={IMAGE_VIEW_W}
                    height={IMAGE_VIEW_H}
                  >
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
            </div>
          )}
        </div>

        {/* ========================================================
            ROW 2, RIGHT: LIST HEADING + BULLETED LIST — same grid
            row as the paragraphs above, so it lines up with them
            instead of the headline.
        ======================================================== */}

        <div className="md:col-start-2 md:row-start-2">
          <Button to={cta.href} variant="purple">
            {cta.label}
          </Button>

          <h3 className="mt-6 text-lg leading-relaxed font-light text-white/50">
            {listHeading}
          </h3>

          {/* Icon badge + divider per row — same GeometricIcon /
              rounded-md / border-b treatment as ServiceFeatureCard's
              checklist, instead of the small checkmark-in-a-square
              this list used before. `accentBg` still drives the badge
              color (pink/purple) so this stays in sync with whichever
              accent the page passed in. */}
          <ul className="mt-4 flex flex-col gap-8">
            {sortedItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-4 border-b border-white/15 pb-8 last:border-b-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${accentBg}`}
                >
                  <GeometricIcon index={i} className="h-5 w-5 text-black" />
                </span>
                <p className="pt-2 text-lg leading-relaxed font-normal text-white/80">
                  {renderItemText(item)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function renderItemText({ text, emphasis }: FeatureListItem) {
  if (!emphasis) return text;

  const idx = text.indexOf(emphasis);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <span className="text-white underline decoration-1 underline-offset-4">
        {emphasis}
      </span>
      {text.slice(idx + emphasis.length)}
    </>
  );
}
