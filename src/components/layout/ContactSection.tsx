import ContactForm from "@/components/forms/ContactForm";

/* ================================================================
   CONTACT SECTION (global, last section on every page)
   ================================================================
   Lives in components/layout/ alongside Header/Footer rather than
   components/home/ because it's rendered once, globally, from
   app/layout.tsx — every current and future page automatically gets
   it as its final section without being added to each page.tsx
   individually.

   Headline + subcopy now live here instead of on app/contact/page.tsx
   — that page used to render its own "Contact" H1 + intro line right
   above where this section lands, which meant two separate headings
   stacked on top of each other on /contact specifically, while every
   other page got the form with no lead-in at all. Centralizing the
   headline here (styled exactly like every home/ section's own
   eyebrow-less headline + subcopy pair — see Approach.tsx/Qualify.tsx
   for the same `text-white` / `text-white/50` treatment on
   `bg-black-bg`) gives every page, /contact included, the same
   consistent lead-in before the form.

   Dark theme: `bg-black-bg`, matching Hero.tsx / Discuss.tsx
   elsewhere on the site, so this hands off cleanly into the
   Footer's own dark bar instead of wedging a bright white section
   between two dark ones. No boxed/bordered card around the form —
   just the section's own black, with each individual field still
   carrying its own hairline border — so the page reads as one open,
   uncluttered surface rather than a form sitting inside a frame.

   Widened to max-w-6xl — the same container width every other
   section on the site uses (Overview, Services, Strategy, Partners,
   FAQ, Feedback, QuestionsAnswers, Approach all sit inside max-w-6xl).
   Contact was the one outlier stuck at max-w-5xl, which pinched
   ContactForm's desktop two-column layout — calendar on the left,
   the rest of the fields on the right — into a narrower measure than
   the rest of the page uses, instead of giving it the same room to
   breathe.
   ================================================================ */

export default function ContactSection() {
  return (
    <section className="border-t border-white/10 bg-black-bg">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28 md:py-32">
        {/* Headline */}
        <h2 className="mx-auto max-w-3xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-white sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          Let&rsquo;s Discuss Your Project
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-loose text-white/50 text-pretty sm:mt-8 sm:text-base">
          Improve search engine rankings and organic visibility by identifying
          opportunities.
        </p>

        <div className="mt-16 sm:mt-20 md:mt-24">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
