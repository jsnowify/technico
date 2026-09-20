/**
 * Single source of truth for site-wide identity used by:
 *  - lib/seo.ts (Metadata / OpenGraph / Twitter cards)
 *  - app/sitemap.ts
 *  - app/robots.ts
 *  - components/seo/JsonLd.tsx usage across pages
 *
 * NOTE: I previously found two different domains hardcoded in this project
 * (lib/seo.ts used technicosolutions.com, sitemap.ts used
 * technicodigitalsolutions.com). Update SITE_URL below to your real domain —
 * everything else derives from this file so it can't drift again.
 */

import type { FaqItem } from "@/components/ui/FAQ";

export const SITE_NAME = "Technico Digital Solutions Inc.";
export const SITE_URL = "https://technicosolutions.com";
export const SITE_DESCRIPTION =
  "Digital solutions — web development, design, and technology consulting.";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";
export const TWITTER_HANDLE = "@technicosolutions";

/**
 * NAP (name/address/phone) contact details — kept here alongside
 * SITE_NAME/SITE_URL so every place that needs to display or link
 * to them (Organization JSON-LD in app/layout.tsx, Footer.tsx, the
 * contact page) reads the exact same values. Consistent NAP across
 * the site and structured data is itself an SEO/local-search signal,
 * so this shouldn't drift the way SITE_URL previously did.
 *
 * *_HREF versions are pre-formatted for tel:/mailto: — no spaces or
 * stray characters, since a malformed href silently breaks
 * click-to-call/click-to-email on mobile even though the visible
 * text still looks fine.
 */
export const SITE_PHONE = "+1 778-719-5588";
export const SITE_PHONE_HREF = "tel:+17787195588";

export const SITE_EMAIL = "info@technicosolutions.com";
export const SITE_EMAIL_HREF = "mailto:info@technicosolutions.com";

/**
 * TODO: replace with your real registered business address. This is
 * a placeholder — do not deploy with fake address data, since
 * incorrect NAP (name/address/phone) in structured data can get a
 * listing flagged or suppressed. Used by the LocalBusiness JSON-LD
 * in app/layout.tsx.
 */
export const SITE_ADDRESS = {
  streetAddress: "REPLACE_WITH_STREET_ADDRESS",
  addressLocality: "Vancouver",
  addressRegion: "BC",
  postalCode: "REPLACE_WITH_POSTAL_CODE",
  addressCountry: "CA",
};

/**
 * Regions called out in client testimonials (see FEEDBACK below) —
 * used as `areaServed` in the LocalBusiness JSON-LD so structured
 * data reflects where clients actually are, not just the HQ city.
 */
export const SERVICE_AREAS = [
  "Vancouver, BC",
  "Calgary, AB",
  "Maple Ridge, BC",
  "Alberta",
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/technicosolutions",
  linkedin: "https://www.linkedin.com/company/technicosolutions",
} as const;

/**
 * Content for the reusable Questions & Answers interaction
 * (components/home/QuestionsAnswers.tsx). Copy is supplied verbatim —
 * do not rewrite, shorten, or paraphrase it here.
 */
export interface QuestionAnswer {
  question: string;
  answer: string;
}

