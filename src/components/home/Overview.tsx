import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import GlossyButton from "@/components/ui/GlossyButton";
import { SITE_NAME, SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   HOME OVERVIEW (second section)
   ================================================================
   ASSETS (expected in /public):
     /technico-digital-solutions-1.png
     /technico-digital-solutions-2.png
     /technico-digital-solutions-3.png

   Static section, no scroll/entrance animation — plain
   server-rendered JSX like the rest of the copy in Hero.
   ================================================================ */

const PANELS = [
  {
    image: "/technico-digital-solutions-1.png",
    text: (
      <>
        Technico Digital Solutions is a{" "}
        <Link
          href="/services"
          className="text-purple-secondary underline decoration-1 underline-offset-2 hover:text-purple-accent"
        >
          digital marketing agency
        </Link>{" "}
        that will unlock your brand&rsquo;s potential to drive substantial
        growth. Benefit from our data-driven strategies focused on increasing
        your revenues and positioning your brand as a leader in the market.
      </>
    ),
  },
  {
    image: "/technico-digital-solutions-2.png",
    text: (
      <>
        Our digital marketing professionals establish a realistic timeline for
        implementing digital marketing strategies and setting milestones to
        track progress.
      </>
    ),
  },
  {
    image: "/technico-digital-solutions-3.png",
    text: (
      <>
        Let us show you how we can elevate your revenue, amplify your profits,
        and expand your brand&rsquo;s reach in the digital realm.
      </>
    ),
  },
] as const;

export default function Overview() {
  return (
    <section className="bg-white-bg">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-purple-secondary" />
          <span className="font-mono text-xs tracking-[0.14em] text-black-text uppercase text-balance sm:text-sm">
            {SITE_NAME.replace(/\.$/, "")}
          </span>
        </div>

        {/* Headline */}
        <h2 className="mx-auto mt-6 max-w-4xl text-balance text-center text-[2rem] leading-[1.15] font-normal tracking-tight text-black-text sm:text-[42px] sm:leading-[1.1] sm:tracking-[-1.5px] md:text-[50px] md:leading-[52px] md:tracking-[-2px]">
          Boost revenues, maximize profits, generate qualified leads, and
          enhance brand visibility.
        </h2>

        {/* Panels */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3">
          {PANELS.map((panel) => (
            <div
              key={panel.image}
              className="flex flex-col justify-between bg-[#f3f4ee] px-8 py-12 sm:px-10 sm:py-14"
            >
              <p className="font-mono text-base leading-relaxed text-black-text uppercase text-pretty">
                {panel.text}
              </p>

              <div className="relative mx-auto mt-12 w-full max-w-[300px]">
                <Image
                  src={panel.image}
                  alt=""
                  width={600}
                  height={600}
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-14 sm:flex-row">
          <div className="w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="primary" size="lg">
              Book a Call
            </Button>
          </div>
          <div className="w-full max-w-xs sm:w-auto">
            <GlossyButton to="/contact">Free Strategy</GlossyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
