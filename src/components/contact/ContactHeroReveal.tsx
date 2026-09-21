import Button from "@/components/ui/Button";
import NavLink from "@/components/motion/NavLink";
import EditorialPageReveal from "@/components/ui/EditorialPageReveal";
import {
  SITE_EMAIL,
  SITE_EMAIL_HREF,
  SITE_PHONE,
  SITE_PHONE_HREF,
  SOCIAL_LINKS,
} from "@/lib/constants";

// Reuses the About page's team photo: the same "talk to real people"
// feeling, on the same reveal panel every other top-level page uses.
const HERO_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789987047/contact-imgs/technico-contact_lqk6bi.png";

/** Direct ways to reach us — verbatim from the original ContactIntro. */
const CONTACT_LINKS = [
  { label: SITE_PHONE, href: SITE_PHONE_HREF },
  { label: SITE_EMAIL, href: SITE_EMAIL_HREF },
  { label: "Facebook", href: SOCIAL_LINKS.facebook },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
] as const;

export default function ContactHeroReveal() {
  return (
    <EditorialPageReveal
      id="contact-hero-reveal"
      page="CONTACT"
      code="07 / CONNECT"
      image={HERO_IMAGE}
      imageAlt="Technico Digital Solutions team ready to talk through your marketing goals"
      imageLabel="// Reach us directly"
      // Verbatim first paragraph of the original intro copy, used as
      // this panel's heading rather than being reworded.
      heading="Have questions about email marketing services, digital advertising, or any of our marketing solutions? Our team at Technico Digital Solutions is ready to help."
      actions={
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-9">
          <Button to="#contact-form" variant="purple-fill">
            Send a Message
          </Button>
          <div className="flex flex-col items-start gap-2.5">
            {CONTACT_LINKS.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label.toUpperCase()}
                className="max-w-full text-sm font-medium break-all text-white-text hover:text-accent-light"
              />
            ))}
            <span className="font-mono text-xs tracking-[0.05em] text-content-muted uppercase">
              Canada
            </span>
          </div>
        </div>
      }
    />
  );
}
