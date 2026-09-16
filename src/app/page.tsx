import { buildMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, FAQS } from "@/lib/constants";
import FAQ from "@/components/ui/FAQ";
import Hero from "@/components/home/Hero";
import HeroStats from "@/components/home/HeroStats";
import Overview from "@/components/home/Overview";
import MarqueeText from "@/components/ui/MarqueeText";
import Strategy from "@/components/home/Strategy";
import QuestionsAnswers from "@/components/home/QuestionsAnswers";
import Services from "@/components/home/Services";
import Approach from "@/components/home/Approach";
import Feedback from "@/components/home/Feedback";
import Qualify from "@/components/home/Qualify";

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
      <MarqueeText cta={{ label: "Let's connect", href: "/contact" }} />
      <Strategy />
      <QuestionsAnswers />
      <Services />
      <Approach />
      <Feedback />
      <Qualify />

      <FAQ
        eyebrow="[ ] Questions = Answers"
        heading={
          <>
            Frequently
            <br />
            Asked
            <br />
            Questions
          </>
        }
        description="Answers to the questions we hear most from businesses evaluating a digital marketing partner. Still have one? Schedule a strategy call with Technico Digital Solutions today."
        items={FAQS}
      />
    </>
  );
}
