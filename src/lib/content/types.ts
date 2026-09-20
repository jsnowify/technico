/**
 * BlogContentBlock
 * -----------------------------------------------------------------
 * One piece of a blog post's body. Was a flat `string[]` of
 * paragraphs; promoted to blocks so a post can have real `heading`
 * blocks — which is what the "CONTENT" table-of-contents panel
 * (BlogContents.tsx) reads to build its topic list and scroll-spy.
 * A post with no `heading` blocks just renders without a ToC panel.
 */
export type BlogContentBlock =
  | {
      type: "heading";
      /** Stable anchor id — used for both the `<h2 id>` and the ToC's `#` link. */
      id: string;
      text: string;
    }
  | {
      /**
       * Body copy. Supports inline links written as
       * `[anchor text](https://example.com)` — see
       * components/blog/renderInlineText.tsx.
       */
      type: "paragraph";
      text: string;
    }
  | {
      /** Bullet list. Each item supports the same inline-link syntax as "paragraph". */
      type: "list";
      items: string[];
    }
  | {
      /**
       * Sub-section heading (renders as h3) — for headings inside a
       * topic that don't get their own ToC entry, e.g. "Find Your
       * Target Audience" under the "How Can Digital Marketing
       * Strategies Help..." topic. Unlike "heading", this has no
       * `id` and isn't picked up by BlogContents' ToC panel.
       */
      type: "subheading";
      text: string;
    }
  | {
      /** Inline image within the article body — sits in the same
       * narrow column as the paragraphs around it, not full-bleed. */
      type: "image";
      src: string;
      alt: string;
      /** Optional small caption rendered under the image. */
      caption?: string;
    }
  | {
      /**
       * Reusable label/description table (see BlogTable.tsx) — e.g.
       * a pricing or feature breakdown. Optional block: posts with
       * nothing to tabulate simply omit it.
       */
      type: "table";
      rows: { label: string; description: string }[];
    }
  | {
      /**
       * Two-column bullet comparison (see BlogColumnTable in
       * BlogTable.tsx) — e.g. "Keyword Research" vs "Search Intent",
       * or "Internal Link" vs "External Link". Unlike "table" (flat
       * label/description rows), each column here gets its own title
       * and a bulleted list of points, side by side on desktop and
       * stacked on mobile.
       */
      type: "columnTable";
      columns: [
        { title: string; items: string[] },
        { title: string; items: string[] },
      ];
    }
  | {
      /**
       * Spreadsheet-style comparison with 3+ columns (see
       * BlogDataTable in BlogTable.tsx) — e.g. "Metric" / "Poor
       * Product Information" / "Better Product Information", each
       * with its own aligned row of values. Unlike "columnTable"
       * (two titled bullet lists), this renders as an actual table
       * with a header row and each `rows` entry as one data row —
       * every row must have the same length as `headers`. Use "--"
       * (or similar) for a cell with no value rather than an empty
       * string, so the table doesn't render a blank gap.
       */
      type: "dataTable";
      headers: string[];
      rows: string[][];
    }
  | {
      /** Renders the same reusable `Cta` used on /services (see
       * components/ui/CTA.tsx), sized to the article's own column
       * rather than full-bleed. */
      type: "cta";
      title: string;
      description: string;
      cta: { label: string; href: string };
      /** Widens the description column — see CTA.tsx's `wide` prop. */
      wide?: boolean;
    }
  | {
      /**
       * Renders the same shared `FAQ` component used on
       * /services/[slug] (see components/ui/FAQ.tsx) — full-width,
       * below the article's three-rail row rather than inside its
       * narrow column.
       */
      type: "faq";
      /** Two-line headline, e.g. ["Frequently Asked", "Questions"]. */
      headline: [string, string];
      cta?: { label: string; href: string };
      items: {
        question: string;
        answer: string;
        /** Substring of `answer` to underline. */
        emphasis?: string;
        /** Optional substring of `answer` that renders as an
         * external link instead — mutually exclusive with `emphasis`. */
        link?: { label: string; href: string };
      }[];
    }
  | {
      /**
       * Expandable stack of items inside the article's own narrow
       * column (see BlogAccordion.tsx) — same expand/collapse card
       * visual as the "faq" block's accordion (dark #1A1B1E panel,
       * title + circular arrow toggle that rotates open), copied
       * from ui/FAQ.tsx's FaqAccordionItem, but sized to this column
       * instead of that component's full-width two-column layout. Unlike
       * "faq" (plain question/answer text), each item's `content`
       * can hold any other body block — paragraph, list, table,
       * columnTable, dataTable, image, cta, even a nested
       * "accordion" — via the shared renderBlogBlock switch (see
       * components/blog/renderBlogBlock.tsx), so a single item can
       * carry a whole rich sub-section rather than one paragraph.
       */
      type: "accordion";
      items: {
        title: string;
        content: BlogBodyBlock[];
      }[];
    };

