import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import GridCorners from "@/components/ui/GridCorners";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";

interface CtaLink {
  label: string;
  href: string;
}

interface CtaProps {
  title?: ReactNode;
  description?: string;
  /** Optional inline link inside `description` — `label` must be an exact substring. */
  descriptionLink?: CtaLink;
  cta?: CtaLink;
  className?: string;
  wide?: boolean;
  eyebrow?: string;
}

function renderDescription(description: string, link?: CtaLink) {
  if (!link) return description;
  const index = description.indexOf(link.label);
  if (index === -1) return description;

  return (
    <>
      {description.slice(0, index)}
      <Link
        href={link.href}
        data-cursor="circle"
        data-cursor-label="Explore"
        className="underline underline-offset-4 hover:text-accent-light"
      >
        {link.label}
      </Link>
      {description.slice(index + link.label.length)}
    </>
  );
}

/** Shared editorial CTA: one connected grid and one purposeful hover motion. */
export default function Cta({
  title = "We go the extra mile to help you",
  description = "Fulfill your business plans with targeted digital marketing strategies. Partner with us today and see competitive results.",
  descriptionLink,
  cta = { label: "Book A Call", href: "#" },
  className = "",
  wide = false,
  eyebrow = "LET'S TALK",
}: CtaProps) {
  return (
    <section className={`bg-black-bg py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="container-x mx-auto w-full max-w-[1920px]">
        <div
          data-stagger-hover
          data-stagger-static
          className="relative min-w-0 border-y border-black-bg/25"
        >
          <GridCorners />
          <HorizontalStaggerRows />

          <div className="relative border-b border-white/15 px-5 py-4 text-center sm:px-8 sm:py-5">
            <p className="font-mono text-xs tracking-[0.06em] text-accent uppercase">
              <span aria-hidden="true">{"// "}</span>
              {eyebrow}
            </p>
          </div>

          <div className="relative flex min-w-0 flex-col items-center px-5 py-[clamp(36px,6vw,88px)] text-center sm:px-10 lg:px-16">
            <h2 className="h2-section max-w-[24ch] leading-[1.08] font-medium tracking-heading text-white-text text-balance">
              {title}
            </h2>
            <p
              className={`body-copy mt-5 w-full leading-[1.65] text-content sm:mt-6 ${
                wide ? "max-w-[76ch]" : "max-w-[56ch]"
              }`}
            >
              {renderDescription(description, descriptionLink)}
            </p>
            <div className="mt-8 flex w-full max-w-full justify-center sm:mt-10">
              <Button to={cta.href} variant="purple-fill" size="lg">
                {cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
