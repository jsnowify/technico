import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { IS_PRODUCTION } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Crawlers must be ALLOWED to fetch a staging URL to see its noindex
  // meta tag. A robots.txt Disallow: / would prevent that, and a known
  // staging URL could still surface in results without its content.
  // Protect private previews with deployment authentication as well.
  if (!IS_PRODUCTION) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
