# Technico Site Rebuild — SEO Considerations

## Main Consideration

The main SEO risk is **not** TypeScript, React, Tailwind, GSAP, or Lenis by themselves — it is:

- How the site is rendered
- How much it depends on JavaScript
- Whether existing URLs are preserved
- Whether migration/technical SEO requirements are built in **before launch**

**Bottom line:** Important pages need to be server-side rendered / static-rendered so their full content is crawlable. This requires strong Core Web Vitals, preserved URLs/redirects, correct metadata, and a pre-launch SEO QA process.

---

## SEO Considerations for the Rebuild

| # | Area | In Simple Terms | SEO Requirement | Priority |
|---|------|------------------|------------------|----------|
| 1 | Page rendering | Can Google see the important text immediately, or does it have to wait for JavaScript? | Important SEO pages should be server-rendered or pre-rendered. | **Critical** |
| 2 | React architecture | React is fine, but a pure client-side React site is more dependent on JavaScript. | Prefer Next.js + React + TypeScript, or another setup that supports SSR/SSG/pre-rendering. | **Critical** |
| 3 | Existing URLs | Pages that already rank can lose value if their URLs change. | Keep current URLs wherever possible. | **Critical** |
| 4 | Redirects | If an old URL changes, Google needs to know the new destination. | Create a complete 301 redirect map before launch. | **Critical** |
| 5 | Titles & meta descriptions | These tell search engines what each page is about. | Every important page should have unique, editable SEO metadata. | **Critical** |
| 6 | H1/H2 structure | Headings help users and search engines understand page structure. | Use one clear H1 and a logical H2/H3 hierarchy. | High |
| 7 | Content availability | Animations should not control whether important content exists. | Core text should already exist in the HTML/DOM before animation. | **Critical** |
| 8 | Internal links | Google discovers and understands pages by following links. | Use real `<a href>` links in navigation and content. | **Critical** |
| 9 | Mobile experience | Google primarily evaluates the mobile version of the site. | Keep the same key content and links available on mobile. | **Critical** |
| 10 | Page speed | React, animation, and smooth-scroll libraries can add JavaScript weight. | Control bundle size and monitor LCP, INP, and CLS. | High |
| 11 | Images | Large images can slow pages and need context. | Compress images, set dimensions, use alt text and modern formats (e.g., WebP). | High |
| 12 | XML sitemap | Helps search engines discover canonical pages. | Automatically generate and maintain `/sitemap.xml`. | High |
| 13 | Robots.txt | Controls crawler access. | Make sure production robots rules allow the right pages to be crawled. | High |
| 14 | Canonical tags | Helps prevent duplicate URL problems. | Each indexable page should output the correct canonical URL. | High |
| 15 | 404 handling | A missing page should actually behave like a missing page. | Invalid URLs should return a true 404 HTTP status. | High |
| 16 | Accessibility | Good semantic structure helps both users and crawlers. | Use semantic HTML, keyboard-friendly navigation, labels, and alt attributes. | Medium |
| 17 | Staging environment | The unfinished Vercel site should not appear in search results. | Keep staging noindex and remove that restriction at launch. | **Critical** |
| 18 | Analytics & tracking | The rebuild should not break measurement. | Preserve GA4, GTM, Search Console, and conversion tracking. | High |
| 19 | Post-launch monitoring | Migration issues can appear after launch. | Monitor Search Console, rankings, 404s, redirects, indexing, and Core Web Vitals. | **Critical** |

---

## GSAP and Lenis Considerations

The key principle: these libraries should **enhance** the site rather than be **required** for the site to work or for Google to understand the content.

### Recommended Implementation

- Page loads → H1, text, and links already exist → GSAP animates those existing elements.
- Lenis adds smooth scrolling, but native scrolling, anchor links, and keyboard navigation still work.

---

## URL Considerations

**Recommended migration sheet fields:**

`Current URL → New URL → Status → Title → H1 → Canonical → Indexability → Redirect required`

| Scenario | Outcome |
|----------|---------|
| ✅ Ideal | Current ranking URL → same URL on the rebuilt site |
| ⚠️ Acceptable when necessary | Current ranking URL → 301 redirect → relevant new URL |
| ❌ Avoid | Ranking URL → 404, or many unrelated old pages → homepage |

