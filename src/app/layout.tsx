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
} from "@/lib/constants";
import JsonLd from "@/components/seo/JsonLd";
import Header from "@/components/layout/Header";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import BottomGlassBlur from "@/components/layout/BottomGlassBlur";
import { getAllServices } from "@/lib/content/services";

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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#010104",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
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
        </div>
      </body>
    </html>
  );
}
