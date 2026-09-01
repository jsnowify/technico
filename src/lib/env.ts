/**
 * IS_PRODUCTION
 * ------------------------------------------------------------
 * Single source of truth for "is this the live, public site?",
 * used by app/robots.ts and the `robots` metadata in app/layout.tsx
 * so staging/preview deploys stay out of Google by default and the
 * two can't drift out of sync with each other.
 *
 * Checks, in order:
 *   1. VERCEL_ENV — if deployed on Vercel, this is set automatically
 *      to "production" | "preview" | "development". Preview deploys
 *      (including staging, if staging is just a branch deploy) are
 *      correctly treated as non-production with zero extra config.
 *   2. NEXT_PUBLIC_SITE_ENV — manual override for any other host
 *      (or a dedicated long-lived "staging" environment on Vercel
 *      that isn't a preview deploy). Set this in your staging
 *      environment's env vars, e.g. NEXT_PUBLIC_SITE_ENV=staging.
 *      Must be NEXT_PUBLIC_ so it's readable in both the server
 *      metadata export and, if ever needed, client code.
 *
 * Defaults to NOT production (safer default: an env that forgets to
 * set either var gets noindex'd rather than accidentally indexed).
 */
export const IS_PRODUCTION: boolean =
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_SITE_ENV === "production";
