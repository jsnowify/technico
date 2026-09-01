import { buildMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/constants";
import Hero from "@/components/home/Hero";
import Overview from "@/components/home/Overview";
import Strategy from "@/components/home/Strategy";
import QuestionsAnswers from "@/components/home/QuestionsAnswers";
import Services from "@/components/home/Services";
import Partners from "@/components/home/Partners";
import Approach from "@/components/home/Approach";
import Feedback from "@/components/home/Feedback";
import Qualify from "@/components/home/Qualify";
import Discuss from "@/components/home/Discuss";
import FAQ from "@/components/home/FAQ";

export const metadata = buildMetadata({
  title: "Home",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Overview />
      <Strategy />
      <QuestionsAnswers />
      <Services />
      <Partners />
      <Approach />
      <Feedback />
      <Qualify />
      <Discuss />
      <FAQ />
    </>
  );
}
