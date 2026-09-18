import GeometricIcon from "@/components/ui/icons";
import Button from "@/components/ui/Button";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

interface ServiceHighlightsProps {
  eyebrow: string;
  headline: string;
  /**
   * Optional supporting copy shown beside the headline, on the
   * right. Takes the place of the CTA button below when provided.
   */
  paragraph?: string;
  items: {
    icon: number;
    title: string;
    description: string;
  }[];
  /** "pink" | "purple" — matches getServiceAccent(), same as the hero badge. */
  accent: ServiceAccent;
  /** Optional CTA rendered beside the headline — defaults to /contact. Ignored if `paragraph` is set. */
  cta?: { label: string; href: string };
  /**
   * Optional second heading + paragraph rendered directly above the
   * items grid — see ServiceSection["highlights"]["subheading"] in
   * lib/content/types.ts for when to use this.
   */
  subheading?: { title: string; paragraph: string };
}

/** Numbered capability rows; spacing is owned by ServiceSectionFrame. */
export default function ServiceHighlights({
  eyebrow,
  headline,
  paragraph,
  items,
  accent,
  cta = { label: "Get Custom SEO", href: "/contact" },
  subheading,
}: ServiceHighlightsProps) {
  const tone = SERVICE_ACCENT[accent];

  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        eyebrow={eyebrow}
        headline={headline}
        accent={accent}
        paragraph={paragraph}
        aside={
          paragraph ? undefined : (
            <Button to={cta.href} variant={tone.button} size="md">
              {cta.label}
            </Button>
          )
        }
      />

      {subheading && (
        <div className="mt-12 border-t border-white/18 pt-9 sm:mt-14">
          <h3 className="max-w-[24ch] text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.15] font-medium tracking-heading text-white-text">
            {subheading.title}
          </h3>
          <p className="body-copy mt-4 max-w-[64ch] leading-[1.62] text-content">
            {subheading.paragraph}
          </p>
        </div>
      )}

      <div className="relative mt-10 border-y border-white/25 sm:mt-14">
        <GridCorners accent={accent} />
        {items.map((item, index) => (
          <article
            key={item.title}
            data-stagger-hover
            className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-5 border-b border-dashed border-white/20 px-3 py-7 last:border-b-0 sm:grid-cols-[48px_minmax(0,1fr)] sm:px-5 lg:grid-cols-[60px_minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-x-8 lg:py-9"
          >
            <HorizontalStaggerRows />
            <span
              aria-hidden="true"
              className={`pt-1 font-mono text-xs ${tone.text}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex items-start gap-3">
              <h3 className="text-white-text">{item.title}</h3>
              <GeometricIcon
                index={item.icon}
                className={`mt-1 hidden h-5 w-5 shrink-0 sm:block ${tone.text}`}
              />
            </div>
            <p className="body-copy col-span-2 max-w-[64ch] text-content sm:col-span-1 sm:col-start-2 lg:col-start-auto">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
