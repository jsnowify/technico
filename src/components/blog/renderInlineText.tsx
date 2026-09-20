import type { ReactNode } from "react";
import TransitionLink from "@/components/layout/TransitionLink";
import { parseInlineLinks } from "@/lib/utils/inline-links";

/* Same look as the inline links on /services (see serviceLinkedText.tsx). */
const LINK_CLASS =
  "underline underline-offset-4 transition-colors hover:text-purple-accent";

/**
 * Renders blog copy, turning `[label](href)` into a link that opts in to
 * the site's custom cursor (`data-cursor="circle"` — see GlobalCursor.tsx).
 *
 * - `https://…` links open in a new tab, like the other inline links.
 * - `/path` links are internal and navigate in the same tab.
 * - Text with no link syntax is returned untouched.
 */
export function renderInlineText(text: string): ReactNode {
  const parts = parseInlineLinks(text);
  if (parts.length === 1 && typeof parts[0] === "string") return text;

  return parts.map((part, i) => {
    if (typeof part === "string") return part;

    if (part.href.startsWith("/")) {
      return (
        <TransitionLink
          key={i}
          to={part.href}
          data-cursor="circle"
          data-cursor-label="Explore"
          className={LINK_CLASS}
        >
          {part.label}
        </TransitionLink>
      );
    }

    return (
      <a
        key={i}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="circle"
        data-cursor-label="Explore"
        className={LINK_CLASS}
      >
        {part.label}
      </a>
    );
  });
}
