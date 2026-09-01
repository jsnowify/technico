import Link from "next/link";
import Image from "next/image";
import TextRevealBlock from "@/components/motion/TextRevealBlock";
import GlossyButton from "@/components/ui/GlossyButton";

/* ================================================================
   SERVICES MARKET OVERVIEW
   ================================================================
   REDESIGN — editorial layout, based on a reference screenshot of
   an architecture studio's "The Studio" page: a big opening
   statement, a staggered row of images running edge-to-edge, then
   a quiet two-column split pairing body copy with a supporting
   image. Replaces the previous bento-grid treatment (numbered
   corner tags on a grid of colored cells).

   COPY — untouched, correctly grouped
   ------------------------------------------------------------
   Every sentence of the source copy is still here verbatim —
   nothing removed, reworded, or replaced with tags/summaries. This
   pass fixes a structural mistake from the previous one: the source
   copy is actually TWO paragraphs in the intro (not four separate
   sentence fragments) and ONE paragraph in the closing (not two) —
   each paragraph is now a single <p>, matching the real flow, not
   sentence-by-sentence chopped across separate cells/blocks.
   The two sr-only "Start here:" cues are kept, now sitting at the
   start of the paragraph they always belonged to.

   STRUCTURE
   ------------------------------------------------------------
   Still three sections, still alternating bg white -> black ->
   white to match the rest of the site's rhythm. Stats block is
   unchanged (it was already a scannable grid, the right shape for
   that content).

     1. Intro
        - Eyebrow "What We Do" + paragraph 1, in full (the
          /services sentence + the industries/services sentence),
          set large as the section's opening statement.
        - Filmstrip: four images at staggered heights, edge-to-edge
          — unchanged from the previous pass, per instruction to
          leave the images as they are and focus on layout only.
        - A quiet two-column split (light section, like the
          reference's "Philosophy" block): paragraph 2, in full
          (the "you don't have to rely on just one channel..."
          sentence + the how-it-comes-together sentence), paired
          with the supporting image — unchanged image.

     2. Stats — unchanged.

     3. Closing
        - The claim + explanation as ONE paragraph (large,
          centered), sr-only "Start here:" cue preserved at its
          start.
        - The CTA line + "Book a Strategy Call" button, in its own
          dark full-bleed band, kept as its own distinct block
          exactly as the source flow has it (separated by a blank
          line from the paragraph above it). Still points at
          /contact rather than the source's /services/#book-now,
          since no #book-now anchor exists anywhere in this
          codebase — same reasoning as the previous pass, unchanged.

   IMAGES — unchanged this pass
   ------------------------------------------------------------
   Filmstrip + split-block image still reuse the four existing
   /approach/technico-step-*.jpg photos, exactly as the previous
   pass left them — left alone per instruction.
   ================================================================ */

const STATS = [
  { value: "1.37M", label: "Employer Businesses In Canada" },
  { value: "$21.1B", label: "Canadian Digital Advertising Market" },
  { value: "+16%", label: "Digital Ad Market Growth In 2025" },
  {
    value: "#1",
    label: "Search Remains Canada\u2019s Largest Digital Ad Category",
  },
] as const;

/** Filmstrip images — decorative, staggered vertical offsets per cell. */
const FILMSTRIP = [
  { src: "/approach/technico-step-1.jpg", offset: "translate-y-0" },
  {
    src: "/approach/technico-step-2.jpg",
    offset: "translate-y-8 sm:translate-y-12",
  },
  {
    src: "/approach/technico-step-3.jpg",
    offset: "-translate-y-2 sm:-translate-y-4",
  },
  {
    src: "/approach/technico-step-4.jpg",
    offset: "translate-y-5 sm:translate-y-9",
  },
] as const;