/**
 * Body blocks that can render inline in the article's narrow column —
 * every BlogContentBlock except "faq", which always renders full-width
 * below the three-rail row instead (see app/blog/[slug]/page.tsx).
 * Used both for a post's top-level `content` array and for what an
 * "accordion" item's `content` can hold.
 */
export type BlogBodyBlock = Exclude<BlogContentBlock, { type: "faq" }>;

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /**
   * Single primary topic this post belongs to — powers the category
   * tabs on the blog index (see BlogCategoryGrid.tsx), e.g.
   * "Digital Marketing" or "SEO". One category per post, unlike the
   * free-form `tags` below, so the index always has an unambiguous
   * tab to file a post under and an exact count per tab.
   */
  category: string;
  /** Structured body blocks; swap for markdown/MDX/CMS body later. */
  content: BlogContentBlock[];
  coverImage: string;
  publishedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  author: string;
  /**
   * Optional fine-print note rendered at the very bottom of the
   * article, below the FAQ section — e.g. a disclaimer that sample
   * figures/calculations in the post are illustrative only. Kept
   * separate from `content` because "faq" blocks already render
   * full-width after everything else in `content` (see
   * app/blog/[slug]/page.tsx); this is the one spot that renders
   * after that.
   */
  disclaimer?: string;
  tags?: string[];
};

/**
 * ServiceSection
 * -----------------------------------------------------------------
 * Every block a /services/[slug] page can be built from. A service
 * is just an ordered array of these (`Service.sections`) — there is
 * no fixed slot, count, or order across services. One service might
 * use `hero -> highlights -> faq`, another might repeat `cta` three
 * times with nothing else, another might skip sections entirely.
 * app/services/[slug]/page.tsx renders whatever is in the array, in
 * the order given, and renders nothing for block types a service
 * doesn't include.
 *
 * To add a new kind of block: add a variant here, add its render
 * case in page.tsx's switch, and consider whether it needs its own
 * component under components/services/.
 */