export const QUESTIONS_ANSWERS: QuestionAnswer[] = [
  {
    question: "Are you experiencing low website traffic?",
    answer:
      "Low website traffic is most often caused by weak SEO foundations, insufficient content output, or misaligned keyword targeting, all of which are fixable with the right strategy. If your pages aren’t ranking, visitors aren’t finding you, and every day without action widens the gap between you and your competitors.",
  },
  {
    question:
      "Do you find building and engaging a meaningful audience on social media platforms challenging?",
    answer:
      "A meaningful social media audience grows through consistent posting schedules, platform-specific content formats, and genuine two-way engagement, not follower counts alone. Without a structured approach, even active accounts struggle to convert followers into customers.",
  },
  {
    question:
      "Is your website design outdated or not user-friendly, leading to a poor user experience?",
    answer:
      "An outdated or difficult-to-navigate website directly increases bounce rates and reduces conversions. Google’s Core Web Vitals now factor page experience into search rankings. Visitors form an opinion about your site in under a second, and a poor first impression sends them straight to a competitor.",
  },
  {
    question:
      "Are you struggling to create high-quality and engaging content for your digital channels consistently?",
    answer:
      "Consistent, high-quality content requires a documented strategy, a repeatable production workflow, and clear alignment between audience intent and business goals. Without that structure, content output becomes sporadic and fails to build the authority your brand needs to compete.",
  },
  {
    question:
      "Do you lack clear visibility into your digital marketing efforts' return on investment (ROI)?",
    answer:
      "Clear ROI visibility in digital marketing comes from properly configured tracking, defined KPIs, and attribution models that connect campaigns directly to revenue outcomes. Without that data, budget decisions are guesswork, and underperforming channels continue to drain resources undetected.",
  },
];

/**
 * Content for the homepage FAQ section, rendered via the shared
 * components/ui/FAQ.tsx directly in app/page.tsx. This is a
 * separate section from QUESTIONS_ANSWERS above — that block is the
 * "Question & Answer" section higher up the page, while this is the
 * dedicated FAQ section (11th section on the homepage). Copy is
 * supplied verbatim — do not rewrite, shorten, or paraphrase it here.
 *
 * `FaqItem` itself lives in components/ui/FAQ.tsx — the shared FAQ
 * component used by home, services, and blog posts — and is just
 * re-exported here so existing imports of `FaqItem` from this file
 * keep working.
 */
export type { FaqItem };

export const FAQS: FaqItem[] = [
  {
    question:
      "What type of clients does your digital marketing agency Canada work with?",
    answer:
      "Technico Digital Solutions works with small to medium-sized businesses across Canada that want to grow through data-driven digital strategies. Our clients include law firms, solar companies, trades businesses, dental clinics, e-commerce brands, and industries where targeted campaigns, SEO, and content directly move the needle. If your business needs a full digital strategy or support in one specific area, we tailor our services to fit your goals and budget.",
  },
  {
    question: "What is the strongest marketing tactic?",
    answer:
      "The strongest marketing tactic for most businesses today is a combined digital marketing strategy that pairs SEO, paid ads, social media, and email into one unified approach. Each channel reinforces the others: SEO builds long-term visibility while paid ads deliver immediate traffic, and email marketing converts the audience both bring in. Paid search works especially well when supported by organic efforts to attract more customers and keep your brand visible in an increasingly complex landscape. By analyzing performance data, businesses can adjust campaigns for better results and stronger lead generation.",
  },
  {
    question: "Which is better, SEO or PPC?",
    answer:
      "SEO is better for long-term, sustainable growth, while PPC is better when you need fast, targeted traffic. But the strongest results come from running both together. SEO (including search campaigns) builds compounding organic visibility over time, meaning your rankings keep working without ongoing ad spend. PPC or paid ads put you in front of the right audience immediately, but stop the moment your budget does. At Technico Digital Solutions, we combine both methods so clients aren’t dependent on one channel to drive results.",
  },
  {
    question: "How do digital marketing companies help start-up businesses?",
    answer:
      "Digital marketing agencies help startups compete from day one by giving them immediate access to SEO specialists, paid ad managers, content strategists, and web designers, without the cost of hiring each role in-house. For a new business with a lean team and limited budget, that means professional-grade campaigns, faster brand visibility, and growth strategies that scale as revenue grows. Instead of spending months building internal capacity, startups can focus on their product while an agency drives the traffic and leads.",
  },
  {
    question: "Is digital marketing different from traditional marketing?",
    answer:
      "Digital marketing differs from traditional marketing in how it reaches and measures audiences. Traditional marketing relies on print, TV, or radio ads, while digital marketing uses online platforms for real-time results. Besides SEO, web development, and paid advertising, it includes strategies like influencer marketing to build brand trust through social media and performance marketing to track data, clicks, and conversions. Digital campaigns are more flexible, measurable, and cost-effective than traditional methods.",
  },
];

