import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
} from "@/lib/constants";

/**
 * Builds a page's Metadata object with canonical URL, OpenGraph, and Twitter
 * card fields pre-filled from the site-wide config in lib/constants.ts.
 *
 * Usage in a page:
 *   export const metadata = buildMetadata({
 *     title: "Services",
 *     description: "...",
 *     path: "/services",
 *   });
 */
export function buildMetadata({
  title,
  description,
  path = "",
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description,
      images: [image],
    },
  };
}
