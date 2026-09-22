import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_PHONE,
  SITE_EMAIL,
  SOCIAL_LINKS,
  NAV_LINKS,
} from "@/lib/constants";
import JsonLd from "@/components/seo/JsonLd";
import Header from "@/components/layout/Header";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import GlobalCursor from "@/components/layout/GlobalCursor";
import PreLoader from "@/components/layout/PreLoader";
import PageTransition from "@/components/layout/PageTransition";
import { getAllServices } from "@/lib/content/services";
import { getAllPosts } from "@/lib/content/blog";
import { IS_INDEXABLE } from "@/lib/env";
import StickyConnectCTA from "@/components/layout/StickyConnectCTA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // Do not index preview/staging; robots.txt must allow crawlers to read
  // this noindex tag. Password-protect nonpublic staging independently.
  robots: IS_INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
  icons: {
    icon: "/favicon.ico",
  },
  // Domain verification must be confirmed in the actual Search Console
  // property at launch (this value is carried over from the source).
  verification: {
    google: "iB53T08hbGrfdsAmrKTVhocsuFV5rgOwT5imiFu2Iu8",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  // The source contains only placeholder street/postal details. Do not
  // publish a made-up physical location as LocalBusiness structured data.
  // Add a verified LocalBusiness schema only when real NAP is supplied.
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: Object.values(SOCIAL_LINKS),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
  },
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Fetched here (Server Component) rather than inside Header itself
  // so the services list is resolved before the page ever reaches the
  // client — Header stays a plain client component that just renders
  // the prop it's given, and the nav content is present in the
  // initial HTML for crawlers instead of depending on a client fetch.
  // Avoid serializing every service's full content/sections into the Header
  // Client Component on *every* route; it only displays these three fields.
  const [allServices, posts] = await Promise.all([
    getAllServices(),
    getAllPosts(),
  ]);
  const services = allServices.map(({ slug, title, shortDescription }) => ({
    slug,
    title,
    shortDescription,
  }));

  // Match the real static routes and dynamic content registries. Unknown URLs
  // navigate immediately to the 404 instead of showing a branded page wipe.
  const transitionRoutes = [
    "/",
    "/services",
    "/about",
    "/blog",
    "/contact",
    ...allServices.map(({ slug }) => `/services/${slug}`),
    ...posts.map(({ slug }) => `/blog/${slug}`),
  ];

  return (
    <html
      lang="en"
      className={`h-full antialiased ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <div className="flex min-h-full flex-1 flex-col">
          <JsonLd data={organizationJsonLd} />
          <JsonLd data={webSiteJsonLd} />
          {/* Without JS, an unhydrated loader covers the server-rendered page.
              Keep the animation intact when JavaScript is available. */}
          <noscript>
            <style>{`.technico-preloader,.technico-pixel-canvas{display:none!important}`}</style>
          </noscript>
          <PreLoader />
          <PageTransition knownPaths={transitionRoutes} />
          <SmoothScrollProvider>
            <Header services={services} />
            {/* The interactive mobile menu is hidden without hydration.
                Supply ordinary, crawlable links as a no-JavaScript fallback. */}
            <noscript>
              <nav
                aria-label="Mobile navigation without JavaScript"
                className="relative z-20 flex flex-wrap gap-4 bg-white-bg px-5 py-4 font-mono text-sm text-black-text lg:hidden"
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="underline underline-offset-4"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </noscript>
            <main className="relative z-10 flex-1 bg-black-bg">
              {children}
              <ContactSection />
            </main>
            <Footer />
          </SmoothScrollProvider>
          <StickyConnectCTA />
          <NoiseOverlay />
          <GlobalCursor />
        </div>
      </body>
    </html>
  );
}
