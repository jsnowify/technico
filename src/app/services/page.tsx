import { buildMetadata } from "@/lib/seo";
import { SERVICES_FAQS } from "@/lib/constants";
import FAQ from "@/components/ui/FAQ";
import ServicesHero from "@/components/services/ServicesHero";
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
      <ServicesHero />
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
