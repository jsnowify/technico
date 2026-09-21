import { buildMetadata } from "@/lib/seo";
import ContactHero from "@/components/contact/ContactHero";
import ContactHeroReveal from "@/components/contact/ContactHeroReveal";
import ContactIntro from "@/components/contact/ContactIntro";

export const metadata = buildMetadata({
  title: "Contact Our Digital Marketing Team",
  description:
    "Contact Technico Digital Solutions to discuss your marketing goals, explore our services, or request a strategy conversation.",
  path: "/contact",
});

// Same two-viewport sticky stack as Home, About, Services and the Blog
// index: a purple hero panel (ContactHero, carries the page's H1) scrolls
// away to reveal a sticky black panel (ContactHeroReveal, the direct
// contact details + CTA) underneath. ContactIntro adds a short paragraph
// of supporting copy, and ContactSection (rendered globally by
// app/layout.tsx at the end of every page) follows with the form.
export default function ContactPage() {
  return (
    <>
      <div className="home-hero-stack relative isolate h-[200svh] bg-black-bg">
        <div className="home-hero-panel absolute inset-x-0 top-0 z-10 h-[100svh]">
          <ContactHero />
        </div>
        <div className="home-reveal-panel sticky top-0 z-0 h-[100svh]">
          <ContactHeroReveal />
        </div>
      </div>
      <ContactIntro />
    </>
  );
}
