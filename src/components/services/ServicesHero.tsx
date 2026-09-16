"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";
import ServiceTagsPhysics from "@/components/services/ServiceTagsPhysics";

/* ================================================================
   SERVICES HERO
   ================================================================
   v3 layout, driven by the client's SVG (1243x385 viewBox).

   The heading text is completely separate from the image — it sits
   as plain text on the black section background ABOVE the image
   panel (no mask, no overlap).

   The image panel below it is its own rounded block, with a small
   notch cut out of its TOP-RIGHT corner only (bounding box from the
   path: x 949-1243, y 0-72 → 23.7% width, 18.7% height of the
   1243x385 panel). That notch is where "Book a Call" sits — the
   button is backed by black (via the cutout) instead of the image,
   so it reads as a separate pill floating at the image's corner,
   per the client's reference screenshot.

   NOTE: the GSAP scroll parallax on the image has been removed —
   it was sharing a transformed ancestor with the button and causing
   the button's hover (goo/circle-detach) effect to glitch. This
   section is now fully static/plain, per client request.
   ================================================================ */

const HERO_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/q_auto:best/v1789032026/temporary-placeholder/Gemini_Generated_Image_3f5bts3f5bts3f5b_qjxyw0.avif";

// Client's v3 notch path (viewBox 0 0 1243 385) — notch cut at top-right,
// all corners rounded to 20px to match the site's global 20px radius
// (was 30px in the original client SVG).
const NOTCH_PATH =
  "M959 0C970.0457 0 979 8.9543 979 20V52C979 63.0457 987.9543 72 999 72H1223C1234.0457 72 1243 80.9543 1243 92V365C1243 376.0457 1234.0457 385 1223 385H20C8.9543 385 0 376.0457 0 365V20C0 8.9543 8.9543 0 20 0H959Z";

const NOTCH_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1243 385'><path d='${NOTCH_PATH}' fill='white'/></svg>`;

const NOTCH_MASK = `url("data:image/svg+xml,${encodeURIComponent(NOTCH_SVG)}")`;

export default function ServicesHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0A0A0C]">
      {/* Waving hand animation for the "[ ] SERVICES 👋" eyebrow label */}
      <style jsx global>{`
        @keyframes wave {
          0%,
          60%,
          100% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(14deg);
          }
          20% {
            transform: rotate(-8deg);
          }
          30% {
            transform: rotate(14deg);
          }
          40% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }
        .wave-emoji {
          transform-origin: 70% 70%;
          animation: wave 2.4s ease-in-out infinite;
        }
      `}</style>
      <div className="container-x mx-auto max-w-[1440px] pt-24 pb-10 sm:pt-28 sm:pb-12 md:pb-14 lg:pt-24 lg:pb-16 xl:pt-28">
        {/* MOBILE / TABLET (< lg) — unchanged, simple stacked layout */}
        <div className="flex flex-col gap-8 lg:hidden">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-sm font-light tracking-[-0.02em] text-white/70 uppercase">
              [ ] SERVICES <span className="wave-emoji inline-block">👋</span>
            </p>
            <h1 className="max-w-xl text-[36px] leading-[1.05] font-medium tracking-[-1px] text-white sm:text-[48px] sm:tracking-[-1.5px]">
              <span className="underline decoration-[#EC4899] underline-offset-4 text-[#EC4899]">
                Digital Marketing Services
              </span>{" "}
              that deliver real business growth.
            </h1>
            <div className="w-full max-w-xs sm:w-auto">
              <Button to={SITE_PHONE_HREF} variant="pink-fill">
                Book a Call
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#1A1A1A] sm:aspect-[16/10]">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <ServiceTagsPhysics />
          </div>
        </div>

        {/* DESKTOP (lg+) — v3 layout: plain heading block on top,
            image panel (with top-right notch for the button) below.
            Fully static now — no parallax/ref/GSAP anywhere here. */}
        <div className="hidden w-full flex-col gap-8 lg:flex">
          {/* Heading block — plain text on the black section bg,
              no mask, no overlap with the image below it */}
          <div className="max-w-4xl">
            <p className="mb-3 font-mono text-[14px] font-light tracking-[-0.02em] text-white/70 uppercase">
              [ ] SERVICES <span className="wave-emoji inline-block">👋</span>
            </p>
            <h1 className="text-[62px] leading-[1.08] font-medium tracking-[-0.5px] text-white">
              <span className="underline decoration-[#EC4899] underline-offset-4 text-[#EC4899]">
                Digital Marketing Services
              </span>{" "}
              that deliver real business growth.
            </h1>
          </div>

          {/* Image panel — masked to the notch at its top-right corner */}
          <div
            className="relative w-full"
            style={{ aspectRatio: "1243 / 385" }}
          >
            <div
              className="absolute inset-0 overflow-hidden rounded-[20px] bg-[#0E0F11]"
              style={{
                WebkitMaskImage: NOTCH_MASK,
                maskImage: NOTCH_MASK,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            >
              <Image
                src={HERO_IMAGE}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 1243px, 100vw"
                className="object-cover object-center"
              />

              <ServiceTagsPhysics />
            </div>

            {/* "Book a Call" sits in the top-right notch, backed by
                black (the cutout) instead of the image. Plain
                top/right offset, no constrained box, so its hover
                effect (circle detaching from the label) behaves
                normally. */}
            <div className="absolute top-2 right-6">
              <Button to={SITE_PHONE_HREF} variant="pink-fill">
                Book a Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
