/* ================================================================
   BLOG TABLE — reusable label/description breakdown
   ----------------------------------------------------------------
   Blog-specific UI: a simple two-column table used inside a post's
   body for things like a cost breakdown or a feature comparison
   (e.g. "Cost-Effective Solutions" / "ROI Measurement"). Optional
   block — a post with nothing to tabulate just omits the "table"
   block entirely (see BlogContentBlock in lib/content/types.ts).

   Same dark-card convention as the rest of the blog UI
   (rounded-[20px], bg-[#1A1B1E], text-white/60 body copy) so it
   reads as part of the same system as BlogContents/BlogShare rather
   than a one-off table style.
   ================================================================ */

interface BlogTableProps {
  rows: { label: string; description: string }[];
}

export default function BlogTable({ rows }: BlogTableProps) {
  return (
    <div className="overflow-hidden border border-white/20">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`grid grid-cols-1 gap-2 bg-black-bg p-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6 sm:p-6 ${
            i !== 0 ? "border-t border-white/20" : ""
          }`}
        >
          <span className="text-sm leading-snug font-medium text-white-text">
            {row.label}
          </span>
          <span className="text-sm leading-relaxed text-content">
            {row.description}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   BLOG COLUMN TABLE — two-column bulleted comparison
   ----------------------------------------------------------------
   Sibling variant to BlogTable above, for content that compares two
   things side by side (e.g. "Keyword Research" vs "Search Intent",
   "Internal Link" vs "External Link") rather than a flat list of
   label/description rows. Each column gets its own title and a
   bulleted list of points.

   Same dark-card convention as BlogTable (rounded-[20px], border
   border-white/10, bg-[#1A1B1E]) — stacks to one column on mobile,
   two columns with a divider from `sm` up.
   ================================================================ */

interface BlogColumnTableProps {
  columns: [
    { title: string; items: string[] },
    { title: string; items: string[] },
  ];
}

export function BlogColumnTable({ columns }: BlogColumnTableProps) {
  return (
    <div className="grid grid-cols-1 overflow-hidden border border-white/20 sm:grid-cols-2">
      {columns.map((column, i) => (
        <div
          key={column.title}
          className={`space-y-3 bg-black-bg p-5 sm:p-6 ${
            i !== 0 ? "border-t border-white/20 sm:border-t-0 sm:border-l" : ""
          }`}
        >
          <span className="block text-sm leading-snug font-medium text-white-text">
            {column.title}
          </span>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-content">
            {column.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   BLOG DATA TABLE — spreadsheet-style, 3+ column comparison
   ----------------------------------------------------------------
   Third sibling variant, for content that's a genuine table with a
   header row and aligned data rows (e.g. "Metric" / "Poor Product
   Information" / "Better Product Information") rather than a flat
   label/description list (BlogTable) or two titled bullet columns
   (BlogColumnTable). Renders as a real <table> so columns stay
   aligned; wrapped in overflow-x-auto so it scrolls instead of
   squeezing on narrow screens rather than reflowing like the other
   two variants.

   Same dark-card convention as its siblings (rounded-[20px], border
   border-white/10, bg-[#1A1B1E] rows).
   ================================================================ */

interface BlogDataTableProps {
  headers: string[];
  rows: string[][];
}

export function BlogDataTable({ headers, rows }: BlogDataTableProps) {
  return (
    <div className="overflow-x-auto border border-white/20">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-accent-surface">
            {headers.map((header) => (
              <th
                key={header}
                className="p-4 leading-snug font-medium text-white-text sm:p-5"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-white/20 bg-black-bg">
              {row.map((cell, j) => (
                <td key={j} className="p-4 leading-relaxed text-content sm:p-5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