---

## Guiding Questions & Best Practices

**1. Are important pages server-rendered/pre-rendered, or completely client-side rendered?**
Important SEO pages should be server-rendered or statically pre-rendered, not dependent entirely on client-side JavaScript. Google should receive the main content, headings, navigation, and links in the initial HTML. For a marketing/business site, SSG is often ideal for relatively static pages, while SSR can be used where content is more dynamic.

**2. If JavaScript fails or is delayed, is the important page content still present in the source HTML?**
Yes. The primary content should already be present in the HTML, including the H1, body copy, service information, important internal links, and navigation. JavaScript should enhance the experience, not be required for Google to understand the page.

**3. Will every page have editable SEO titles and meta descriptions?**
Yes. Every indexable page should have a unique, editable SEO title and meta description. These should not be hard-coded globally or automatically reused across multiple pages. SEO should be able to update them without requiring a developer every time.

**4. Can SEO control canonical tags and robots directives per page?**
Yes. SEO should be able to control canonical URLs and directives such as index, noindex, follow, and nofollow at the page level when necessary. Canonicals should normally be self-referencing unless there is a specific duplicate-content reason to point elsewhere.

**5. Will the site automatically generate XML sitemaps?**
Yes. The sitemap should be generated automatically and update when pages are added, removed, or changed. It should contain only canonical, indexable, 200-status URLs and should not contain redirects, 404s, staging URLs, or noindex pages.

**6. Will navigation use standard crawlable links?**
Yes. Navigation and important internal links should use normal HTML links such as `<a href="/services/">`, not JavaScript-only onClick actions. Google should be able to follow links without having to simulate complicated user interactions.

**7. How are 404 pages and HTTP status codes handled?**
A nonexistent URL should return an actual 404 HTTP status code, not a 200 OK page that simply says "Page Not Found." Valid pages should return 200, permanent redirects should return 301, and temporary redirects should only use 302/307 when genuinely temporary. This is especially important with React applications, because poorly configured SPAs sometimes return 200 for every URL.

**8. How will 301 redirects be managed?**
There should be a centralized, manageable redirect system. Before launch, SEO should provide or approve a mapping of Old URL → New URL. Redirects should go directly to the most relevant replacement page, avoid redirect chains, and never send large numbers of unrelated URLs to the homepage.

**9. Are GSAP animations applied to existing content rather than being responsible for loading that content?**
Yes. The H1, text, links, images, and other important elements should exist before GSAP runs. GSAP should animate existing content, not be responsible for injecting or making essential content available. In simple terms: **content first, animation second.**

**10. How are JavaScript bundle size and Core Web Vitals being controlled?**
The build should actively manage how much JavaScript is shipped to the browser. This means code splitting, lazy-loading non-critical functionality, avoiding unnecessary libraries, loading animation code only where needed, and testing Core Web Vitals throughout development. Particular attention should be paid to LCP, INP, and CLS — not just a generic Lighthouse score.

**11. Will images be optimized automatically?**
Ideally, yes. Images should be resized appropriately, compressed, served in modern formats such as WebP or AVIF where appropriate, and responsive versions should be delivered based on screen size. Below-the-fold images should normally be lazy-loaded, while the main hero/LCP image should not be unnecessarily delayed. Width and height should also be defined to reduce layout shift.

**12. Will staging remain noindex until launch?**
Yes, but ideally staging should be protected even more strongly than just noindex. Authentication, IP restriction, or another access-control method is preferable because it prevents staging URLs from being crawled in the first place. If noindex is used, it must be removed from the production site before or at launch. This should be part of the launch checklist.

**13. How will existing URLs be preserved or redirected during migration?**
Existing URLs that already perform well should stay the same whenever there is no compelling reason to change them. If a URL must change, the old URL should receive a direct 301 redirect to the closest equivalent new page. Before launch, SEO should compare the current site's URL inventory against the new site's URL structure.

**14. Can SEO crawl and test the final staging build before the production launch?**
Absolutely. This should be a launch requirement, not an optional step. SEO should crawl the finished staging site before production and verify rendering, status codes, titles, descriptions, H1s, canonicals, robots directives, sitemap inclusion, internal links, redirects, structured data, images, mobile behavior, and performance. **Critical issues should be resolved before DNS or production deployment.**
