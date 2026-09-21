import Button from "@/components/ui/Button";
import EditorialPageReveal from "@/components/ui/EditorialPageReveal";
import { SITE_PHONE_HREF } from "@/lib/constants";

const HERO_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960382/about-imgs/technico_about_hero_lfgahb.png";

export default function AboutHeroReveal() {
  return (
    <EditorialPageReveal
      id="about-hero-reveal"
      page="ABOUT"
      code="05 / STUDIO"
      image={HERO_IMAGE}
      imageAlt="Technico Solutions digital marketing team driving results that matter"
      imageLabel="// Digital marketing agency"
      heading="At Technico Solutions, we're your trusted digital marketers, all about driving results that matter."
      compactHeading
      actions={
        <Button to={SITE_PHONE_HREF} variant="purple-fill">
          Book a Call
        </Button>
      }
    />
  );
}
