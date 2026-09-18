import type { ReactNode } from "react";
import { SERVICE_ACCENT, type ServiceAccent } from "./serviceAccent";

interface ServiceSectionHeaderProps {
  eyebrow?: string;
  headline: ReactNode;
  /** Supporting copy in the right column, under/beside the headline. */
  paragraph?: ReactNode;
  /** Rendered under `paragraph` in the right column (usually a CTA). */
  aside?: ReactNode;
  accent?: ServiceAccent;
  /** Widen the headline column when the right column is empty. */
  headlineWidth?: string;
  className?: string;
}

/**
 * ServiceSectionHeader
 * -----------------------------------------------------------------
 * The eyebrow / headline / supporting-copy row every redesigned
 * service-detail section opens with — the site's double-slash marker and a
 * mono label on the left, the headline beneath it, and the
 * supporting paragraph held in a narrower right column so the two
 * read as two measured columns rather than one centered stack.
 *
 * Extracted from ServicesProcess, which is where this row was first
 * built; the sizes are deliberately left to ServiceSectionFrame's
 * type rules so all sections share one scale.
 */
export default function ServiceSectionHeader({
  eyebrow,
  headline,
  paragraph,
  aside,
  accent = "purple",
  headlineWidth = "max-w-[21ch]",
  className = "",
}: ServiceSectionHeaderProps) {
  const tone = SERVICE_ACCENT[accent];
  const hasSideColumn = Boolean(paragraph || aside);

  return (
    <header
      className={`grid grid-cols-1 gap-7 ${
        hasSideColumn
          ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16"
          : ""
      } ${className}`}
    >
      <div>
        {eyebrow && (
          <p
            data-service-eyebrow
            className="flex items-start gap-3 font-mono text-xs tracking-[0.05em] text-content-muted uppercase"
          >
            <span aria-hidden="true" className={`shrink-0 ${tone.text}`}>
              {"//"}
            </span>
            <span>{eyebrow}</span>
          </p>
        )}
        <h2
          className={`${eyebrow ? "mt-5" : ""} ${headlineWidth} font-medium tracking-heading text-white-text`}
        >
          {headline}
        </h2>
      </div>

      {hasSideColumn && (
        <div className="lg:pt-7">
          {paragraph && (
            <p className="body-copy max-w-[54ch] leading-[1.62] text-content">
              {paragraph}
            </p>
          )}
          {aside && <div className={paragraph ? "mt-7" : ""}>{aside}</div>}
        </div>
      )}
    </header>
  );
}
