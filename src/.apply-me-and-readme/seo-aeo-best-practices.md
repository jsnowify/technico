# SEO + AEO — Next.js Best Practices

## Goal

Make content:

- crawlable
- understandable
- technically accessible
- trustworthy
- shareable
- useful for humans
- easy for answer engines to interpret

## Metadata

Use Next.js Metadata APIs.

Prefer route-level metadata where content differs.

Use:

```ts
export const metadata = {
  title: "Page title",
  description: "Useful description",
}
```

For dynamic pages:

```ts
export async function generateMetadata() {
  // derive metadata from route/data
}
```

Metadata APIs belong in Server Components.

## Title

Every indexable page should have a unique, descriptive title.

Avoid:

```text
Home | Company
Home | Company
Home | Company
```

Prefer titles describing the actual page and intent.

## Description

Write concise, human-readable descriptions that explain the page.

Do not keyword-stuff.

## Canonical URLs

Set canonical URLs when duplicate/alternate URLs are possible.

Make canonical logic deterministic.

## Open Graph

Use:

- `openGraph`
- `twitter`
- `opengraph-image`
- `twitter-image`

where appropriate.

Generate consistent brand/share previews.

## Robots

Provide `robots.txt` through the Next.js metadata file convention.

Do not accidentally block:

- production pages
- CSS/JS assets required for rendering
- important crawlers

Keep private/staging environments protected independently from SEO directives.

## Sitemap

Generate a sitemap for indexable URLs.

Do not include:

- private pages
- duplicate URLs
- search-result pages unless intentionally indexable
- parameter combinations that should not be indexed

## Structured data

Use JSON-LD where it accurately represents visible page content.

Potential schemas:

- Organization
- WebSite
- WebPage
- Article
- BreadcrumbList
- Product
- LocalBusiness
- FAQPage only when the page genuinely meets the requirements

Never fabricate structured data.

## Semantic content

Use:

- one clear primary heading
- descriptive headings
- meaningful links
- lists for lists
- tables for tabular data
- semantic articles/sections

## Internal linking

Important pages should be reachable through meaningful internal links.

Avoid vague anchors like:

```text
click here
```

Prefer descriptive anchors:

```text
Explore our SEO services
```

## AEO

Answer-engine-friendly pages should:

- answer the user's likely question directly
- define important terms
- use concise sections
- include evidence and first-hand expertise where applicable
- maintain consistent entity names
- avoid unsupported claims
- provide clear context around statistics

Do not write content solely to manipulate answer engines.

## E-E-A-T

Demonstrate:

- real experience
- expertise
- author/business identity
- credible sourcing
- transparent claims
- clear contact/about information where appropriate

## Images

Use meaningful `alt` text.

Do not stuff keywords into alt text.

Decorative imagery should generally have empty alt text.

## URLs

Prefer:

```text
/services/seo
```

over:

```text
/page?id=123&service=seo
```

Use stable, readable slugs.

## Pagination

Use canonical and crawl strategy appropriate to the content.

Avoid generating thousands of near-empty URLs.

## International SEO

If the application serves multiple languages/regions:

- use `hreflang` correctly
- provide localized metadata
- avoid automatic language redirects that prevent crawling
- keep URLs deterministic

## Search Console verification

After deployment, verify:

- sitemap
- canonical URLs
- indexing
- robots
- structured data
- Core Web Vitals
- mobile usability

## SEO performance

SEO is not separate from performance.

Poor:

- LCP
- INP
- CLS
- accessibility
- crawlability

can reduce the quality of the user experience even when metadata is perfect.
