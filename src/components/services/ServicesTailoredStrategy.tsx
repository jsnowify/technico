import Button from "@/components/ui/Button";
import TextRevealBlock from "@/components/motion/TextRevealBlock";
import ScrollFillText from "@/components/motion/ScrollFillText";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   SERVICES TAILORED STRATEGY
   ================================================================
   First piece of the services page's 4th section (see
   services_4th_section.png), broken out as its own component per
   your request to build this section piece by piece. Covers just
   the top of that mock: the white intro CTA banner ("Deliver the
   right message...") through the black "built around your business"
   block, ending at "The goal is to turn your digital presence...".
   Everything below that (Industries We Know, the Canada map, the
   engagement/deliverables block, the closing CTA) is intentionally
   NOT here yet — separate components, next.

   Reuses the same building blocks as ServicesMarketOverview rather
   than introducing new patterns:
   - TextRevealBlock for both headings (curtain-wipe reveal,
     scrollTrigger since both sit below the fold)
   - ScrollFillText for the one muted mid-sentence clause in the
     "Our digital team works with businesses across..." line
     ("Industries, Locations, And Stages Of Growth,"), matching how
     the mock dims that clause relative to the rest of the sentence
   - Button (not GlossyButton) for "Book a Call", matching the plain
     black pill in the mock rather than the purple glossy CTA used
     at the very bottom of the market-overview section
   ================================================================ */

export default function ServicesTailoredStrategy() {
  return (
    <>
      {/* Intro CTA banner */}
      <section className="bg-white-bg">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 pb-20 text-center sm:pt-28 sm:pb-28 md:pt-32 md:pb-32">
          <TextRevealBlock
            as="h2"
            lines={[
              "Deliver The Right Message To Your Ideal Audience",
              "With Customized Digital Marketing Solutions. Let\u2019s",
              "Create A Strategy That Works For Your Business.",
            ]}
            className="max-w-6xl text-3xl leading-[1.2] font-semibold tracking-tight text-black-text capitalize sm:text-4xl md:text-5xl md:leading-[1.15] lg:text-[45px]"
            revealColorDark="#000000"
            scrollTrigger
          />

          <div className="mt-10 w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="primary" size="lg">
              Book a Call
            </Button>
          </div>
        </div>
      </section>

      {/* Tailored strategy */}
      <section className="bg-black-bg">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32 md:pt-32 md:pb-40">
          <TextRevealBlock
            as="h2"
            lines={[
              "Digital Marketing Built Around Your",
              "Business, Market & Customers",
            ]}
            className="mx-auto max-w-3xl text-center text-3xl leading-[1.15] font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[45px]"
            scrollTrigger
          />
          <p className="mx-auto mt-5 max-w-xl text-center text-sm text-white/50 sm:text-base">
            Your Business Doesn&rsquo;t Need The Same Marketing Strategy As
            Everyone Else.
          </p>

          <p className="mt-20 max-w-xl text-2xl leading-[1.4] font-medium text-white sm:mt-24 sm:text-3xl md:text-4xl">
            A Law Firm May Need Qualified Local Leads From High-Intent Searches,
            While A Solar Company May Need To Educate Homeowners Before Turning
            Interest Into Quote Requests.
          </p>

          <p className="ml-auto mt-16 max-w-xl text-right text-2xl leading-[1.4] font-medium sm:mt-20 sm:text-3xl md:text-4xl">
            <span className="text-white">
              Our Digital Team Works With Businesses Across{" "}
            </span>
            <ScrollFillText
              text="Industries, Locations, And Stages Of Growth,"
              className="text-white"
            />
            <span className="text-white">
              {" "}
              Building Strategies That Focus On How Your Customers Search,
              Compare, And Take Action
            </span>
          </p>

          <p className="mx-auto mt-20 max-w-3xl text-center text-xl leading-[1.5] font-medium text-white/80 sm:mt-24 sm:text-2xl md:text-3xl">
            The Goal Is To Turn Your Digital Presence Into More Local Leads,
            Ecommerce Sales, Appointment Bookings, And Opportunities To Grow
            Into New Markets.
          </p>
        </div>
      </section>
    </>
  );
}
