import Button from "@/components/ui/Button";
import EditorialPageReveal from "@/components/ui/EditorialPageReveal";
import { SITE_PHONE_HREF } from "@/lib/constants";

const HERO_IMAGE = "/technico-digital-solutions-inc-bg.webp";

export default function AboutHeroReveal() {
  return (
    <EditorialPageReveal
      id="about-hero-reveal"
      page="ABOUT"
      code="05 / STUDIO"
      image={HERO_IMAGE}
      imageLabel="// Digital marketing agency"
      heading="At Technico Solutions, We're Your Trusted Digital Marketers, All About Driving Results That Matter."
      compactHeading
      actions={
        <Button to={SITE_PHONE_HREF} variant="purple-fill">
          Book a Call
        </Button>
      }
    />
  );
}
