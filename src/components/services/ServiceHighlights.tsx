import GeometricIcon from "@/components/ui/icons";
import Button from "@/components/ui/Button";

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
  accent: "pink" | "purple";
  /** Optional CTA rendered beside the headline — defaults to /contact. Ignored if `paragraph` is set. */
  cta?: { label: string; href: string };
  /**
   * Optional second heading + paragraph rendered directly above the
   * items grid — see ServiceSection["highlights"]["subheading"] in
   * lib/content/types.ts for when to use this.
   */
  subheading?: { title: string; paragraph: string };
  /**
   * "default" (normal top padding) or "tight-top" (no top padding —
   * for a highlights block stacked directly after another highlights
   * block). See the component doc comment above for why.
   */
  spacing?: "default" | "tight-top";
}

/**
 * ServiceHighlights
 * -----------------------------------------------------------------
 * 3-column grid of service highlight cards on the full
 * /services/[slug] page, right after the Cta. Each card is a flat
 * #1A1B1E panel with a small accent-colored icon badge (reusing the
 * shared GeometricIcon set), a title, and a short description —
 * matching the client's reference mock exactly (dark cards, no
 * borders, no hover states specified in the mock so none are
 * added).
 *
 * `spacing="tight-top"` drops this block's own top padding — for a
 * `highlights` block stacked directly after another `highlights`
 * block, whose bottom padding (pb-20 sm:pb-24 md:pb-28) already
 * supplies the gap. Without it, that padding stacks with this
 * block's own top padding, leaving a much bigger gap between the
 * two blocks than between any other pair of sections on the page.
 */
export default function ServiceHighlights({
  eyebrow,
  headline,
  paragraph,
  items,
  accent,
  cta = { label: "Get Custom SEO", href: "/contact" },
  subheading,
  spacing = "default",
}: ServiceHighlightsProps) {
  const accentBg = accent === "pink" ? "bg-pink-accent" : "bg-purple-accent";
  const topPaddingClass =
    spacing === "tight-top" ? "pt-0" : "pt-6 sm:pt-8 md:pt-10";

  return (
    <section
      className={`rounded-3xl bg-[#1A1A1A] px-10 pb-20 sm:pb-24 md:pb-28 ${topPaddingClass}`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-white ${accentBg}`}
        >
          <GeometricIcon index={10} className="h-3 w-3" />
        </span>
        <p className="text-base leading-none font-light tracking-wide text-white">
          {eyebrow}
        </p>
      </div>

      <div className="mt-6 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-2xl text-[44px] leading-[1.15] font-medium tracking-tight text-white">
          {headline}
        </h2>

        {paragraph ? (
          <p className="max-w-md text-lg leading-relaxed font-light text-white/60">
            {paragraph}
          </p>
        ) : (
          <Button to={cta.href} variant="purple">
            {cta.label}
          </Button>
        )}
      </div>

      {subheading && (
        <div className="mt-16">
          <h3 className="max-w-2xl text-[40px] leading-[1.15] font-medium tracking-tight text-white">
            {subheading.title}
          </h3>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed font-light text-white/60">
            {subheading.paragraph}
          </p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="border-b border-white/15 pb-8">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md ${accentBg}`}
              >
                <GeometricIcon
                  index={item.icon}
                  className="h-8 w-8 text-black"
                />
              </span>

              <h3 className="text-[32px] leading-tight font-medium text-white">
                {item.title}
              </h3>
            </div>

            <p className="mt-4 text-lg leading-relaxed font-light text-white/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
