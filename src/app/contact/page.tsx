import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Technico Digital Solutions Inc.",
  path: "/contact",
});

// The page's own headline/intro used to live here as an H1 + intro
// line, stacked right above ContactSection's form (rendered globally
// by app/layout.tsx at the end of every page, including this one).
// That headline now lives in ContactSection itself instead — see the
// comment there — so /contact needs no body of its own beyond
// metadata; the section below carries the entire page.
export default function ContactPage() {
  return null;
}