/**
 * Content for the /services page FAQ section, rendered via the
 * shared components/ui/FAQ.tsx directly in app/services/page.tsx.
 * Separate from FAQS above, which is the homepage FAQ — this is the
 * FAQ block scoped to /services. Uses the same FaqItem shape (plain
 * string answer) as FAQS above, for consistency with the rest of
 * this file. Copy is supplied verbatim — do not rewrite, shorten,
 * or paraphrase it here.
 */
export const SERVICES_FAQS: FaqItem[] = [
  {
    question: "Would my business benefit from digital marketing strategies?",
    answer:
      "Yes, very much. Online marketing helps you reach a broader audience, increase brand visibility, and drive sales. Let’s tailor strategies to your specific needs, so you can connect with potential customers and stay competitive.",
  },
  {
    question: "How does digital marketing bring measurable results?",
    answer:
      "Digital agencies like Technico Digital Solutions track key performance indicators (KPIs) such as website traffic, lead generation, and conversion rates. We use data-driven strategies to optimize campaigns to make sure the efforts align with your business objectives. By regularly monitoring these KPIs, we adjust tactics for continuous improvement and measurable success.",
    link: {
      label: "website traffic",
      href: "https://www.wix.com/encyclopedia/definition/website-traffic",
    },
  },
  {
    question: "Are digital marketing services ideal for start-up businesses?",
    answer:
      "Yes, marketing services are perfect for startup businesses looking to generate leads and gain more business. If you’re a small startup or a medium-sized business, our services help increase visibility, attract customers, and drive growth. With our strong digital strategy, you can compete effectively and expand faster.",
    link: {
      label: "generate leads",
      href: "https://digitalmarketinginstitute.com/blog/how-to-generate-high-quality-leads",
    },
  },
  {
    question: "Why is digital marketing important for brand recognition?",
    answer:
      "Digital marketing (aka online marketing) is vital for brand recognition because it helps your brand reach a wider audience through multiple digital channels. By using targeted campaigns, content creation, and social media strategies, digital marketing increases visibility, engages potential customers, and strengthens brand presence.",
    link: {
      label: "online marketing",
      href: "https://www.coursera.org/articles/online-marketing",
    },
  },
];

/**
 * Content for the homepage services list (components/home/Services.tsx).
 * Copy is supplied verbatim — do not rewrite, shorten, or paraphrase it
 * here.
 *
 * `shortTitle` is a display-only abbreviation for contexts with limited
 * width (the large list labels and the "READ ..." card in
 * components/home/Services.tsx) — `title` stays the full name used
 * everywhere else (ContactForm.tsx's service dropdown, /services page
 * headers).
 *
 * `icon` paths are the existing files already in /public — nothing
 * to upload, just referenced by path:
 *   /technico-digital-solutions-inc-seo.png
 *   /technico-digital-solutions-inc-website-development.png
 *   /technico-digital-solutions-inc-creative-design.png
 *   /technico-digital-solutions-inc-media-buying.png
 *   /technico-digital-solutions-inc-social-media-management.png
 *   /technico-digital-solutions-inc-email-marketing.png
 *
 * `href` points every card at /services for now — the per-service
 * detail pages in lib/content/services.ts don't have matching slugs
 * yet (that file currently only has "web-development" and
 * "digital-consulting" as placeholders), so linking to real,
 * non-matching slugs would 404. Swap in `/services/${slug}` once
 * those six services exist there.
 *
 * NOTE on the Media Buying bullets: the source copy had a trailing
 * "SEM (Search Engine Marketing) >" arrow on those three items only
 * (the other five cards' bullets don't have one). Since every
 * bullet across all six cards already gets a "> " marker rendered by
 * Services.tsx itself, that trailing arrow was dropped here to avoid
 * a doubled "> ... >" — the wording is otherwise untouched.
 */
export interface Service {
  title: string;
  shortTitle: string;
  description: string;
  bullets: string[];
  icon: string;
  href: string;
}

