import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";
import AboutHero from "@/components/about/AboutHero";
import AboutHeroReveal from "@/components/about/AboutHeroReveal";
import AboutStory from "@/components/about/AboutStory";
import AboutBusinessMarketing from "@/components/about/AboutBusinessMarketing";

export const metadata = buildMetadata({
  title: "About Our Digital Marketing Agency",
  description: `Learn about ${SITE_NAME}, our approach to digital marketing, and how we support businesses with brand development and growth strategies.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <div className="home-hero-stack relative isolate h-[200svh] bg-black-bg">
        <div className="home-hero-panel absolute inset-x-0 top-0 z-10 h-[100svh]">
          <AboutHero />
        </div>
        <div className="home-reveal-panel sticky top-0 z-0 h-[100svh]">
          <AboutHeroReveal />
        </div>
      </div>
      <AboutStory />
      <AboutBusinessMarketing />
    </>
  );
}
