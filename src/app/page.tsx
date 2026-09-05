import { buildMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/constants";
import Hero from "@/components/home/Hero";
import HeroStats from "@/components/home/HeroStats";
import Overview from "@/components/home/Overview";
import Strategy from "@/components/home/Strategy";
import QuestionsAnswers from "@/components/home/QuestionsAnswers";
import Services from "@/components/home/Services";
import Approach from "@/components/home/Approach";
import Feedback from "@/components/home/Feedback";
import Qualify from "@/components/home/Qualify";
import Discuss from "@/components/home/Discuss";
import FAQ from "@/components/home/FAQ";
import TrustedBy from "@/components/home/TrustedBy";

export const metadata = buildMetadata({
  title: "Home",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <HeroStats />
      <Overview />
      <Strategy />
      <QuestionsAnswers />
      <Services />
      <Approach />
      <Feedback />
      <Qualify />
      <Discuss />
      <FAQ />
    </>
  );
}