export const SERVICES: Service[] = [
  {
    title: "SEO (Search Engine Optimization)",
    shortTitle: "SEO",
    description:
      "Let’s get your business found online. Our SEO work improves your search visibility through data, structure, and creative content. Every strategy we build aims to drive organic traffic, attract qualified leads, and improve long-term rankings. Our SEO process includes:",
    bullets: [
      "Keyword research and competitor analysis",
      "On-page and technical SEO optimization",
      "Link building and authority growth",
      "Content planning based on user intent",
    ],
    icon: "/technico-digital-solutions-inc-seo.png",
    href: "/services/search-engine-optimization",
  },
  {
    title: "Website Development & Design",
    shortTitle: "Web Development",
    description:
      "Make your website fast, functional, and easy to use. Every project starts with a plan that matches your brand and supports your digital goals. Each page loads quickly, guides users naturally, and helps convert visitors into customers. With our web services, expect:",
    bullets: [
      "Custom website design and layout",
      "Mobile and SEO-friendly development",
      "UI/UX design focused on smooth navigation",
      "Security setup and performance testing",
    ],
    icon: "/technico-digital-solutions-inc-website-development.png",
    href: "/services/website-design-and-development",
  },
  {
    title: "Creative Design & Content Services",
    shortTitle: "Creative Design",
    description:
      "We combine visual creativity with strategic content planning. Every piece we create solidifies your brand and connects with your target market. From ad visuals to website copy, we keep your tone consistent and your message clear. Our creative digital marketing services cover:",
    bullets: [
      "Graphic design and marketing visuals",
      "Branding, digital signage, & logo development",
      "Copywriting and blog content creation",
      "Integrated campaign visuals & promotional assets",
    ],
    icon: "/technico-digital-solutions-inc-creative-design.png",
    href: "/services/creative-design-and-content",
  },
  {
    title: "Media Buying & Digital Advertising",
    shortTitle: "Advertising",
    description:
      "We plan, manage, and optimize campaigns that bring impressive results. Our team uses data-backed strategies to make every ad dollar count. From keyword targeting to audience segmentation, each decision is made with performance in mind. Our focus areas include:",
    bullets: [
      "SEM (Search Engine Marketing)",
      "PPC (Pay-Per-Click) Marketing",
      "Social Media Marketing",
    ],
    icon: "/technico-digital-solutions-inc-media-buying.png",
    href: "/services/advertising",
  },
  {
    title: "Social Media Management",
    shortTitle: "Social Media",
    description:
      "We create, manage, and maintain a consistent brand identity across all your social platforms. Each post, story, and caption is based on a clear content plan that supports your business goals. Every piece of content adds value and strengthens your social media presence. Our approach covers:",
    bullets: [
      "Content scheduling and publishing",
      "Audience engagement and review response",
      "Trend-based updates to keep your feed relevant",
      "Performance tracking with monthly insights",
    ],
    icon: "/technico-digital-solutions-inc-social-media-management.png",
    href: "/services/social-media-management",
  },
  {
    title: "Email Marketing",
    shortTitle: "Email Marketing",
    description:
      "Connect directly with your target audience through our strategic email campaigns. From welcome emails to follow-up messages, our team creates every campaign to get responses. We keep messages concise, relevant, and consistent so your brand stays top of mind. For consistent results, our digital marketing services include:",
    bullets: [
      "List management & audience segmentation",
      "A/B testing to improve open & click rates",
      "Content planning & personalized email templates",
      "Reporting that shows campaign outcomes",
    ],
    icon: "/technico-digital-solutions-inc-email-marketing.png",
    href: "/services/email-marketing",
  },
];

/**
 * Content for the partner-logo checkerboard grid
 * (components/home/Partners.tsx).
 *
 * `logo` paths assume files live at /public/partners/ named to match
 * the source Figma layers (technico-partners-1.png … -13.png), in
 * the same left-to-right, top-to-bottom order as the approved
 * layout. Rename these if the actual filenames in /public/partners/
 * differ.
 */
export interface Partner {
  name: string;
  logo: string;
}

