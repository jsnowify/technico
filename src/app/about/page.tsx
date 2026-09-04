import { buildMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutBusinessMarketing from "@/components/about/AboutBusinessMarketing";

export const metadata = buildMetadata({
  title: "About",
  description: `Learn about ${SITE_NAME} and how we approach digital projects.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutBusinessMarketing />
    </>
  );
}