export default function ServicesMarketOverview() {
  return (
    <>
      {/* Intro */}
      <section className="bg-white-bg">
        {/* Opening statement — paragraph 1, in full */}
        <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24 md:pt-28">
          <span className="mb-6 block font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
            What We Do
          </span>
          <p className="max-w-3xl font-mono text-xl leading-relaxed tracking-wide text-black-text uppercase text-pretty sm:text-2xl sm:leading-[1.4] md:text-[28px] md:leading-[1.4]">
            <span className="sr-only">Start here: </span>
            Technico Digital Solutions provides{" "}
            <Link
              href="/services"
              className="text-purple-secondary underline decoration-1 underline-offset-2 hover:text-purple-accent"
            >
              digital marketing services
            </Link>{" "}
            for businesses seeking to improve search visibility, reach qualified
            audiences, generate leads, and convert more online interactions into
            customers. Our digital experts support businesses across healthcare
            and dental, legal services, automotive, solar and renewable energy,
            construction, electrical, home improvement, and other local service
            industries through SEO, paid advertising, web design and
            development, content, and digital campaigns built around measurable
            business goals.
          </p>
        </div>

        {/* Filmstrip — unchanged from the previous pass */}
        <div className="mt-16 flex items-end gap-1.5 overflow-x-auto px-6 pb-3 sm:mt-20 sm:gap-2 sm:px-10 md:px-16">
          {FILMSTRIP.map((img) => (
            <div
              key={img.src}
              className={`relative h-36 w-36 flex-shrink-0 overflow-hidden sm:h-48 sm:w-48 md:h-60 md:w-60 ${img.offset}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="(min-width: 768px) 240px, (min-width: 640px) 192px, 144px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Quiet split — paragraph 2, in full, + the same supporting
            image as the previous pass. */}
        <div className="mt-16 grid grid-cols-1 gap-10 bg-[#f3f4ee] px-6 py-16 sm:mt-20 sm:px-10 sm:py-20 md:grid-cols-2 md:items-center md:gap-16 md:px-16 md:py-24">
          <div className="md:order-2">
            <p className="max-w-lg font-mono text-base leading-relaxed tracking-wide text-black-text uppercase text-pretty sm:text-lg md:text-xl">
              You don&rsquo;t have to rely on just one marketing channel to grow
              your business. We look at where your customers are searching, what
              they see when they land on your website, and how SEO, paid ads,
              content, social media, and email can work together to bring in
              leads and turn more of those leads into customers.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden md:order-1 md:aspect-[3/4]">
            <Image
              src="/approach/technico-step-2.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats — unchanged */}
      <section className="bg-black-bg">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 md:py-28">
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 bg-white" />
            <span className="font-mono text-xs tracking-[0.14em] text-white/70 uppercase text-balance sm:text-sm">
              The Canadian Market
            </span>
          </div>

          <TextRevealBlock
            as="h2"
            lines={[
              "Canadian Businesses Are Competing",
              "in a Digital-First Market",
            ]}
            className="mx-auto mt-6 max-w-3xl text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-white sm:mt-7 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]"
            scrollTrigger
          />

          <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 sm:mt-20 md:grid-cols-4 md:gap-6 md:divide-x md:divide-white/10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="md:px-6 md:first:pl-0 md:last:pr-0"
              >
                <p className="text-center text-4xl font-normal tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-center text-xs font-medium tracking-wide text-white/50 uppercase sm:mt-4 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-white-bg">
        {/* Claim + explanation — ONE paragraph, matching the real flow */}
        <div className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-24 sm:pb-20 md:pt-28">
          <p className="font-mono text-lg leading-relaxed tracking-wide text-black-text uppercase text-pretty sm:text-xl md:text-2xl md:leading-[1.4]">
            <span className="sr-only">Start here: </span>A website and a few
            social media accounts can give your business an online presence, but
            that doesn&rsquo;t automatically bring in customers, especially in a
            competitive market like Vancouver. That&rsquo;s where the digital
            marketers at Technico Digital Solutions come in. We look at how
            customers find your business, what happens when they reach your
            website, and where potential leads drop off. SEO, paid ads, content,
            and social media are then brought together to help local businesses
            like yours generate qualified leads, ecommerce stores attract more
            customers, and growing brands reach a wider audience across Canada.
          </p>
        </div>

        {/* Action step — its own block, exactly as the source flow has it
            separated from the paragraph above by a break. Kept as a
            high-contrast band so it reads as "now act". */}
        <div className="bg-black-bg px-6 py-16 text-center sm:py-20 md:py-24">
          <p className="mx-auto max-w-xl font-mono text-sm leading-loose tracking-wide text-white/70 uppercase text-pretty sm:text-base">
            We go the extra mile to help you fulfill your business plans with
            targeted digital marketing strategies. Partner with us today and see
            competitive results.
          </p>
          <div className="mx-auto mt-8 w-full max-w-xs sm:w-auto">
            <GlossyButton to="/contact">Book a Strategy Call</GlossyButton>
          </div>
        </div>
      </section>
    </>
  );
}