export const PARTNERS: Partner[] = [
  { name: "Victoria Steel Stud", logo: "/partners/technico-partners-1.png" },
  {
    name: "Coquitlam Solar Energy",
    logo: "/partners/technico-partners-2.png",
  },
  { name: "NG Sidhu Law", logo: "/partners/technico-partners-3.png" },
  { name: "AutoFlow Car Rental", logo: "/partners/technico-partners-4.png" },
  {
    name: "Vancouver Steel Stud Framing",
    logo: "/partners/technico-partners-5.png",
  },
  {
    name: "Victoria Deck and Fence",
    logo: "/partners/technico-partners-6.png",
  },
  {
    name: "MapleRidge Fence & Deck",
    logo: "/partners/technico-partners-7.png",
  },
  {
    name: "AutoFlow Car Wash & Detailing",
    logo: "/partners/technico-partners-8.png",
  },
  { name: "Mag Solar", logo: "/partners/technico-partners-9.png" },
  { name: "Sidhu Lawyers", logo: "/partners/technico-partners-10.png" },
  {
    name: "Abbotsford Solar Installation",
    logo: "/partners/technico-partners-11.png",
  },
  {
    name: "Westgate Dental Centre",
    logo: "/partners/technico-partners-12.png",
  },
  {
    name: "Fade O'Clock Barbershop",
    logo: "/partners/technico-partners-13.png",
  },
];

/**
 * Content for the "Trusted by" logo loop (components/home/TrustedBy.tsx).
 *
 * These are hosted on Cloudinary rather than /public — no company names
 * were supplied alongside the images, so `alt` is left empty (the logos
 * are decorative here; the section's "Trusted by" heading already carries
 * the meaning for assistive tech).
 */
export interface TrustedBrand {
  logo: string;
  /** Optional — used as the `<img>` alt text. Left unset for the
   * decorative, forced-white brand marks (tool/trusted-by logos),
   * but set for real client project photos so they get meaningful
   * alt text instead of "". */
  name?: string;
}

export const TRUSTED_BY: TrustedBrand[] = [
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526316/trusted/technico-trusted-by-1_r1j2kq.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526316/trusted/technico-trusted-by-2_vtqyly.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-3_cxj5my.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-4_ds72ds.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526316/trusted/technico-trusted-by-5_sbmbc9.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-6_yewoz3.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-7_iupzeh.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-8_zza1hu.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-9_ceji5a.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-10_hwtenh.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526317/trusted/technico-trusted-by-11_dadypu.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526318/trusted/technico-trusted-by-12_zzhke2.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788526318/trusted/technico-trusted-by-13_wqkkvw.png",
  },
];

/**
 * Content for the "Technologies We Use To Build Your Website" logo loop
 * (components/services/TechStack.tsx) — same marquee mechanics as
 * TrustedBy above, reused for the services page's tech-stack section.
 *
 * These logos come in as full-color brand marks, so each URL carries a
 * Cloudinary transformation (`e_colorize:100,co_white`, plus `w_240` +
 * `q_auto,f_auto` for size) that bakes the white recolor in server-side
 * — once, ahead of time — instead of a live CSS `filter` the browser
 * would otherwise have to composite every animation frame across all
 * 72 on-screen clones. That's also why these render identically to
 * TRUSTED_BY's already-white sources: no runtime filter on either.
 */
export const TECH_STACK: TrustedBrand[] = [
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781032/technico-technology/technico-technology-7_ls1ld3.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781031/technico-technology/technico-technology-8_woger0.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781030/technico-technology/technico-technology-6_ssmpdx.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781030/technico-technology/technico-technology-5_tgbeed.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781029/technico-technology/technico-technology-3_ga5zxi.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781029/technico-technology/technico-technology-4_vjj9kl.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781028/technico-technology/technico-technology-2_ldwpxt.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781028/technico-technology/technico-technology-1_rx9uaj.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781028/technico-technology/technico-technology-12_rfk815.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781027/technico-technology/technico-technology-9_tczy0k.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781027/technico-technology/technico-technology-10_onq83n.png",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/w_240,q_auto,f_auto,e_colorize:100,co_white/v1788781026/technico-technology/technico-technology-11_kcdzw2.png",
  },
];

