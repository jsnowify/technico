import GeometricIcon from "@/components/ui/icons";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

interface ServiceResultsItem {
  icon?: number;
  title: string;
  description: string;
  /** Optional substring of `description` that renders as an external
   * link — same substring-match technique as ServiceInsights'
   * `renderWithLink`. */
  link?: { label: string; href: string };
}

interface ServiceResultsProps {
  headline: string;
  description: string;
  /** Optional substring of `description` that renders as an external
   * link. */
  descriptionLink?: { label: string; href: string };
  items: ServiceResultsItem[];
  accent?: ServiceAccent;
}

/** Renders `text` as plain text, with `link.label` (an exact
 * substring of `text`) swapped for an external link — same
 * substring-match approach as ServiceInsights.tsx's renderWithLink. */
function renderWithLink(text: string, link?: { label: string; href: string }) {
  if (!link) return text;

  const idx = text.indexOf(link.label);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white-text underline decoration-1 underline-offset-4 hover:text-content"
      >
        {link.label}
      </a>
      {text.slice(idx + link.label.length)}
    </>
  );
}

/**
 * ServiceResults
 * -----------------------------------------------------------------
 * "What this looks like by industry" grid. Rebuilt in the
 * service-detail system: the old rounded #1A1A1A panel and the
 * continuously-spinning icons are gone — these are outcomes a reader
 * scans, so the section is a flat hairline grid whose only motion
 * answers a hover.
 *
 * Each cell is labelled with the industry rather than a number:
 * these are alternatives to compare, not a sequence to follow.
 */
const DEFAULT_ICONS = [5, 9, 3, 10];

export default function ServiceResults({
  headline,
  description,
  descriptionLink,
  items,
  accent = "purple",
}: ServiceResultsProps) {
  const tone = SERVICE_ACCENT[accent];

  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        headline={headline}
        accent={accent}
        paragraph={renderWithLink(description, descriptionLink)}
      />

      <div className="relative mt-12 grid grid-cols-1 border-t border-l border-white/18 sm:mt-16 sm:grid-cols-2">
        <GridCorners accent={accent} />

        {items.map((item, index) => {
          const iconIndex =
            item.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length];

          return (
            <div
              key={`${item.title}-${index}`}
              data-stagger-hover
              className="group relative overflow-hidden border-r border-b border-white/18 p-5 sm:p-7 lg:p-9"
            >
              <HorizontalStaggerRows />

              <div className="relative flex items-center gap-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center ${tone.fill} text-black-bg`}
                >
                  <GeometricIcon index={iconIndex} className="h-5 w-5" />
                </span>
                <h3
                  className={`text-[clamp(1.35rem,2.1vw,1.9rem)] leading-[1.1] font-medium tracking-heading text-white-text`}
                >
                  {item.title}
                </h3>
              </div>

              <p className="body-copy relative mt-5 max-w-[52ch] leading-[1.62] text-content">
                {renderWithLink(item.description, item.link)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
