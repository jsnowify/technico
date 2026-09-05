import { buildMetadata } from "@/lib/seo";
import { getAllServices } from "@/lib/content/services";
import ServicesHero from "@/components/services/ServicesHero";
import Services from "@/components/services/Services";
import ServicesMarketOverview from "@/components/services/ServicesMarketOverview";
import ServicesMarketStats from "@/components/services/ServicesMarketStats";
import ServicesTailoredStrategy from "@/components/services/ServicesTailoredStrategy";
import ServicesChapterReel from "@/components/services/ServicesChapterReel";
import ServicesAgencyIntro from "@/components/services/ServicesAgencyIntro";
import ServicesFAQ from "@/components/services/ServicesFAQ";

export const metadata = buildMetadata({
  title: "Digital Marketing Services",
  description:
    "SEO, web development, paid advertising, social media, and email marketing for businesses across Canada. Data-driven digital marketing services from Technico Digital Solutions.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <>
      <ServicesHero />
      <ServicesMarketOverview />
      <ServicesMarketStats />
      <Services services={services} />
      <ServicesTailoredStrategy />
      <ServicesChapterReel />
      <ServicesAgencyIntro />
      <ServicesFAQ />
    </>
  );
}
