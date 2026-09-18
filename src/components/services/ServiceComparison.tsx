import GeometricIcon from "@/components/ui/icons";
import type { CSSProperties } from "react";
import styles from "./ServiceComparison.module.css";
import Button from "@/components/ui/Button";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

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
  accent: ServiceAccent;
  /** Optional CTA rendered under the intro copy. */
  cta?: { label: string; href: string };
}

/**
 * ServiceComparison
 * -----------------------------------------------------------------
 * Two related disciplines set side by side — e.g. "Web Design" vs
 * "Web Development" on the website-design-and-development page.
 *
 * Rebuilt in the service-detail system: one hairline grid split down
 * the middle, each half headed by its discipline and stacked with
 * its own rows, so the divider between the two columns is what does
 * the comparing. The two halves share row borders, which keeps the
 * eye travelling across the split instead of down one side.
 *
 * On phones the split collapses to one column and the discipline
 * headings become the section dividers.
 */
export default function ServiceComparison({
  headline,
  intro,
  columns,
  closing,
  accent,
  cta,
}: ServiceComparisonProps) {
  const tone = SERVICE_ACCENT[accent];

  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        headline={headline}
        accent={accent}
        paragraph={intro}
        aside={
          cta ? (
            <Button to={cta.href} variant={tone.button} size="md">
              {cta.label}
            </Button>
          ) : undefined
        }
      />

      <div
        className={styles.grid}
        style={
          {
            "--comparison-rows":
              Math.max(...columns.map((column) => column.rows.length)) + 1,
          } as CSSProperties
        }
      >
        <GridCorners accent={accent} />

        {columns.map((column, columnIndex) => (
          <div key={`${column.title}-${columnIndex}`} className={styles.column}>
            <div className="flex items-baseline justify-between gap-4 border-b border-white/18 p-5 sm:p-7 lg:px-9">
              <h3 className="text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.05] font-medium tracking-heading text-white-text">
                {column.title}
              </h3>
              <span
                className={`font-mono text-xs tracking-[0.06em] ${tone.text}`}
              >
                {String.fromCharCode(65 + columnIndex)}
              </span>
            </div>

            <ul className={styles.rows}>
              {column.rows.map((row, rowIndex) => (
                <li
                  key={`${row.label}-${rowIndex}`}
                  data-stagger-hover
                  className="group relative flex-1 overflow-hidden border-b border-white/18 p-5 last:border-b-0 sm:p-7 lg:px-9"
                >
                  <HorizontalStaggerRows />

                  <div className="relative flex items-center gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center ${tone.fill} text-black-bg`}
                    >
                      <GeometricIcon index={row.icon} className="h-5 w-5" />
                    </span>
                    <h4
                      className={`text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.1] font-medium tracking-heading text-white-text`}
                    >
                      {row.label}
                    </h4>
                  </div>

                  <p className="body-copy relative mt-4 max-w-[52ch] leading-[1.62] text-content">
                    {row.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="body-copy mt-9 max-w-[76ch] leading-[1.62] text-content">
        {closing}
      </p>
    </section>
  );
}