/**
 * Content for the Graphic Design service's "recent work" logo loop
 * — same marquee component (components/services/TechStack.tsx) as
 * TECH_STACK above, but rendered as its own separate strip via that
 * component's `items`/`heading` props, not mixed into TECH_STACK.
 * No `e_colorize` transform on these URLs, so they render in their
 * real color rather than the forced white treatment above.
 */
export const GRAPHIC_DESIGN_WORK: TrustedBrand[] = [
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788842782/temporary-placeholder/mr-fence_fku9lz.jpg",
    name: "Mr. Fence",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788842783/temporary-placeholder/up-islang-roofing_w6k2rn.jpg",
    name: "Up Island Roofing",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788842784/temporary-placeholder/up-island-junk_yv8wi4.jpg",
    name: "Up Island Junk",
  },
  {
    logo: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788842786/temporary-placeholder/essence-of-detail_hsg4kw.jpg",
    name: "Essence of Detail",
  },
];

/**
 * Content for the "Our Proven Approach" step tabs
 * (components/home/Approach.tsx). Copy is supplied verbatim — do not
 * rewrite, shorten, or paraphrase it here.
 *
 * `image` paths assume files live at /public/approach/ named
 * technico-approach-1.jpg … -4.jpg, in Step 1 → Step 4 order. Rename
 * these if the actual filenames in /public/approach/ differ.
 */
export interface ApproachStep {
  step: string;
  title: string;
  description: string;
  image: string;
}

export const APPROACH_STEPS: ApproachStep[] = [
  {
    step: "Step 1",
    title: "Strategy Call",
    description:
      "Understand your current business objectives, challenges, and what you aim to achieve through digital marketing. We discuss your target audience, customer demographics, behaviour patterns, and preferences to tailor marketing strategies effectively. Review competitors in your industry to identify strengths, weaknesses, and opportunities for differentiation.",
    image: "/approach/technico-step-1.jpg",
  },
  {
    step: "Step 2",
    title: "Audit and Customer Value Mapping",
    description:
      "We examine your website to evaluate its performance, user experience, navigation, loading speed, mobile-friendliness, and design. Our team will analyze your SEO strategy, including keyword usage, on-page optimization, backlink profile, and local SEO considerations. Our SEO team will compile a detailed audit report with recommendations to optimize your digital marketing efforts.",
    image: "/approach/technico-step-2.jpg",
  },
  {
    step: "Step 3",
    title: "3-Month Plan Pitch & Build",
    description:
      "You will receive a detailed 3-month plan outlining specific strategies, tactics, and objectives aligned with your business goals. Once the plan is approved, our team will begin setting up campaigns across various platforms, including SEO, PPC advertising, social media, email marketing, content creation, and more. Campaigns will be executed according to the agreed-upon timeline.",
    image: "/approach/technico-step-3.jpg",
  },
  {
    step: "Step 4",
    title: "Test, Run, Optimize",
    description:
      "We launch digital marketing campaigns across various platforms, such as search engines, social media channels, email newsletters, and other relevant channels based on the agreed-upon strategy. We closely monitor key performance indicators (KPIs) to track the effectiveness of each campaign. Our marketers will analyze metrics such as organic traffic, conversion, click-through rates, cost per acquisition, etc.",
    image: "/approach/technico-step-4.jpg",
  },
];

/**
 * Content for the client-feedback marquee (components/home/Feedback.tsx).
 * Copy is supplied verbatim — do not rewrite, shorten, or paraphrase it.
 *
 * `image` paths assume files live at /public/feedback/ named
 * technico-feedback-1.jpg … -5.jpg, matching this array's order.
 */
export interface FeedbackItem {
  name: string;
  image: string;
  quote: string;
}

