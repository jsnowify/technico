import GeometricIcon from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

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
  accent: ServiceAccent;
  /** Optional — renders a photo panel under the paragraphs (left
   *  column) when provided. Omit to leave that column as copy only. */
  image?: { src: string; alt: string };
  /** Optional CTA rendered above the list — defaults to /contact,
   *  same convention as ServiceHighlights. */
  cta?: { label: string; href: string };
}

/** Copy and image alongside a connected list of deliverables. */
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
  const tone = SERVICE_ACCENT[accent];

  // Shortest text first, longest last — reads as a clean visual ramp
  // top-to-bottom instead of whatever order the content was authored
  // in. Sorted on a copy so the original `items` prop order stays
  // intact for callers.
  const sortedItems = [...items].sort((a, b) => a.text.length - b.text.length);

  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        eyebrow={eyebrow}
        headline={headline}
        accent={accent}
      />

      <div className="relative mt-12 grid grid-cols-1 border border-white/18 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GridCorners accent={accent} />

        {/* LEFT — prose, then the photo in its own cell. */}
        <div className="flex flex-col border-b border-white/18 lg:sticky lg:top-28 lg:self-start lg:border-r lg:border-b-0">
          <div className="p-5 sm:p-7 lg:p-9">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`body-copy max-w-[62ch] leading-[1.62] text-content ${
                  index > 0 ? "mt-5" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-7">
              <Button to={cta.href} variant={tone.button} size="md">
                {cta.label}
              </Button>
            </div>
          </div>

          {image && (
            <div className="relative mt-auto aspect-[16/10] overflow-hidden border-t border-white/18">
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
          )}
        </div>

        {/* RIGHT — list heading, then one connected column of rows. */}
        <div className="flex flex-col">
          <p className="border-b border-white/18 p-5 font-mono text-xs leading-[1.6] tracking-[0.05em] text-content-muted uppercase sm:p-7 lg:px-9">
            {listHeading}
          </p>

          <ul className="flex flex-1 flex-col">
            {sortedItems.map((item, index) => (
              <li
                key={index}
                data-stagger-hover
                className="group relative flex min-h-20 flex-1 items-center gap-4 overflow-hidden border-b border-white/18 p-5 last:border-b-0 sm:p-6 lg:px-9"
              >
                <HorizontalStaggerRows />
                <span
                  aria-hidden="true"
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center ${tone.fill} text-black-bg`}
                >
                  <GeometricIcon index={index} className="h-5 w-5" />
                </span>
                <p className={`body-copy relative leading-[1.55] text-content`}>
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
      <span className="text-white-text underline decoration-1 underline-offset-4">
        {emphasis}
      </span>
      {text.slice(idx + emphasis.length)}
    </>
  );
}
