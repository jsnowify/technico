/**
 * Inline links inside blog copy
 * -----------------------------------------------------------------
 * Blog `paragraph` text and `list` items can carry hyperlinks written
 * as `[anchor text](https://example.com)` right inside the string, so
 * the sentence stays readable in lib/content/blog.ts and the link
 * sits exactly where it appears in the article.
 *
 * This file is the pure (no React) half: it only splits/strips the
 * syntax. components/blog/renderInlineText.tsx turns the parts into
 * real <a> elements.
 */

export type InlineLinkPart = string | { label: string; href: string };

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Splits `text` into plain-string chunks and `{ label, href }` links, in order. */
export function parseInlineLinks(text: string): InlineLinkPart[] {
  const parts: InlineLinkPart[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_LINK)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push({ label: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** `text` with every `[label](url)` reduced to just `label` — for word counts etc. */
export function stripInlineLinks(text: string): string {
  return text.replace(INLINE_LINK, "$1");
}
