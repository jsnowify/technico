/**
 * IS_PRODUCTION
 * ------------------------------------------------------------
 * Single source of truth for "is this the live, public site?",
 * used by app/robots.ts and the `robots` metadata in app/layout.tsx
 * so staging/preview deploys stay out of Google by default and the
 * two can't drift out of sync with each other.
 *
 * Vercel's deployment type takes precedence: setting SITE_ENV=production
 * on a preview must never accidentally make that preview indexable.
 * On a production deployment, SITE_ENV=staging is an explicit opt-out for
 * long-lived staging sites. Non-Vercel hosts must explicitly opt in.
 * Both metadata and robots.ts consume this same flag.
 *
 * Defaults to NOT production (safer default: an env that forgets to
 * set either var gets noindex'd rather than accidentally indexed).
 */
const vercelEnv = process.env.VERCEL_ENV;
const siteEnv = process.env.SITE_ENV ?? process.env.NEXT_PUBLIC_SITE_ENV;

export const IS_PRODUCTION: boolean = vercelEnv
  ? vercelEnv === "production" &&
    !["staging", "preview", "development"].includes(siteEnv ?? "")
  : siteEnv === "production";
