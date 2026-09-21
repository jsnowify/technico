import Link from "next/link";

const CLOSING_TEXT =
  "Start a conversation today and see how our digital marketing services agency can help your business connect, convert, and retain customers.";
const CLOSING_LINK_LABEL = "digital marketing services agency";

/** Same inline-link approach as CTA.tsx's `descriptionLink`. */
function ClosingParagraph() {
  const index = CLOSING_TEXT.indexOf(CLOSING_LINK_LABEL);

  return (
    <p className="body-copy leading-[1.65] text-content">
      {CLOSING_TEXT.slice(0, index)}
      <Link
        href="https://technicosolutions.com/contact-us/"
        data-cursor="circle"
        data-cursor-label="Explore"
        className="underline underline-offset-4 hover:text-accent-light"
      >
        {CLOSING_LINK_LABEL}
      </Link>
      {CLOSING_TEXT.slice(index + CLOSING_LINK_LABEL.length)}
    </p>
  );
}

/**
 * Sits between the Hero/HeroReveal stack and the global ContactSection
 * form. The page's H1 ("Get in touch"), eyebrow ("Contact"), first
 * intro paragraph, and direct contact links now live in ContactHero /
 * ContactHeroReveal — this keeps the rest of the original copy,
 * verbatim, as supporting body text (no heading, so the page keeps a
 * single h1).
 */
export default function ContactIntro() {
  return (
    <section className="bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] py-16 sm:py-20 lg:py-24">
        <div className="max-w-[68ch] space-y-5">
          <p className="body-copy leading-[1.65] text-content">
            If you’re looking to improve your email campaigns, optimize paid
            ads, rank at the top of search results, or explore new ways to reach
            customers, we provide clear guidance and hands-on support.
          </p>
          <p className="body-copy leading-[1.65] text-content">
            You’ll work with experts who understand how to combine strategy,
            creativity, and technology to make every marketing effort count.
          </p>
          <p className="body-copy leading-[1.65] text-content">
            Book your appointment via our website, email us, or give us a call.
            We’ll respond promptly and walk you through the best solutions for
            your business.
          </p>
          <ClosingParagraph />
        </div>
      </div>
    </section>
  );
}
