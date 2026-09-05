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
  SITE_ADDRESS,
  SERVICE_AREAS,
} from "@/lib/constants";
import JsonLd from "@/components/seo/JsonLd";
import Header from "@/components/layout/Header";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import BottomGlassBlur from "@/components/layout/BottomGlassBlur";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import { getAllServices } from "@/lib/content/services";
import { IS_PRODUCTION } from "@/lib/env";

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
  // Staging/preview deploys must never be indexed — see
  // https://developers.google.com/search/docs/crawling-indexing/block-indexing.
  // This <meta name="robots"> tag is the reliable way to do that (as
  // opposed to robots.txt, which only blocks crawling and can't stop
  // an already-linked URL from still showing up in results).
  robots: IS_PRODUCTION
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
  // Proves domain ownership to Google Search Console — renders as
  // <meta name="google-site-verification" content="..." />. Kept
  // independent of the noindex/robots logic above: Search Console
  // still needs to be able to verify staging too if you ever check
  // a staging property there, so this isn't gated on IS_PRODUCTION.
  verification: {
    google: "iB53T08hbGrfdsAmrKTVhocsuFV5rgOwT5imiFu2Iu8",
  },
};

export const viewport: Viewport = {
  themeColor: "#010104",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: Object.values(SOCIAL_LINKS),
  address: {
    "@type": "PostalAddress",
    ...SITE_ADDRESS,
  },
  areaServed: SERVICE_AREAS.map((area) => ({
    "@type": "Place",
    name: area,
  })),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Fetched here (Server Component) rather than inside Header itself
  // so the services list is resolved before the page ever reaches the
  // client — Header stays a plain client component that just renders
  // the prop it's given, and the nav content is present in the
  // initial HTML for crawlers instead of depending on a client fetch.
  const services = await getAllServices();

  return (
    <html
      lang="en"
      className={`h-full antialiased ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <div className="flex min-h-full flex-1 flex-col">
          <JsonLd data={organizationJsonLd} />
          <SmoothScrollProvider>
            <Header services={services} />
            <main className="flex-1">
              {children}
              <ContactSection />
            </main>
            <Footer />
          </SmoothScrollProvider>
          <BottomGlassBlur />
          <NoiseOverlay />
        </div>
      </body>
    </html>
  );
}
