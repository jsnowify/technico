import Button from "@/components/ui/Button";
import EditorialHeader from "@/components/ui/EditorialHeader";
import GridCorners from "@/components/ui/GridCorners";
import PixelRevealImage from "@/components/home/PixelRevealImage";
import { SITE_PHONE_HREF } from "@/lib/constants";

const HERO_IMAGE = "/technico-digital-solutions-inc-bg.webp";

export default function AboutHero() {
  return (
    <section className="bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
        <EditorialHeader
          label="About Technico"
          headingLevel="h1"
          title="Your Trusted Digital Marketers For Business Transformation"
          copy={
            <p>
              At Technico Solutions, We&apos;re Your Trusted Digital Marketers,
              All About Driving Results That Matter.
            </p>
          }
          aside={
            <Button to={SITE_PHONE_HREF} variant="purple-fill">
              Book a Call
            </Button>
          }
        />

        <figure className="relative mt-10 aspect-[4/3] overflow-hidden border border-white/20 sm:mt-14 sm:aspect-[16/9] lg:aspect-[21/8]">
          <GridCorners />
          <PixelRevealImage
            src={HERO_IMAGE}
            alt=""
            sizes="(min-width: 1920px) 1740px, 100vw"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex justify-between gap-4 bg-black-bg/85 p-4 font-mono text-[10px] tracking-[0.06em] text-content uppercase backdrop-blur-sm sm:p-5 sm:text-xs">
            <span>{"// Digital marketing agency"}</span>
            <span>About / 00</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
