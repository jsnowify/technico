import GeometricIcon from "@/components/ui/icons";
import Button from "@/components/ui/Button";

interface ComparisonRow {
  label: string;
  value: string;
  /** Index into the shared GEOMETRIC_ICONS array in ui/icons.tsx. */
  icon: number;
}

interface ComparisonColumn {
  title: string;
  rows: ComparisonRow[];
}

interface ServiceComparisonProps {
  headline: string;
  intro: string;
  columns: [ComparisonColumn, ComparisonColumn];
  closing: string;
  /** "pink" | "purple" — matches getServiceAccent(), same as the hero badge. */
  accent: "pink" | "purple";
  /** Optional CTA rendered under the headline, left column. */
  cta?: { label: string; href: string };
}

/**
 * ServiceComparison
 * -----------------------------------------------------------------
 * Dark #1A1A1A panel for laying two related disciplines side by
 * side — e.g. "Web Design" vs "Web Development" on the
 * website-design-and-development service page.
 *
 * Header follows the same left-headline/right-paragraph split as the
 * "hero" block, with a purple CTA under the headline. The rest
 * reuses ServiceHighlights' exact type scale and icon treatment
 * (same badge size, same title/description sizes, same divider) so
 * this reads as the same block type as the SEO page's "Custom SEO"
 * section — only the content differs, split across two columns
 * instead of one flat grid.
 */
export default function ServiceComparison({
  headline,
  intro,
  columns,
  closing,
  accent,
  cta,
}: ServiceComparisonProps) {
  const accentBg = accent === "pink" ? "bg-pink-accent" : "bg-purple-accent";

  return (
    <section className="rounded-3xl bg-[#1A1A1A] px-10 pt-6 pb-20 sm:pt-8 sm:pb-24 md:pt-10 md:pb-28">
      {/* ============================================================
          HEADLINE (left) + INTRO (right)
      ============================================================ */}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="max-w-xl text-[32px] leading-[1.15] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
            {headline}
          </h2>

          {cta && (
            <div className="mt-8">
              <Button to={cta.href} variant="purple">
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        <p className="text-lg leading-relaxed font-light text-white/60 indent-6 sm:indent-8 md:pt-2">
          {intro}
        </p>
      </div>

      {/* ============================================================
          TWO-COLUMN SPLIT
      ============================================================ */}

      <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-14 sm:grid-cols-2">
        {columns.map((column, colIndex) => (
          <div key={colIndex}>
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-white ${accentBg}`}
              >
                <GeometricIcon index={10} className="h-3 w-3" />
              </span>
              <p className="text-[32px] leading-tight font-medium text-white">
                {column.title}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-10">
              {column.rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="border-b border-white/15 pb-8 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-md ${accentBg}`}
                    >
                      <GeometricIcon
                        index={row.icon}
                        className="h-8 w-8 text-black"
                      />
                    </span>

                    <h3 className="text-[32px] leading-tight font-medium text-white">
                      {row.label}
                    </h3>
                  </div>

                  <p className="mt-4 text-lg leading-relaxed font-light text-white/60">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          CLOSING
      ============================================================ */}

      <p className="mt-14 w-full text-justify indent-6 text-lg leading-relaxed font-light text-white/50 sm:mt-16 sm:indent-8">
        {closing}
      </p>
    </section>
  );
}
