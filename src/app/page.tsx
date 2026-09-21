import { buildMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, FAQS } from "@/lib/constants";
import FAQ from "@/components/ui/FAQ";
import Hero from "@/components/home/Hero";
import HeroReveal from "@/components/home/HeroReveal";
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
  title: "Digital Marketing Agency in Canada | Technico Digital Solutions",
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      {/*
        A two-viewport, CSS-only stack. HeroReveal stays pinned behind the
        foreground Hero for exactly one viewport: the same distance the Hero
        needs to leave the screen. Once the Hero is gone, the sticky boundary
        is over too, so the next section immediately pushes HeroReveal away.

        No negative margins, empty hold spacer, ScrollTrigger pin, or wheel
        listener participates in this transition.
      */}
      <div className="home-hero-stack relative isolate h-[200svh] bg-black-bg">
        <div className="home-hero-panel absolute inset-x-0 top-0 z-10 h-[100svh]">
          <Hero />
        </div>
        <div className="home-reveal-panel sticky top-0 z-0 h-[100svh]">
          <HeroReveal />
        </div>
      </div>
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
            asked
            <br />
            questions
          </>
        }
        description="Answers to the questions we hear most from businesses evaluating a digital marketing partner. Still have one? Schedule a strategy call with Technico Digital Solutions today."
        items={FAQS}
      />
    </>
  );
}