export type ServiceSection =
  | {
      type: "hero";
      /** Small mono label above the headline, e.g. "Search Engine Optimization". */
      eyebrow: string;
      /** Large headline — keep it title case to match ServicesHero.tsx. */
      headline: string;
      /** 1-2 supporting paragraphs shown alongside the headline. */
      paragraphs: {
        text: string;
        /** Optional inline link inside `text` — `label` must be an
         * exact substring of `text`; same substring-match technique
         * as ServiceIntroPanel's paragraph `link` field. */
        link?: { label: string; href: string };
      }[];
    }
  | {
      type: "cta";
      title: string;
      description: string;
      /** Optional inline link inside `description` — `label` must be an
       * exact substring of `description`. See components/ui/CTA.tsx. */
      descriptionLink?: { label: string; href: string };
      cta: { label: string; href: string };
      /** Wider two-column layout variant — see components/ui/CTA.tsx. */
      wide?: boolean;
      /**
       * Vertical padding around this banner, since that depends on
       * what's directly above/below it rather than the CTA's own
       * content: "standalone" (default) for a CTA with breathing
       * room on both sides, "compact" for one sandwiched tightly
       * between two other sections, "tight-bottom" for one right
       * after a section that already has bottom padding.
       */
      spacing?: "standalone" | "compact" | "tight-bottom";
    }
  | {
      type: "highlights";
      /** Small label above the headline, e.g. "Custom SEO". */
      eyebrow: string;
      headline: string;
      /**
       * Optional supporting copy shown beside the headline, on the
       * right. When provided, this takes the place of the default
       * CTA button in that row (see ServiceHighlights.tsx) — a
       * section shouldn't render both at once.
       */
      paragraph?: string;
      items: {
        /** Index into the shared GEOMETRIC_ICONS array in ui/icons.tsx. */
        icon: number;
        title: string;
        description: string;
        /** Optional inline link inside `description` — `label` must be an
         * exact substring of `description`. Renders as an external link. */
        link?: { label: string; href: string };
      }[];
      /** Optional CTA rendered beside the headline. Hidden when `paragraph` is
       * set, unless `cta` is passed explicitly — then both are shown. */
      cta?: { label: string; href: string };
      /**
       * Optional second heading + paragraph rendered directly above
       * the items grid, full-width and left-aligned (no eyebrow
       * badge of its own) — for content that has its own sub-intro
       * for the items distinct from the top eyebrow/headline/
       * paragraph, e.g. "Digital Marketing Services" introducing the
       * SEM/PPC/SMM cards underneath a broader "Our Digital
       * Marketing Services For Business Growth" headline above it.
       * Omit when the top headline/paragraph already directly
       * introduces the items (the common case).
       */
      subheading?: { title: string; paragraph: string };
      /**
       * Optional paragraph rendered below the items grid — for copy
       * that wraps up the whole list (e.g. "These channels can work
       * separately or as part of one media buying strategy...").
       */
      closingParagraph?: string;
    }
  | {
      type: "conversion";
      headline: string;
      description: string;
      image: { src: string; alt: string };
      features: {
        text: string;
        /** Substring of `text` to underline, e.g. "Conversion Rate Optimization". */
        emphasis?: string;
        /** Optional inline link inside `text` — `label` must be an exact
         * substring of `text`. Renders as an external link (new tab);
         * use instead of `emphasis`, not alongside it. */
        link?: { label: string; href: string };
      }[];
    }
  | {
      type: "insights";
      image: { src: string; alt: string };
      headline: string;
      intro: string;
      /** Optional inline link inside `intro` — `label` must be an
       * exact substring of `intro`; same substring-match technique
       * as ServiceIntroPanel's paragraph `link` field. Renders as an
       * external link (opens in a new tab) since these point to
       * outside research/sources, not internal site pages. */
      introLink?: { label: string; href: string };
      items: {
        title: string;
        description: string;
        /** Optional inline link inside this item's `description` —
         * same substring-match technique as `introLink` above. */
        link?: { label: string; href: string };
      }[];
      closingParagraph?: string;
    }
  | {
      /**
       * Two-column "content pillars" block: left side is a small
       * eyebrow + headline + intro paragraph, followed by a
       * quote/testimonial pull-quote paired with a photo; right side
       * is an accordion list of items (first one open by default,
       * same single-open behavior as the `insights` accordion).
       * Used by the "Content Creation That Keeps Your Brand Message
       * Consistent" section on creative-design-and-content.
       */
      type: "contentPillars";
      eyebrow: string;
      headline: string;
      paragraph: string;
      quote: string;
      quoteAttribution: string;
      image: { src: string; alt: string };
      items: { title: string; description: string }[];
    }
  | {
      /**
       * Colored 4-card grid: eyebrow + headline on the left, a
       * supporting intro paragraph on the right, then a row of four
       * alternating-color cards (light / pink / purple / dark, same
       * accent tokens as ServicesIndustriesStack) each with a
       * geometric icon, a "0X" index, and a title. Cards are a
       * single-open accordion — click to reveal that card's
       * description — same first-open-by-default, one-at-a-time
       * behavior as the `insights` accordion. An optional closing
       * line sits centered below the grid.
       */
      type: "pillarCards";
      eyebrow: string;
      headline: string;
      intro: string;
      items: { title: string; description: string }[];
      closingParagraph?: string;
    }
  | {
      type: "results";
      headline: string;
      description: string;
      /** Optional inline link inside `description` — `label` must be
       * an exact substring of `description`, same substring-match
       * technique as ServiceInsights' `introLink`. */
      descriptionLink?: { label: string; href: string };
      items: {
        icon?: number;
        title: string;
        description: string;
        /** Optional inline link inside this item's `description` —
         * same substring-match technique as `descriptionLink` above. */
        link?: { label: string; href: string };
      }[];
    }
  | {
      type: "growBusiness";
      headline: [string, string];
      intro: string;
      items: [
        { text: string; tag: string },
        { text: string; tag: string },
        { text: string; tag: string },
        { text: string; tag: string },
      ];
      closing: string;
    }
  | {
      /**
       * Renders the same TrustedBy marquee used on the homepage
       * (components/home/TrustedBy.tsx). No fields of its own — it's
       * a shared, self-contained component, not per-service content.
       */
      type: "trustedBy";
    }
  | {
      /**
       * Renders the "Technologies We Use To Build Your Website" logo
       * marquee (components/services/TechStack.tsx) — same shared,
       * self-contained pattern as `trustedBy` above, just backed by
       * TECH_STACK instead of TRUSTED_BY. No fields of its own.
       */
      type: "techStack";
      /** "technologies" (default, omit to use it) renders the usual
       * TECH_STACK tool-logo marquee with its "Technologies We Use
       * To Build Your Website" heading. "graphicDesignWork" renders
       * a separate strip of GRAPHIC_DESIGN_WORK client project
       * photos instead — kept as its own array/variant rather than
       * appended to TECH_STACK so the two never get mixed together
       * in one marquee. */
      variant?: "technologies" | "graphicDesignWork";
    }
  | {
      /**
       * Renders ServiceIntroPanel — eyebrow + headline in normal
       * flow, followed by a client-supplied notched photo (tall
       * right column + full-width bottom band) with paragraph copy
       * (optionally one inline link) overlaid in the shape's own
       * gap. See components/services/ServiceIntroPanel.tsx.
       */
      type: "introPanel";
      eyebrow: string;
      headline: string;
      paragraphs: {
        text: string;
        /** `label` must be an exact substring of `text` — that
         * substring renders as an underlined link. */
        link?: { label: string; href: string };
      }[];
      image: { src: string; alt: string };
    }
  | {
      /**
       * Full-bleed autoplay marquee CTA: a short phrase repeats
       * edge-to-edge and the whole row links to `cta.href`. A
       * magnetic circle (arrow icon) trails the cursor, replacing
       * it, while hovering the row. See
       * components/services/ServiceMarqueeCta.tsx.
       */
      type: "marqueeCta";
      /** Short repeating phrase, e.g. "Let's connect." Keep it brief — a long phrase makes the loop feel sluggish. */
      text: string;
      cta: { label: string; href: string };
    }
  | {
      /**
       * Two-column side-by-side comparison, e.g. "Web Design" vs
       * "Web Development". Headline + intro paragraph up top, the
       * two labelled columns underneath, closing paragraph below.
       * See components/services/ServiceComparison.tsx.
       */
      type: "comparison";
      headline: string;
      intro: string;
      /** Optional CTA rendered under the headline, left column. */
      cta?: { label: string; href: string };
      columns: [
        {
          title: string;
          rows: {
            label: string;
            value: string;
            /** Index into the shared GEOMETRIC_ICONS array in ui/icons.tsx. */
            icon: number;
          }[];
        },
        {
          title: string;
          rows: {
            label: string;
            value: string;
            /** Index into the shared GEOMETRIC_ICONS array in ui/icons.tsx. */
            icon: number;
          }[];
        },
      ];
      closing: string;
    }
  | {
      /**
       * Left column: eyebrow + headline + supporting paragraph(s),
       * same shape as "hero", followed by an optional notched photo
       * card (same clipPath technique as "featureCard" below) filling
       * the space under the paragraphs. Right column: a sub-heading
       * followed by a single-column bulleted list (small square
       * accent bullets, not the GeometricIcon badges used elsewhere).
       * See components/services/ServiceFeatureList.tsx.
       */
      type: "featuresSplit";
      eyebrow: string;
      headline: string;
      paragraphs: (
        | string
        | {
            text: string;
            /** Optional inline link inside `text` — `label` must be an
             * exact substring of `text`. Renders as an external link
             * (new tab). */
            link?: { label: string; href: string };
          }
      )[];
      listHeading: string;
      items: {
        text: string;
        /** Substring of `text` to underline. */
        emphasis?: string;
        /** Optional inline link inside `text` — `label` must be an exact
         * substring of `text`. Renders as an external link; use instead of
         * `emphasis`. */
        link?: { label: string; href: string };
      }[];
      /** Optional — omit to leave that space blank, as before. */
      image?: { src: string; alt: string };
    }
  | {
      /**
       * Renders right after "featuresSplit". Eyebrow + headline sit
       * above, full width. Below that: a notched, full-bleed photo
       * card (see the CARD_SVG path in
       * components/services/ServiceFeatureCard.tsx) with a frosted
       * glass panel holding a paragraph and a "let's connect" CTA
       * over the photo, paired with an icon-badge checklist column
       * (GeometricIcon squares + dividers) alongside it.
       */
      type: "featureCard";
      eyebrow: string;
      headline: string;
      /** Separate paragraphs with a blank line ("\n\n"). */
      paragraph: string;
      image: { src: string; alt: string };
      cta: { label: string; href: string };
      checklist: string[];
    }
  | {
      /**
       * Renders right after "featureCard". Eyebrow + headline + CTA
       * row (same floated-eyebrow style as "featuresSplit"), then a
       * single photo clipped to a client-supplied notched SVG path.
       * `shape` picks which one: "stairStep" (default, top-left
       * block + offset bottom-right block, gap top-right) or
       * "column" (tall left column + top-right extension, gap
       * bottom-right). A short statement paragraph fills the empty
       * gap that shape's own geometry leaves. See
       * components/services/ServiceImageStatement.tsx.
       */
      type: "imageStatement";
      eyebrow: string;
      headline: string;
      /** Omit for the no-button variant — `paragraph` then sits
       * beside the headline instead of overlaying the image. */
      cta?: { label: string; href: string };
      image: { src: string; alt: string };
      /** "stairStep" (default, gap top-right) or "column" (gap
       * bottom-right) — see ServiceImageStatement.tsx's SHAPES config. */
      shape?: "stairStep" | "column";
      /** With `cta`: keep brief — sized to the gap the shape leaves,
       * long copy overflows it. Without `cta`: runs beside the
       * headline instead, so it can be a bit longer. */
      paragraph: string;
      /** Optional bulleted list rendered after `paragraph` (and
       * before `closingParagraph`, if present) — e.g. "Grow With
       * Your Business"'s solar/e-commerce/service-business examples.
       * No-CTA variant only in practice; keep each item to a line or two. */
      bullets?: (
        | string
        | {
            text: string;
            /** Optional inline link inside `text` — `label` must be an
             * exact substring of `text`. Renders as an external link
             * (new tab). */
            link?: { label: string; href: string };
          }
      )[];
      /** Optional paragraph rendered after `bullets`, for copy that
       * continues past the list (e.g. a closing wrap-up sentence). */
      closingParagraph?: string;
    }
  | {
      type: "process";
      eyebrow: string;
      headline: string;
      /** Sits beside the headline — same header layout as
       * imageStatement's no-CTA variant. */
      paragraph: string;
      /** Rendered as a staircase of notched cards, alternating which
       * side the title lands on (index 0/2/4… title-left, 1/3/5…
       * title-right) — see components/services/ServicesProcess.tsx.
       * Works with any length, not just 4, though the shape/overlap
       * was only checked against a 4-step mockup so far. */
      steps: { title: string; description: string }[];
      /** "centered" (default, omit to use it) is the original
       * layout — used by Web Development. "edge" pushes each
       * step's description flush to the card's outer edge,
       * justified with a first-line indent — used by the Graphic
       * Design process only. This is per-section on purpose so
       * changing one process section's look never silently changes
       * another's (see ServicesProcess.tsx). */
      descriptionLayout?: "centered" | "edge";
    }
  | {
      type: "faq";
      /** Two-line headline, e.g. ["Frequently Asked", "Questions"]. */
      headline: [string, string];
      cta?: { label: string; href: string };
      items: {
        question: string;
        answer: string;
        /** Substring of `answer` to underline, e.g. "Search Engine Marketing". */
        emphasis?: string;
        /** Optional substring of `answer` that renders as an
         * external link instead — same substring-match technique
         * as ServiceInsights' item `link` field. Mutually exclusive
         * with `emphasis` in practice (an answer needs at most one
         * special substring), though nothing enforces that here. */
        link?: { label: string; href: string };
      }[];
    };

export type Service = {
  slug: string;
  title: string;
  /** Short line under the title, e.g. "Search Engine Optimization (SEO)". */
  subtitle?: string;
  /** Pull-quote line shown in the expanded accordion panel on /services. */
  quote?: string;
  shortDescription: string;
  description: string[];
  /** Deliverable/service chips shown in the expanded accordion panel. */
  tags?: string[];
  /** Optional step-by-step process, shown on the full /services/[slug] page. */
  process?: { step: string; description: string }[];
  /**
   * Ordered, per-service content blocks rendered on
   * /services/[slug]. Defaults to an empty array — a service with no
   * sections yet just renders a plain title/description fallback
   * header instead of an empty page. See ServiceSection above for
   * the available block types.
   */
  sections?: ServiceSection[];
};
