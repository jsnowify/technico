/**
 * Search-indexing policy shared by root/page metadata, robots.txt and sitemap.
 *
 * Deployment configuration (set BEFORE the build and redeploy after changing):
 *   - Live Vercel production: VERCEL_ENV=production, SITE_ENV unset/production.
 *   - Vercel preview: VERCEL_ENV=preview -> always noindex, even if SITE_ENV=production.
 *   - Dedicated staging: SITE_ENV=staging -> always noindex, even if
 *     VERCEL_ENV=production (e.g. a separate Vercel staging project).
 *   - Other production hosts: explicitly set SITE_ENV=production.
 *   - Local `next dev`: indexable for Lighthouse, unless explicitly staging.
 *   - technico-test.vercel.app and other *.vercel.app aliases: request-time
 *     X-Robots-Tag noindex in src/proxy.ts, even on a production deployment.
 *     If staging is a separate project, set SITE_ENV=staging as well to make
 *     HTML robots metadata and sitemap match; never apply that setting to a
 *     deployment also serving the live custom domain.
 *
 * Treat unrecognized deployment labels as non-production. The robots.txt route
 * intentionally allows crawling of staging so bots can SEE its HTML noindex;
 * staging is not private unless protected separately by authentication.
 */
const vercelEnv = (process.env.VERCEL_ENV ?? "").trim().toLowerCase();
const siteEnv = (process.env.SITE_ENV ?? process.env.NEXT_PUBLIC_SITE_ENV ?? "")
  .trim()
  .toLowerCase();

/** Only the real, publicly indexable production deployment. */
export const IS_PRODUCTION: boolean = vercelEnv
  ? vercelEnv === "production" && (siteEnv === "" || siteEnv === "production")
  : siteEnv === "production";

/**
 * Local Lighthouse checks should not fail on noindex; this DOES NOT make
 * staging, Vercel previews, or unknown deployed environments indexable.
 * robots.txt and sitemap.ts use IS_PRODUCTION, not this localhost exception.
 */
export const IS_INDEXABLE: boolean =
  IS_PRODUCTION ||
  (!vercelEnv &&
    process.env.NODE_ENV === "development" &&
    ["", "local", "development"].includes(siteEnv));
