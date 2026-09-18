import { buildMetadata } from "@/lib/seo";
import { SERVICES_FAQS } from "@/lib/constants";
import FAQ from "@/components/ui/FAQ";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesHeroReveal from "@/components/services/ServicesHeroReveal";
import Services from "@/components/services/Services";
import ServicesMarketOverview from "@/components/services/ServicesMarketOverview";
import ServicesMarketStats from "@/components/services/ServicesMarketStats";
import ServicesTailoredStrategy from "@/components/services/ServicesTailoredStrategy";
import ServicesChapterReel from "@/components/services/ServicesChapterReel";
import ServicesAgencyIntro from "@/components/services/ServicesAgencyIntro";

export const metadata = buildMetadata({
  title: "Digital Marketing Services",
  description:
    "SEO, web development, paid advertising, social media, and email marketing for businesses across Canada. Data-driven digital marketing services from Technico Digital Solutions.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      {/* Exact same CSS-only sheet reveal as app/page.tsx.
          The purple hero scrolls away; the black sheet stays underneath.
          The shared home-hero-* classes also inherit the homepage's
          short-landscape natural-flow fallback from globals.css. */}
      <div className="home-hero-stack relative isolate h-[200svh] bg-black-bg">
        <div className="home-hero-panel absolute inset-x-0 top-0 z-10 h-[100svh]">
          <ServicesHero />
        </div>
        <div className="home-reveal-panel sticky top-0 z-0 h-[100svh]">
          <ServicesHeroReveal />
        </div>
      </div>
      <ServicesMarketOverview />
      <ServicesMarketStats />
      <Services />
      <ServicesTailoredStrategy />
      <ServicesChapterReel />
      <ServicesAgencyIntro />
      <FAQ
        eyebrow="[ ] Services FAQ"
        heading="Frequently asked questions"
        items={SERVICES_FAQS}
      />
    </>
  );
}