export const FEEDBACK: FeedbackItem[] = [
  {
    name: "MAG Solar",
    image: "/feedback/technico-feedback-1.jpg",
    quote:
      "Improved search visibility and local engagement resulted in a steady increase in qualified leads and installation inquiries. MAG Solar experienced consistent monthly leads for its residential solar system projects.",
  },
  {
    name: "Auburn Bay Dental",
    image: "/feedback/technico-feedback-2.jpg",
    quote:
      "Optimized digital presence increased appointment bookings and local engagement for Auburn Bay Dental. The clinic experienced better search performance and more patient visits from SE Calgary and nearby communities.",
  },
  {
    name: "AutoFlow Car Rental",
    image: "/feedback/technico-feedback-3.jpg",
    quote:
      "Targeted digital strategies helped AutoFlow Car Rental boost online reservations and customer retention. The brand achieved higher search rankings and improved conversion rates from regional and international traffic.",
  },
  {
    name: "Westgate Dental Centre",
    image: "/feedback/technico-feedback-4.jpg",
    quote:
      "SEO-optimized content and search visibility elevated Westgate Dental Centre’s patient reach. The clinic recorded consistent growth in appointment requests and online reputation improvements in Maple Ridge and beyond.",
  },
  {
    name: "Sidhu Personal Injury Lawyers",
    image: "/feedback/technico-feedback-5.jpg",
    quote:
      "Strategic content optimization expanded Sidhu Personal Injury Lawyers’ client base in Alberta. The firm noted measurable growth in case consultations and stronger regional recognition in personal injury law.",
  },
];

/**
 * Content for the qualifying-questions grid
 * (components/home/Qualify.tsx). Copy is supplied verbatim — do not
 * rewrite, shorten, or paraphrase it here.
 */
export interface QualifyingQuestion {
  question: string;
  answer: string;
}

export const QUALIFYING_QUESTIONS: QualifyingQuestion[] = [
  {
    question:
      "Are you a business seeking rapid, consistent, and repeatable profit growth?",
    answer:
      "Search engine optimization and targeted digital marketing are proven drivers of scalable revenue. Now, it's easier to convert visibility into measurable results.",
  },
  {
    question:
      "Do you aim to dominate your local market, compete with larger corporations, or establish a national or international brand presence?",
    answer:
      "Local SEO, authority-building content, and multi-channel campaigns are what close the gap between small businesses and industry leaders, regardless of budget.",
  },
  {
    question:
      "Do you want to expand your customer base and attract new clients?",
    answer:
      "The most effective way to do that today is through search-optimized content, paid ads, and conversion-focused landing pages that work around the clock.",
  },
  {
    question:
      "Are you looking to establish a reliable and sustainable business generation funnel to ensure continuous growth and success?",
    answer:
      "A well-structured digital marketing funnel that combines SEO, lead nurturing, and retargeting turns one-time visitors into long-term clients.",
  },
];

export interface QuickTimezone {
  value: string; // IANA identifier, e.g. "America/Vancouver"
  label: string;
}

/**
 * Shortlist shown at the top of the "Schedule a call" time zone
 * picker (components/forms/TimezonePicker.tsx) before the visitor
 * types anything — matches SITE_PHONE's BC area code, i.e. the
 * zones our own team is actually in. This used to be the *entire*
 * time zone field (a plain <select> of just these six, "Other"
 * included), which quietly assumed a North American visitor. The
 * picker now searches the full IANA zone list; this shortlist is
 * only a one-click convenience for the common case, so "Other" no
 * longer needs its own entry — search covers it.
 */
export const QUICK_TIMEZONES: QuickTimezone[] = [
  { value: "America/Vancouver", label: "Pacific Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/Toronto", label: "Eastern Time" },
  { value: "America/Halifax", label: "Atlantic Time" },
];

export interface TimeSlotOption {
  value: string;
  label: string;
}

/**
 * Half-hour call slots, 9:00 AM–4:30 PM in the timezone the visitor
 * selects above. `value` stays 24-hour for easy server-side parsing;
 * `label` is what's actually shown.
 */
export const TIME_SLOTS: TimeSlotOption[] = [
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
];
