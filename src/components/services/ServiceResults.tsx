import GeometricIcon from "@/components/ui/icons";

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
        className="text-white underline decoration-1 underline-offset-4 hover:text-white/80"
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
 * Dark rounded card (same #1A1A1A panel convention as
 * ServiceHighlights) pairing a headline + intro paragraph at the top
 * with a 2-column grid of short "results by industry" cards below —
 * each with a small mono "---" marker, an icon + title row, a short
 * description, and a bottom divider (same border-b treatment as
 * ServiceHighlights' own item list).
 *
 * The header row (headline | paragraph) and the items grid are two
 * independent grids rather than one shared layout — the items grid
 * runs the section's full width instead of being confined under the
 * paragraph column, matching the reference mock.
 *
 * ICONS: each item defaults to a different mark from the shared
 * GeometricIcon set (rather than repeating the same one four times)
 * so the grid doesn't read as visually flat — callers can still pass
 * their own `icon` index per item to override. A slow, staggered
 * continuous spin (pure CSS keyframes, no JS) keeps them feeling
 * alive without needing a client component.
 */
const DEFAULT_ICONS = [5, 9, 3, 10];

export default function ServiceResults({
  headline,
  description,
  descriptionLink,
  items,
}: ServiceResultsProps) {
  return (
    <section className="rounded-3xl bg-[#1A1A1A] px-10 pt-12 pb-20 sm:pt-14 sm:pb-24 md:pt-16 md:pb-28">
      {/* Scoped keyframes for the icon idle spin — see file header. */}
      <style>{`
        @keyframes serviceResultsIconSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr] md:gap-16 lg:grid-cols-[340px_1fr]">
        <h2 className="text-[44px] leading-[1.15] font-medium tracking-tight text-white">
          {headline}
        </h2>
        <p className="text-[18px] leading-relaxed font-light text-justify text-white/60">
          {renderWithLink(description, descriptionLink)}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2">
        {items.map((item, i) => {
          const iconIndex =
            item.icon ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length];

          return (
            <div key={i} className="border-b border-white/15 pb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-purple-accent">
                  <span
                    className="flex items-center justify-center"
                    style={{
                      animation: "serviceResultsIconSpin 3s linear infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    <GeometricIcon
                      index={iconIndex}
                      className="h-7 w-7 text-black"
                    />
                  </span>
                </span>
                <h3 className="text-[32px] leading-snug font-medium text-white">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-[18px] leading-relaxed font-light text-white/60">
                {renderWithLink(item.description, item.link)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
