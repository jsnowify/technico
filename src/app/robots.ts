import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { IS_PRODUCTION } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Belt-and-suspenders alongside the noindex meta tag in
  // app/layout.tsx: the meta tag is what actually keeps staging out
  // of Google (see block-indexing doc), this just also asks crawlers
  // not to bother visiting staging at all, and holds back the
  // sitemap so it's not handed out as a discovery path either.
  if (!IS_PRODUCTION) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
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
