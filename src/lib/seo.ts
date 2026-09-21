import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
} from "@/lib/constants";
import { IS_PRODUCTION } from "@/lib/env";

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
  canonicalPath = path,
  image = DEFAULT_OG_IMAGE,
  absoluteTitle = false,
  index,
  follow,
}: {
  title: string;
  description: string;
  path?: string;
  canonicalPath?: string;
  image?: string;
  /** Use when the supplied title already includes the brand name. */
  absoluteTitle?: boolean;
  index?: boolean;
  follow?: boolean;
}): Metadata {
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const customRobots = index === false || follow === false;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: canonicalUrl },
    ...(customRobots
      ? {
          robots: {
            index: IS_PRODUCTION && index !== false,
            follow: IS_PRODUCTION && follow !== false,
            googleBot: {
              index: IS_PRODUCTION && index !== false,
              follow: IS_PRODUCTION && follow !== false,
            },
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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
