import Image from "next/image";
import BlogTable, {
  BlogColumnTable,
  BlogDataTable,
} from "@/components/blog/BlogTable";
import BlogAccordion from "@/components/blog/BlogAccordion";
import Cta from "@/components/ui/CTA";
import type { BlogBodyBlock } from "@/lib/content/types";

/**
 * renderBlogBlock
 * -----------------------------------------------------------------
 * Shared switch that turns one BlogBodyBlock into JSX. Extracted out
 * of app/blog/[slug]/page.tsx so the same rendering rules apply both
 * to a post's top-level body AND to the nested `content` inside an
 * "accordion" block's items (see BlogAccordion.tsx) — an accordion
 * item can hold a paragraph, list, table, columnTable, dataTable,
 * image, cta, or even another accordion, and it renders exactly the
 * same as it would inline in the article.
 *
 * "faq" isn't part of BlogBodyBlock (see lib/content/types.ts) — that
 * one always renders full-width via ServiceFAQ, outside this shared
 * path, so it's never passed here.
 */
export function renderBlogBlock(block: BlogBodyBlock, key: number | string) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={key}
          id={block.id}
          className="scroll-mt-32 pt-8 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1] font-medium tracking-heading text-white-text"
        >
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3
          key={key}
          className="scroll-mt-32 pt-6 h3-section leading-tight font-medium tracking-heading text-white-text"
        >
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul
          key={key}
          className="body-copy list-disc space-y-2 pl-5 leading-[1.7] text-content"
        >
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "image":
      return (
        <figure key={key} className="!mt-8 space-y-3">
          <div className="relative aspect-video w-full overflow-hidden border border-white/20 bg-black-bg">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="font-mono text-xs text-content-muted">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "table":
      return (
        <div key={key} className="!mt-8">
          <BlogTable rows={block.rows} />
        </div>
      );
    case "columnTable":
      return (
        <div key={key} className="!mt-8">
          <BlogColumnTable columns={block.columns} />
        </div>
      );
    case "dataTable":
      return (
        <div key={key} className="!mt-8">
          <BlogDataTable headers={block.headers} rows={block.rows} />
        </div>
      );
    case "accordion":
      return (
        <div key={key} className="!mt-8">
          <BlogAccordion items={block.items} />
        </div>
      );
    case "cta":
      return (
        <Cta
          key={key}
          title={block.title}
          description={block.description}
          cta={block.cta}
          wide={block.wide}
          className="!px-0 !py-8"
        />
      );
    case "paragraph":
    default:
      return (
        <p key={key} className="body-copy leading-[1.75] text-content">
          {block.text}
        </p>
      );
  }
}
