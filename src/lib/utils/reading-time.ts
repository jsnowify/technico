import type { BlogBodyBlock, BlogContentBlock } from "@/lib/content/types";
import { stripInlineLinks } from "./inline-links";

/**
 * Words contributed by a single block, recursing into "accordion"
 * items' own content so a rich accordion sub-section counts toward
 * the total instead of just its title.
 */
function blockWords(block: BlogContentBlock | BlogBodyBlock): string[] {
  switch (block.type) {
    case "list":
      return block.items;
    case "image":
      return block.caption ? [block.caption] : [];
    case "table":
      return block.rows.flatMap((row) => [row.label, row.description]);
    case "columnTable":
      return block.columns.flatMap((column) => [column.title, ...column.items]);
    case "dataTable":
      return [...block.headers, ...block.rows.flat()];
    case "cta":
      return [block.title, block.description];
    case "faq":
      return block.items.flatMap((item) => [item.question, item.answer]);
    case "accordion":
      return block.items.flatMap((item) => [
        item.title,
        ...item.content.flatMap(blockWords),
      ]);
    default:
      return [block.text];
  }
}

/**
 * Estimated reading time for a blog post, derived from its content
 * blocks — no stored field to keep in sync, no extra dependency.
 * 200 wpm is the commonly-cited average adult silent-reading speed;
 * rounded up (never to 0) so a short post still reads "1 min read"
 * instead of "0 min read".
 */
export function estimateReadingTime(
  blocks: BlogContentBlock[],
  wordsPerMinute = 200,
): string {
  const wordCount = blocks
    .flatMap(blockWords)
    .map(stripInlineLinks)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}
