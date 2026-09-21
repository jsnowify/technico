import type { Service } from "@/lib/content/types";
import { SITE_PHONE_HREF } from "@/lib/constants";

/**
 * Hardcoded for now. Swap the array below for a CMS/markdown fetch later —
 * getAllServices() and getServiceBySlug() are already async so calling code
 * (sitemap.ts, app/services/**) won't need to change.
 *
 * Each service's `sections` array is independent — services are not
 * required to use the same block types, count, or order as each
 * other. See lib/content/types.ts (ServiceSection) for what's
 * available, and app/services/[slug]/page.tsx for how the array is
 * rendered.
 *
 * -----------------------------------------------------------------
 * CONTENT WORKFLOW — read before editing a service entry
 * -----------------------------------------------------------------
 * This is a rebuild of the client's existing site. There are six
 * services total: SEO, Web Development, Content Services,
 * Advertising, Social Media Management, Email Marketing. Each one's
 * real content is different from the others in both substance and
 * structure — there is no shared template to fill in ("ganto ganyan"
 * across all six). That's why `sections` is a block array instead of
 * a fixed set of named fields: a service can use any subset of block
 * types, in any order, or none at all yet.
 *
 * Content per service comes from the client/user, not invented here.
 * Concretely:
 *   - Don't write marketing copy, stats, results numbers, or FAQ
 *     answers for a service ahead of being given that service's
 *     actual content. A service with no `sections` yet (see
 *     "website-design-and-development" below) is meant to stay that
 *     way — plain title/shortDescription fallback on its page —
 *     until real content is provided.
 *   - `search-engine-optimization` is the one exception: its
 *     `sections` are already real, client-approved copy carried over
 *     from the previous build, not authored here.
 *   - When content for a service is provided, map it into whichever
 *     existing ServiceSection block types fit (hero/cta/highlights/
 *     conversion/insights/results/growBusiness/faq). If the content
 *     genuinely doesn't fit any existing block, add a new variant to
 *     ServiceSection in lib/content/types.ts rather than forcing it
 *     into the wrong shape.
 */
const services: Service[] = [
  {
    slug: "search-engine-optimization",
    title: "SEO",
    subtitle: "Search Engine Optimization (SEO)",
    quote: "Drive organic traffic and get quality leads",
    shortDescription:
      "Search engine optimization that drives organic traffic and qualified leads.",
    description: [
      "We at Technico Digital Solutions starts SEO work by looking at how your website currently performs in search, what your potential customers are searching for, and which competitors are taking visibility you could be capturing. Our team audits the site's technical setup, existing pages, keyword targeting, content, and backlink profile to identify where improvements can have the most impact.",
      "From there, Technico's digital marketers build the SEO work around the searches that matter to your business. That can include improving service and location pages, fixing on-page and technical issues, creating content around relevant search queries, strengthening internal linking, and building external authority. Performance is tracked over time to see which pages and keywords are gaining visibility and where further optimisation is needed. SEO services include",
    ],
    tags: [
      "Keyword Research",
      "Off-Page SEO",
      "On-Page SEO",
      "Content Strategy",
      "SEO Audits",
    ],
    process: [
      {
        step: "Audit",
        description:
          "We review the site's technical health, existing pages, keyword targeting, content, and backlink profile to see where the biggest opportunities are.",
      },
      {
        step: "Strategy",
        description:
          "We map the audit findings to the searches that matter for your business, prioritizing the pages and keywords with the strongest potential.",
      },
      {
        step: "Execution",
        description:
          "We fix on-page and technical issues, build out content, and strengthen internal linking and external authority around that plan.",
      },
      {
        step: "Track & Refine",
        description:
          "We monitor rankings and traffic over time, adjusting the plan as pages and keywords gain (or need) further optimization.",
      },
    ],
    sections: [
      {
        type: "hero",
        eyebrow: "Search Engine Optimization",
        headline:
          "Search engine optimization services built for Canadian businesses",
        paragraphs: [
          {
            text: "Get found locally. Grow your business nationally. Struggling to turn website traffic into actual sales? Technico Digital Solutions provides search engine optimization services in Canada to help your business get found by the right people and turn search visibility into quality leads.",
            link: {
              label: "search engine optimization services",
              href: "https://technicosolutions.com/services/search-engine-optimization/",
            },
          },
          {
            text: "Our SEO services include keyword research, technical SEO, on-page and off-page SEO, link building, local SEO, international SEO, and ongoing optimization. We use these strategies to improve how search engines understand, rank, and surface your website for searches that matter to your business. Instead of chasing traffic for the sake of traffic, our SEO strategists focus on building visibility, authority, and engagement with your target market.",
          },
        ],
      },
      {
        type: "cta",
        title: "Ready to see results?",
        description:
          "Get a personalized SEO strategy that helps your business rank higher, attract more visitors, and increase revenue.",
        cta: { label: "Get Your Custom SEO Plan", href: "/contact" },
      },
      {
        type: "highlights",
        eyebrow: "Custom SEO",
        headline: "Custom SEO services that align with your business goals",
        paragraph:
          "Let our search engine optimization (SEO) services help your business climb the search engine results pages (SERPs) and reach your target audience.",
        cta: { label: "Get Custom SEO", href: "/contact" },
        items: [
          {
            icon: 0,
            title: "Keyword research",
            description:
              "Keyword research identifies the search terms your target market uses to find products, services, and information related to your business. From there, we strategically optimize your web pages with targeted keywords to improve your rankings and make sure your content resonates with the right audience.",
          },
          {
            icon: 1,
            title: "Link building",
            description:
              "Link building helps strengthen your website’s authority by earning quality backlinks from relevant and trusted websites. Our link-building strategy focuses on securing quality backlinks from trusted websites in your industry. These links will boost your authority and help your business rank higher on search results. By using white-hat SEO techniques, your rankings grow naturally and sustainably.",
          },
          {
            icon: 2,
            title: "Technical SEO",
            description:
              "Technical SEO improves how search engines crawl, index, and understand your website. Our technical SEO services include site audits, fixing technical errors, and addressing issues that slow down your website. By improving your site’s performance, we make it easier for search engines to crawl your content and increase your brand visibility across search engines.",
          },
          {
            icon: 3,
            title: "Local SEO",
            description:
              "Local SEO helps your business appear in search results when potential customers look for services in your area. We optimize your Google Business Profile and other local search signals to improve your visibility for nearby searches, attract high-intent traffic, and grow your local presence.",
          },
          {
            icon: 4,
            title: "International SEO",
            description:
              "International SEO helps search engines serve the right version of your website to users in different countries, regions, and languages. We optimize your website for international search visibility so you can expand your reach across markets without losing focus on the customers most relevant to your business.",
          },
          {
            icon: 5,
            title: "On-page SEO",
            description:
              "On-page SEO optimizes individual web pages so search engines can better understand their content and users can find relevant information. We fine-tune elements such as page content, title tags, meta descriptions, and other on-page signals to improve your website’s relevance and visibility in search results.",
          },
          {
            icon: 6,
            title: "Off-page SEO",
            description:
              "Off-page SEO builds your website’s authority and reputation through signals beyond your own website. This can include link building, digital mentions, reputation management, and other strategies that strengthen your website’s credibility and support higher search rankings.",
          },
          {
            icon: 7,
            title: "White hat SEO",
            description:
              "White hat SEO uses search optimization techniques that follow search engine guidelines and focus on sustainable organic growth. We avoid keyword stuffing and black-hat tactics and focus instead on useful content, relevant optimization, and strategies intended to build lasting search visibility.",
            link: {
              label: "White hat SEO",
              href: "https://ahrefs.com/blog/white-hat-seo/",
            },
          },
        ],
      },
      {
        type: "conversion",
        headline:
          "Maximize conversions and turn organic\ntraffic into paying customers",
        description:
          "Getting traffic to your site is great. But the challenge is turning that traffic into real customers. Our SEO solutions don't just bring visitors, but guide them to take action. With the right website content and a deep dive into Google Analytics, we tweak every page to align with Google rankings and turn those clicks into sales.",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960443/services-seo-imgs/technico_maximize_conversions_xw9xqm.png",
          alt: "Maximizing conversions to turn organic traffic into paying customers",
        },
        features: [
          { text: "Optimized user experience to keep visitors engaged." },
          { text: "Clear, compelling CTAs to lead them to conversion." },
          {
            text: "Conversion rate optimization (CRO) tactics to boost ROI.",
            link: {
              label: "Conversion rate optimization",
              href: "https://digitalmarketinginstitute.com/blog/what-is-conversion-rate-optimization-cro",
            },
          },
        ],
      },
      {
        type: "cta",
        title: "Stop wasting traffic!",
        description:
          "Maximize your SEO efforts with data-driven insights and actionable strategies to convert visitors into loyal customers.",
        cta: {
          label: "Secure Your Free Strategy Consultation Today",
          href: "/contact",
        },
        spacing: "compact",
      },
      {
        type: "insights",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960444/services-seo-imgs/technico_seo_success_ulbbcw.png",
          alt: "SEO success driven by clear, actionable insights",
        },
        headline:
          "SEO success with clear, actionable insights – that's our commitment",
        intro:
          "We don't want to keep you guessing if SEO works. Our SEO specialists guarantee you're always in the loop, with insights that help keep your site climbing the ranks and delivering results. You can track everything: search engine rankings, traffic, and engagement. You get:",
        items: [
          {
            title: "Detailed SEO reporting & performance tracking",
            description:
              "Keep your SEO campaign transparent with detailed monthly reports that show exactly how your website is performing. Our SEO specialists track keyword rankings, organic traffic, engagement, conversions, and other important performance indicators to measure progress. Each report provides clear insights and recommendations so you understand what is driving results and where your campaign needs improvement.",
          },
          {
            title: "Continuous SEO optimization & strategy refinement",
            description:
              "SEO requires ongoing adjustments as search trends, competitors, algorithms, and your website performance change. Our SEO team continuously analyzes campaign data to identify opportunities and refine your strategy. From technical SEO and on-page optimization to content updates and keyword targeting, we make data-driven improvements designed to strengthen rankings, increase qualified traffic, and improve your website's search performance.",
          },
          {
            title: "Custom SEO strategies & actionable recommendations",
            description:
              "Your Vancouver business, audience, and competitive landscape are unique, so your SEO strategy should not follow a one-size-fits-all approach. We use your performance data, market insights, and search behaviour to develop and adjust a customized SEO strategy around your business goals. You receive actionable recommendations that help prioritize the right keywords, content opportunities, technical improvements, and optimization efforts for sustainable organic growth.",
          },
        ],
      },
      {
        type: "cta",
        title: "Your loyal customers know you. New customers don't.",
        description:
          "Get your Vancouver business found on Google, Maps, and AI-powered search when new customers are looking for your services.",
        cta: {
          label: "Get Found by More Vancouver Customers",
          href: "/contact",
        },
        spacing: "tight-bottom",
      },
      {
        type: "results",
        headline: "SEO company delivering guaranteed results",
        description:
          "Our SEO company delivers measurable results across competitive industries, using targeted keywords, local SEO, and customized strategies to increase rankings, qualified leads, inquiries, bookings, and consultations. Here are examples of results achieved for businesses in construction, solar, dental, and legal services.",
        items: [
          {
            title: "Solar companies",
            description:
              "30% boost in Google rankings for high-conversion keywords with a 25% increase in qualified leads",
          },
          {
            title: "Dental clinics",
            description:
              "Custom strategies improved local search results, which drove a 50% increase in appointment bookings & patient inquiries.",
          },
          {
            title: "Construction firms",
            description:
              "Optimized keywords boosted search engine rankings, resulting in a 40% rise in inbound leads and project inquiries.",
          },
          {
            title: "Law firms",
            icon: 12,
            description:
              "Achieved top search engine rankings, which resulted in a 35% increase in consultations and more qualified leads.",
          },
        ],
      },
      {
        type: "growBusiness",
        headline: ["Grow your business", "Local SEO matters"],
        intro:
          "Don't let competitors capture the Vancouver customers searching for your services. Vancouver has 167,453 licensed businesses competing for the same local customers searching on Google. If your website isn't visible on the first page, those customers are more likely to choose a competitor simply because they found them first. The impact of search visibility is significant.",
        items: [
          {
            text: "97% of consumers research a business's online presence before visiting its location or making a purchase.",
            tag: "What",
          },
          {
            text: 'More than 200 million "near me" searches were made each month in early 2026.',
            tag: "Are",
          },
          {
            text: "Local businesses get an average of 943 views from search and 317 from Google Maps. Being visible on both helps businesses reach more local customers.",
            tag: "Waiting",
          },
          {
            text: "AI Overviews now appear in 68% of local searches. Many local customers may see Google's AI-generated summary before reaching individual business listings or websites.",
            tag: "You",
          },
        ],
        closing:
          "Want your business to stand out in local search? We create neighbourhood-level keyword strategies for Vancouver businesses targeting areas such as Gastown, Yaletown, Kitsilano, Commercial Drive, Main Street, Burnaby, and Richmond. Each location receives dedicated keyword research, citation building, and locally relevant content.",
      },
      {
        type: "cta",
        title:
          "Technico Digital Solutions — bringing your business to new heights",
        description:
          "Let our proven SEO strategy help you achieve the SEO results you're aiming for and take your business to the next level. By partnering with Technico Digital Solutions, the trusted digital marketing agency in Canada, we can unlock your business's maximum potential and drive more visitors, improve your search engine rankings, and ultimately boost your revenue growth.",
        descriptionLink: {
          label: "digital marketing agency in Canada",
          href: "https://technicosolutions.com/",
        },
        cta: { label: "Contact Us Today", href: "/contact" },
        wide: true,
        spacing: "tight-bottom",
      },
      {
        type: "faq",
        headline: ["Frequently asked", "questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question: "Is it worth paying someone to do SEO?",
            answer:
              "Yes, paying for professional SEO services is definitely worth it. Search engine marketing (SEM) requires expertise to achieve good, long-term results. A dedicated SEO expert creates a strategy that improves your website's ranking, drives quality traffic, and increases conversions. Professional services guarantee you're not leaving your business success to chance.",
            link: {
              label: "Search engine marketing",
              href: "https://www.techtarget.com/searchcontentmanagement/definition/Search-engine-marketing-SEM",
            },
          },
          {
            question: "Can ChatGPT do SEO?",
            answer:
              "While ChatGPT can assist with SEO for content creation, it’s not a substitute for a comprehensive SEO strategy. For the best results, your business needs the right digital agency to handle keyword optimization, internal linking, Google Ads, and other SEO efforts. ChatGPT can support creating relevant content, but SEO requires a more hands-on, specialized approach.",
          },
          {
            question: "Who uses SEO the most?",
            answer:
              "Businesses across various industries use SEO, but it’s particularly beneficial for e-commerce sites, local businesses, and service providers looking to increase online visibility. Companies with a dedicated internet marketing budget prioritize SEO to improve search rankings and attract more leads.",
          },
          {
            question:
              "Why do I need SEO if my Vancouver business already has loyal customers?",
            answer:
              "SEO helps established Vancouver businesses attract new customers beyond their loyal customer base. Your existing customers already know how to find you, but new customers may search Google, Google Maps, or AI-powered search tools when looking for your products or services. A strong SEO strategy improves your visibility across these platforms.",
          },
        ],
      },
    ],
  },
  {
    // Hero received from client — see "CONTENT WORKFLOW" note at the
    // top of this file. Other sections (highlights, conversion,
    // insights, results, growBusiness, faq, ctas) still pending;
    // page renders only what's in `sections` below, in order.
    slug: "website-design-and-development",
    title: "Web Development",
    subtitle: "Website Design & Development",
    quote: "Create a strong digital presence with a user-centred website",
    shortDescription:
      "User-centred web design and development built around what visitors need to do.",
    description: [
      "Technico approaches website design around what visitors need to do once they arrive, not just how the site looks. Before designing or rebuilding a website, the team looks at your services, target customers, site structure, conversion points, and the marketing channels that will be sending traffic to it.",
      "Pages are then structured so visitors can quickly understand what the business offers, find the information they need, and take the next step. Technico combines web design and development with mobile responsiveness, site performance, SEO considerations, clear calls to action, and conversion-focused page layouts. Web design and development services include",
    ],
    tags: [
      "Custom Web Design",
      "Responsive Development",
      "Performance Optimization",
      "Conversion Focus",
    ],
    sections: [
      {
        type: "hero",
        eyebrow: "Website Design & Development",
        headline:
          "Website design & development services for Canadian businesses moving online",
        paragraphs: [
          {
            text: "Your website should do more than sit online. We turn your website into a moving business tool. Technico Digital Solutions is a website design and development company in Canada that builds custom, responsive websites for businesses. Our website design and development services combine user-focused design, development, website performance, SEO, and integrations to create sites that look professional, work across devices, and support your business goals.",
            link: {
              label: "website design and development services",
              href: "https://technicosolutions.com/services/website-design-and-development/",
            },
          },
          {
            text: "We bring strategy, technology, and creativity together to build an online presence that attracts the right visitors and supports conversions. From launching a new website to updating an existing one, our team focuses on creating a site that works for your business and your customers.",
          },
        ],
      },
      { type: "trustedBy" },
      {
        type: "comparison",
        headline: "Web design and development built around your business",
        intro:
          "Technico Digital Solutions provides both web design and web development as an integrated service. Our web devs combine the visual and user-experience side of your website with the development needed to make it functional, responsive, fast, and ready to support your business online.",
        cta: { label: "Let's Work Together", href: "/contact" },
        columns: [
          {
            title: "Web design",
            rows: [
              {
                icon: 0,
                label: "Focus",
                value: "How your website looks, feels, and guides visitors",
              },
              {
                icon: 1,
                label: "Visual interface",
                value:
                  "Typography, imagery, buttons, spacing, & interface elements",
              },
              {
                icon: 2,
                label: "Layout & structure",
                value:
                  "Organises page layouts, content placement, menus, navigation",
              },
              {
                icon: 3,
                label: "User experience",
                value:
                  "Plans how visitors move through the website and find information",
              },
              {
                icon: 4,
                label: "Primary outcome",
                value:
                  "Creates an intuitive, consistent experience for visitors",
              },
            ],
          },
          {
            title: "Web development",
            rows: [
              {
                icon: 5,
                label: "Focus",
                value: "How your website functions and performs",
              },
              {
                icon: 6,
                label: "Performance",
                value:
                  "Addresses technical factors that affect website speed and functionality",
              },
              {
                icon: 7,
                label: "Website build",
                value: "Turns approved designs into functional web pages",
              },
              {
                icon: 8,
                label: "Functionality",
                value:
                  "Builds forms, interactive features, databases, and other functions",
              },
              {
                icon: 9,
                label: "Primary outcome",
                value:
                  "Creates a working website that delivers the required features",
              },
            ],
          },
        ],
        closing:
          "Technico Digital Solutions provides web design and web development as one integrated service for businesses across Canada. We design and build each website around your industry, your customers, and how people typically search for and use services in your niche. A solar company, for example, needs a different website experience from a car wash and detailing business or a law firm. From the visual style and page structure to service information, lead forms, and other features, we build your website around what works for your industry and supports your business goals.",
      },
      {
        type: "marqueeCta",
        text: "Let's connect.",
        cta: { label: "Get in touch", href: "/contact" },
      },
      {
        type: "featuresSplit",
        eyebrow: "Website Features",
        headline: "Get the website features your business needs",
        paragraphs: [
          "Your website should do more than look good. It should work for your business.",
          "You don’t need to understand technical terms like databases, CRM integrations, SSO, or web-based programs before starting a website project. Tell us what you need your website to help you do, whether that’s taking payments, managing bookings, collecting enquiries, giving members secure access, connecting with your CRM, or creating tools your team can use behind the scenes. Marketing strategists at Technico can recommend and build the right website features around how your business operates and how your customers use your site.",
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960491/services-web-dev-imgs/technico_website_features_by2s8b.png",
          alt: "Website features and custom functionality built around business needs",
        },
        listHeading: "Database-driven custom solutions include:",
        items: [
          { text: "Mobile and user-friendly, responsive website" },
          {
            text: "Integration of association management and membership systems",
          },
          { text: "Shopping carts, e-commerce, and payment integration" },
          {
            text: "Single sign-on (SSO) and password-protected content",
            link: {
              label: "Single sign-on",
              href: "https://heimdalsecurity.com/blog/what-is-sso-single-sign-on-explained/",
            },
          },
          { text: "Online polls and surveys" },
          { text: "Tools for digital marketing services" },
          { text: "Web-based programs" },
          { text: "Development of intranets and extranets" },
          { text: "Dashboards, admin tools, reports, and forms" },
          { text: "Connectivity with external systems, such as CRMs" },
          { text: "Compliance with accessibility" },
          { text: "Enhancements in performance" },
        ],
      },
      {
        type: "featureCard",
        eyebrow: "Responsive . Design",
        headline: "Responsive web\ndesign services",
        paragraph:
          "Web design and SEO are closely connected because the way a website is built and presented can affect how easily people use it and how well search engines access its content. Responsive design helps your website work across mobile, tablet, and desktop devices, while clear navigation and page structure make it easier for visitors to find what they need.\n\nOur web designers also consider factors that can influence search performance, including page speed, Core Web Vitals, mobile usability, crawlability, and content structure. Custom web design does not improve rankings on its own, but a well-built website can create a stronger technical and user-experience foundation for SEO.",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960493/services-web-dev-imgs/technico_responsive_web_design_kdoq7x.png",
          alt: "Responsive web design displayed across phone and desktop screens",
        },
        cta: { label: "Let's Connect", href: "/contact" },
        checklist: [
          "Responsive for desktop, tablet, & mobile",
          "Clear navigation and page structure",
          "Fast-loading pages and performance improvements",
          "Mobile usability",
          "Core Web Vitals",
          "Search-friendly content structure",
          "Visual consistency across the website",
          "Layouts that support SEO & content",
        ],
      },
      {
        type: "imageStatement",
        eyebrow: "Propel . Business",
        headline:
          "Propel your business goals, don't let a poorly built website limit your growth",
        cta: { label: "Let's Connect", href: "/contact" },
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960490/services-web-dev-imgs/technico_propel_business_civuay.png",
          alt: "A well-built website helping a business move toward its goals",
        },
        paragraph:
          "We are forward-thinking enough to make plans for the future. It's time to work with our web design company if you run into any of these problems.",
      },
      {
        type: "imageStatement",
        eyebrow: "Slow",
        headline: "Slow page speed can cost you visitors",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960487/services-web-dev-imgs/technico_slow_website_qgupcq.png",
          alt: "A slow-loading website page costing a business visitors",
        },
        paragraph:
          "People arrive on your website expecting to find an answer quickly. When a page keeps them waiting, that delay creates friction before they have even read your offer, checked your services, or reached your call to action. Google research found that 53% of mobile site visits were abandoned when pages took longer than three seconds to load. Google also recommends a largest contentful paint (LCP) of 2.5 seconds or less, which measures how quickly the main content visible to a user loads. Careless coding, oversized images, unnecessary scripts, and too many plugins can all weigh a website down. Our web developers consider performance during development, so your pages remain fast and easy to use as your website grows.",
      },
      {
        type: "imageStatement",
        eyebrow: "Poor",
        headline: "Poor technical SEO can make your website harder to find",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960485/services-web-dev-imgs/technico_poor_seo_hzcs2x.png",
          alt: "A website that is hard to find because of poor technical SEO",
        },
        paragraph:
          "Technical SEO helps search engines find, crawl, index, and interpret your pages. Google specifically notes that website design can make indexing difficult and that pages need to meet technical requirements before Google can find, crawl, index, and consider them for search results. That is why we consider SEO during website development instead of treating it as something to add after launch. Site structure, internal linking, mobile usability, page performance, crawlability, indexability, redirects, and other technical elements can be addressed as the website is built.",
      },
      {
        type: "imageStatement",
        eyebrow: "Website",
        headline: "Your website should be able to grow with your business",
        // No `shape` set — defaults to "stairStep", same landscape
        // (1200x474) shape as Propel/Slow/Poor above, instead of the
        // near-square "column" shape which blew up to an enormous
        // height on full-bleed section widths.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960488/services-web-dev-imgs/technico_website_grow_business_fosm2u.png",
          alt: "A scalable website that grows alongside the business",
        },
        paragraph:
          "A five-page website can be simple when your business first launches. Sooner or later, you will be adding dozens of service pages, multiple locations, hundreds of products, customer accounts, booking systems, payment processing, CRM integrations, gated content, or new marketing campaigns. Consider these.",
        bullets: [
          "A solar company could start with residential installation and later add commercial solar, battery storage, EV charging, financing information, and individual service-area pages.",
          "An e-commerce business could grow from 20 products to 2,000.",
          "A service business could expand from one city into several Canadian markets.",
        ],
        closingParagraph:
          "Your website architecture and technology need to accommodate that growth without becoming difficult to manage. Our web developers consider what your business needs now and what the website could need next. That gives you room to add pages, functionality, integrations, and new customer journeys as your business expands.",
      },
      {
        type: "process",
        eyebrow: "Web Development",
        headline: "Our web development and web design process",
        paragraph:
          "The best thing about our web design-development services is that, rather than taking a one-size-fits-all approach, we concentrate on each client separately to attend to their particular concerns.",
        steps: [
          {
            title: "Research",
            description:
              "Every project requires planning and a deep understanding of your company. To provide the best results, we conduct extensive research.",
          },
          {
            title: "Build",
            description:
              "The skilled web developers at Technico Digital Solutions turn your design into a functional website that propels your company to success.",
          },
          {
            title: "Web designing",
            description:
              "Develop the perfect look by fusing functionality and style to promote the success of your company and guarantee peak performance.",
          },
          {
            title: "Deploy",
            description:
              "Prepared for launch after a thorough quality assurance procedure. To make sure everything runs smoothly after launch, get continuing support.",
          },
        ],
      },
      { type: "techStack" },
      {
        type: "introPanel",
        eyebrow: "Technico",
        headline:
          "Technico Digital Solutions for data-driven and professional web design and development",
        paragraphs: [
          {
            text: "Web design and development is a marketing strategy you need to create a trusted website that your customers will enjoy. Website design and development is not just about aesthetics; it also includes factors like loading speed, menu design, accessibility, and overall user experience.",
          },
          {
            text: "While some platforms allow you to customize a website easily, they don’t cover everything your business needs. That’s why it’s necessary to hire professional website developers and designers. Partner with Technico Digital Solutions, a digital marketing company, to build a website that looks great, performs flawlessly, and drives results.",
            link: {
              label: "digital marketing company",
              href: "https://technicosolutions.com/",
            },
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960495/services-web-dev-imgs/technico_for_you_zws0uj.png",
          alt: "Web design and development built for your business",
        },
      },
      {
        type: "faq",
        headline: ["Frequently asked", "questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question:
              "Why is website design and online marketing important for my business?",
            answer:
              "Acts as a company’s online storefront to showcase professionalism, values, and brand identity. A company’s website serves as the initial point of contact with prospective clients. As a result, it is essential in forming their opinions and affecting their choices. A Stanford University study found that 75% of users base their opinion of a company’s credibility solely on its website design.",
          },
          {
            question:
              "Can I choose web design and web development services separately, or are they only offered as a package?",
            answer:
              "You can choose any of the services you think your website needs. But to make sure that you are availing the right service, what we will do is audit your website, discuss your goals, and research competitors to see what your website exactly needs.",
          },
          {
            question: "How much time is needed to complete the website design?",
            answer:
              "A website can take around 4 to 8 weeks to design and develop. For example, a small service business needing a 5 to 10-page website could be closer to 2 to 3 weeks. A law firm with separate pages for multiple practice areas, lawyer profiles, locations, resources, and lead forms could take 3 to 4 weeks or longer. Large e-commerce or custom-development projects can also require additional time. We establish the project scope and expected timeline before development starts.",
          },
          {
            question:
              "What is included in website design and development services?",
            answer:
              "Website design and development services can include website planning, custom design, responsive development, page creation, forms, integrations, performance optimization, testing, and launch support. You can hire Technico Digital Solutions for website design and development as a standalone service. However, we recommend pairing your new website with a digital marketing and SEO package. A well-built website gives your business the foundation, but SEO, content, and other marketing strategies help people find it and turn the site into an active source of traffic and leads.",
          },
          {
            question: "Will my new website be mobile-friendly and SEO-ready?",
            answer:
              "Yes. We build websites to work across desktop, tablet, and mobile devices and consider technical SEO requirements during development. However, an SEO-ready website is not the same as an SEO-optimized website. Ranking for valuable searches also requires keyword research, useful and optimized content, service and location pages where appropriate, authority building, and ongoing SEO work. We can provide these through our SEO and digital marketing services rather than promising that development alone will make a new website rank.",
          },
          {
            question: "Do you build e-commerce websites?",
            answer:
              "Yes. Our devs at Technico Digital Solutions build e-commerce websites for businesses that want to sell products online. We build features such as product and category pages, shopping carts, secure payment integrations, customer accounts, and other e-commerce functionality. Our web designers and developers can also recommend a suitable platform and setup based on the number of products you sell and the integrations your business needs.",
          },
          {
            question: "Do you provide website support after launch?",
            answer:
              "Yes. We at Technico Digital Solutions provide website support after launch to help keep your website functional, secure, and up to date. Post-launch requirements vary by website, but support can include updates, troubleshooting, performance checks, content changes, functionality improvements, and additional development as your business grows.",
          },
        ],
      },
    ],
  },
  {
    slug: "creative-design-and-content",
    title: "Content Services",
    subtitle: "Creative Design & Content Services",
    quote: "Engage your audience with compelling content & visuals",
    shortDescription:
      "Creative content and visuals that tell your brand story and build engagement.",
    description: [
      "Captivate your audience with high-quality, creative content that tells your brand story and drives engagement. From graphics to blog posts, our creative services focus on building brand authority and establishing a strong connection with your target audience.",
      "Our approach guarantees your content is not only appealing but also strategic to engage your audience and strengthen your brand presence. Creative design and content services include",
    ],
    tags: [
      "Copywriting",
      "Content Writing",
      "Content Strategy",
      "SEO Content",
      "Visual Design",
      "Infographics",
      "Social Media Graphics",
      "Image Elements",
    ],
    sections: [
      {
        type: "hero",
        eyebrow: "Creative Design & Content Services",
        headline:
          "Graphic design services for Canadian businesses going digital",
        paragraphs: [
          { text: "Your brand has a story. We make it impossible to ignore." },
          {
            text: "Technico Digital Solutions is a digital marketing agency in Canada offering graphic design and creative content services. Our team creates brand graphics, website visuals, social media creative, marketing materials, and other digital assets for businesses including solar companies, automotive businesses, professional services, and local service providers. We design around the business and the audience rather than using the same creative approach for every client. A solar company needs visuals that make its services and technology easier to understand, while a car wash or detailing business relies heavily on strong imagery to show the quality of its work. Our designers consider your industry, brand, customers, and where the creative will appear before developing the final concept.",
          },
        ],
      },
      {
        type: "cta",
        title: "Transform your brand with designs that speak to your audience",
        description: "Collaborate with our team and level up your business.",
        cta: {
          label: "Get My Free Strategy Consultation",
          href: "/contact",
        },
      },
      {
        type: "insights",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960571/services-graphic-design/technico_visual_identity_qdrf6j.png",
          alt: "Visual identity elements that define a brand",
        },
        headline: "Building a visual identity that defines your brand",
        intro:
          "Creating a strong brand identity doesn't just mean having the best logos. It's about telling your story in a way that grabs attention. We help businesses create a distinct brand presence that aligns with your values and speaks directly to your true market. Our digital design solutions simplify even the most complex ideas and turn them into relevant visuals.",
        // No accordion items for this section — leave empty rather
        // than inventing Q&A-style entries that weren't provided.
        items: [],
        closingParagraph:
          "If you're looking to level up your website development or marketing materials, our Technico Digital Solutions team guarantees your brand stands out.",
      },
      {
        type: "results",
        headline:
          "Put your brand in the spotlight with graphic design services",
        description:
          "Visual design can shape how people judge a business online before they spend much time reading its content. In Stanford's web credibility research, 46.1% of comments about website credibility referred to the site's design, including its layout, typography, images, white space, and colour scheme. People form visual impressions of websites remarkably quickly. Another research published by Google found that a website's visual complexity can influence aesthetic judgments within the first 50 milliseconds of viewing it. Our designers create visuals around your brand, audience, and marketing channel so the creative remains consistent while still serving the purpose of each campaign.",
        descriptionLink: {
          label: "Stanford's web credibility research",
          href: "https://credibility.stanford.edu/pdf/How_Do_People_Evaluate_a_Web_Site%27s_Credibility_v37.pdf",
        },
        items: [
          {
            title: "Website graphics",
            description:
              "Include banners, custom images, icons, and other visual elements used across your website. Web graphics support your content, highlight information and help visitors navigate your pages.",
          },
          {
            title: "Logo design & branding",
            description:
              "A unique logo is your brand's first impression. Effective branding creates a lasting visual identity that speaks to your values and connects with your audience.",
          },
          {
            title: "UI/UX design elements",
            description:
              "Great UI/UX design is all about simplicity and functionality. Elements include buttons, menus, forms, navigation, and other interactive parts of your website.",
            link: {
              label: "UI/UX",
              href: "https://www.figma.com/resource-library/difference-between-ui-and-ux/",
            },
          },
          {
            title: "Social media graphics",
            description:
              "Bold and engaging graphics grow your social media presence. Managing Instagram, Facebook, or any other platform? Quality visuals make posts stand out.",
          },
          {
            title: "Email templates",
            description:
              "Custom email templates make sure your communication looks polished and professional. From newsletters to promotions, we keep your brand consistent and on-brand with every send.",
          },
          {
            title: "Digital ads",
            description:
              "Digital ad graphics are visual assets made for paid campaigns across search and other advertising platforms. Let's turn clicks into conversions to guarantee your message reaches the right audience.",
          },
        ],
      },
      {
        type: "contentPillars",
        eyebrow: "Content",
        headline: "Content creation that keeps your brand message consistent",
        paragraph:
          "Graphic design determines how your marketing looks, while content determines what it says. Technico Digital Solutions provides both as part of its digital marketing services. We keep the visuals and messaging aligned across websites, search content, social media, advertising, and other marketing channels.",
        quote:
          "A landing page needs more than an attractive layout. It also needs copy that explains the offer and gives visitors a reason to take the next step. A social media campaign needs graphics that catch attention and captions or ad copy that communicate the message. Our creative and marketing teams bring these elements together around the same brand and campaign goals.",
        quoteAttribution: "Marketing experts at Technico Digital Solutions",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960571/services-graphic-design/technico_content_creation_wr3gfv.png",
          alt: "Content creation that keeps a brand message consistent",
        },
        items: [
          {
            title: "Landing page design & copy",
            description:
              "Combine persuasive copy with purposeful design to guide visitors toward action. We create landing pages where the messaging, layout, visuals, and calls to action work together to make your offer easy to understand.",
          },
          {
            title: "Website graphics & content",
            description:
              "Bring your website together with visuals and content that support the same message. From page graphics and branded imagery to clear website copy, we help create a consistent experience that reflects your brand and keeps visitors engaged.",
          },
          {
            title: "Social media creative & ad copy",
            description:
              "Your brand must communicate clearly across digital platforms. We pair attention-grabbing graphics with captions and ad copy built around your campaign. We create social media assets that keep your visuals and messaging consistent.",
          },
          {
            title: "Brand storytelling & product descriptions",
            description:
              "Build a stronger brand presence by aligning what your business says with how it looks. We combine brand messaging, visual direction, and storytelling to communicate your identity across marketing materials and customer touchpoints.",
          },
        ],
      },
      {
        type: "cta",
        title: "Ready to take your digital presence to the next level?",
        description:
          "Let's create stunning visuals and compelling content that drive real results.",
        cta: {
          label: "Arrange a Discovery Call",
          href: "/contact",
        },
      },
      {
        type: "pillarCards",
        eyebrow: "Graphic Design",
        headline:
          "How graphic design drives qualified leads and customers to your site",
        intro:
          "Graphic design acts as a high-precision filter that attracts the right audience while simultaneously guiding them through the sales funnel. In a digital space flooded with generic content, intentional design serves as a beacon for your ideal customer.",
        items: [
          {
            title: "Strategic",
            description:
              "Strategic use of colour theory, imagery, and style attracts the right audience.",
          },
          {
            title: "Instant trust",
            description:
              "A well-designed landing page creates instant trust and a sense of security for first-time visitors.",
          },
          {
            title: "Calls-to-action",
            description:
              "Strategic placement of call-to-action buttons makes the next steps obvious.",
          },
          {
            title: "Content structure",
            description:
              "Clear structure of data and benefits breaks complex information into digestible, scannable sections.",
          },
        ],
        closingParagraph:
          "Strategic design eliminates user guesswork and provides a seamless transition from curiosity to a lead. By aligning your visual identity with audience expectations, you make your site traffic relevant and ready to engage.",
      },
      {
        type: "highlights",
        eyebrow: "Why Technico",
        headline:
          "Creative graphic design company with a collaborative approach",
        paragraph:
          "When you choose Technico Digital Solutions as your graphic design firm, you can expect more than great graphics. Our designers and content creators collaborate closely to make sure that every element of your marketing, from visuals to messaging, perfectly aligns for maximum impact.",
        items: [
          {
            icon: 0,
            title: "Data-informed designs",
            description: "Backed by strategic insight.",
          },
          {
            icon: 1,
            title: "Fast turnaround",
            description: "To keep projects on track.",
          },
          {
            icon: 2,
            title: "Effective communication",
            description: "To keep you in the loop.",
          },
          {
            icon: 3,
            title: "Multi-industry experience",
            description: "To create workable designs.",
          },
          {
            icon: 4,
            title: "Content alignment",
            description: "For brands to shine consistently.",
          },
          {
            icon: 5,
            title: "Unique approach",
            description: "To meet your unique specifications.",
          },
        ],
      },
      {
        type: "process",
        eyebrow: "Graphic Design",
        headline: "Technico's graphic design process",
        paragraph:
          "A collaborative process built around direction, feedback, and final delivery.",
        descriptionLayout: "edge",
        steps: [
          {
            title: "Discovery",
            description:
              "Share your business goals to establish a clear direction for the work ahead.",
          },
          {
            title: "Creative direction",
            description:
              "Get a defined visual and messaging direction based on your brand.",
          },
          {
            title: "Design & content creation",
            description:
              "See your ideas take shape through visuals and copy created to work together.",
          },
          {
            title: "Review & revisions",
            description:
              "Review the work, provide feedback and request refinements if necessary.",
          },
          {
            title: "Final delivery",
            description:
              "Receive your approved creative assets ready to use across your website.",
          },
        ],
      },
      { type: "techStack", variant: "graphicDesignWork" },
      {
        type: "introPanel",
        eyebrow: "Technico",
        headline:
          "Let a digital marketing and design agency level up your digital presence",
        paragraphs: [
          {
            text: "Having a solid digital strategy lets your business connect with your target audience and build long-term brand loyalty. With Technico Digital Solutions, you get more than graphic design; we manage the entire process from concept to execution. Our team supports successful projects, from launching a new website to building your brand for the first time.",
          },
          {
            text: "Our digital marketing services agency integrates design, content, and web development to create a cohesive online presence that drives impressive results. With direct access to our specialists, you get clear communication, a strategic approach, and faster execution at every stage. If you're revamping your website or launching a new campaign, we're here to help you stand out. Get in touch with us today, and let's transform your brand's digital presence.",
            link: {
              label: "digital marketing services agency",
              href: "https://technicosolutions.com/",
            },
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960572/services-graphic-design/technico_design_agency_ev2hx8.png",
          alt: "Digital marketing agency combining design, content, and web development",
        },
      },
      {
        type: "cta",
        title:
          "Your marketing is stronger when every visual and message feels connected.",
        description:
          "Align your graphics, copy, and brand message around the goals that matter to your business.",
        cta: { label: "Call Us", href: SITE_PHONE_HREF },
      },
      {
        type: "faq",
        headline: ["Frequently asked", "questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question: "Do e-commerce businesses need graphic design services?",
            answer:
              "Yes, because it helps a business stand out in a crowded market. Effective graphic design upgrades your online store's appeal, helps create content, and supports a new identity, while print design and packaging design can improve your brand's consumer products.",
          },
          {
            question: "What makes a good design process?",
            answer:
              "A good design process combines creativity, psychology, strategy, and an understanding of human behavior. It begins with empathy by identifying your audience's needs and emotions, then applies principles like color theory and visual hierarchy to shape perception. Our designers stay sharp on what's new in design, color, and user behavior, so your brand always looks fresh and connects with people in the right way.",
          },
          {
            question:
              "How does a business thrive with good visual storytelling?",
            answer:
              "Graphic storytelling creates a cohesive brand image that reflects the audience. By following clear brand guidelines, you can maintain consistency across all digital platforms and make your message easily recognizable. Effective visuals convey emotions, build trust, and engage customers, which leads to better brand loyalty and stronger connections with target audiences.",
            link: {
              label: "Graphic storytelling",
              href: "https://www.manypixels.co/blog/graphic-design/improve-storytelling",
            },
          },
          {
            question: "Why is graphic design important for digital marketing?",
            answer:
              "It serves as the visual engine of your marketing strategy. It transcends mere aesthetics, serving as a functional tool that translates complex brand values into an instant, nonverbal dialogue with your audience. By merging cognitive psychology with creative execution, graphic design turns passive scrollers into engaged participants.",
          },
        ],
      },
    ],
  },
  {
    // Full page copy received from client (see the
    // "media-buying-and-digital-advertising" brief) — mapped into
    // the existing block types below rather than inventing new
    // stats, industries, or FAQ content. See "CONTENT WORKFLOW" note
    // at the top of this file.
    slug: "advertising",
    title: "Advertising",
    subtitle: "Media Buying & Digital Advertising",
    quote: "Target smarter. Spend wiser. Grow faster.",
    shortDescription:
      "Paid campaigns planned around who you need to reach and what happens after the click.",
    description: [
      "Our marketing team plans paid campaigns around who the business needs to reach, where that audience can be reached, and what action they should take after clicking an ad. Instead of putting your ad budget into different channels and hoping something works, we discuss what you want to achieve first, then plan the right platforms, audiences, keywords, campaign types, and landing pages to put your budget where it has the strongest chance of generating results.",
      "We monitor spend, clicks, conversions, cost per lead, and other relevant performance data, adjusting budgets and targeting based on what is generating results rather than leaving campaigns running unchanged. The process also includes testing ad creative, messaging, audiences, and landing-page combinations to identify opportunities to improve performance. Media buying and advertising services include",
    ],
    tags: [
      "PPC (Pay-Per-Click): Google Ads campaigns to increase website traffic and close sales.",
      "SEM (Search Engine Marketing): Paid search campaigns targeting the right keywords drive qualified traffic.",
      "Social Media Marketing: Ads on social media platforms increase brand visibility & engagement.",
    ],
    sections: [
      {
        type: "hero",
        eyebrow: "Media Buying & Digital Advertising",
        headline: "Strategic media buying for businesses across Vancouver",
        paragraphs: [
          { text: "Target smarter. Spend wiser. Grow faster." },
          {
            text: "As a digital advertising company, we at Technico help you plan and manage media buying across paid search, PPC, and social media. Your campaign goals and target audience guide where your ads appear, who they reach, and how your advertising budget is allocated.",
            link: {
              label: "digital advertising company",
              href: "https://technicosolutions.com/services/media-buying-and-digital-advertising/",
            },
          },
          {
            text: "From campaign setup and audience targeting to ad placement, budget allocation, monitoring, and ongoing optimization, our digital marketers keep a close eye on where your money is going and what it’s producing. Put your advertising budget where it has the strongest opportunity to reach the right people and generate results. Let the Technico team help you make every campaign count.",
          },
        ],
      },
      {
        type: "cta",
        title:
          "Don't pressure yourself to handle every aspect of your business",
        description:
          "Leave the marketing strategy to our team. Our digital marketing experts capture your target audience and turn them into customers.",
        cta: {
          label: "Let's Discuss Your Digital Marketing Strategies",
          href: "/contact",
        },
      },
      {
        type: "highlights",
        eyebrow: "Digital Marketing Services",
        headline: "Put your ad budget where it works hardest",
        paragraph:
          "Media buying is the process of selecting and purchasing advertising placements across relevant channels to reach a defined audience within a specific budget. It includes media planning, platform selection, audience targeting, ad placement, budget allocation, campaign monitoring, and ongoing optimization. Technico Digital Solutions manages this process across paid search, PPC, and social media advertising. We help you decide where your ads should run, how your budget should be distributed, which audiences to target, and how campaigns should be adjusted based on performance.",

        items: [
          {
            icon: 0,
            title: "Search engine marketing (SEM)",
            description:
              "SEM puts your business in front of people actively searching for products or services like yours. Technico plans and manages paid search campaigns around relevant keywords, search intent, audience location, ad messaging, and budget. Platforms & tools: Google Ads, Microsoft Advertising, Google Keyword Planner, Google Analytics 4",
          },
          {
            icon: 1,
            title: "Pay-per-click advertising (PPC)",
            description:
              "PPC is an advertising model where you pay when someone clicks your ad. Technico manages PPC campaigns by setting budgets, choosing targeting criteria, monitoring cost per click and conversions, testing ads, and adjusting bids based on campaign performance. Platforms & tools: Google Ads, Microsoft Advertising, Google Analytics 4, Google Tag Manager",
          },
          {
            icon: 2,
            title: "Paid social advertising",
            description:
              "Paid social advertising places sponsored content in front of selected audiences on social media platforms. We use audience targeting based on factors such as location, interests, demographics, behaviour, and customer data to reach relevant users. Platforms & tools: Meta Ads Manager, LinkedIn Campaign Manager, TikTok Ads Manager, Google Analytics 4",
          },
        ],
        closingParagraph:
          "These channels can work separately or as part of one media buying strategy. SEM uses paid search campaigns to reach people already searching for relevant products or services, while paid social helps you reach and re-engage targeted audiences across social platforms. PPC, on the other hand, describes the payment model where you pay when someone clicks your ad. PPC can be used across search, display, social media, and other digital advertising channels.",
      },
      {
        type: "highlights",
        eyebrow: "Media Buying Services",
        headline: "How we manage your media buying",
        paragraph:
          "Media buying involves more than purchasing ad space. At Technico Digital Solutions, we plan where your advertising budget should go, identify the audiences and channels worth targeting, manage digital media purchases and placements, and monitor campaign performance. Each decision is based on your audience, budget, campaign goals, and the results your ads generate.",
        items: [
          {
            icon: 3,
            title: "Media planning & strategy",
            description:
              "Your media plan defines how your advertising budget will be used based on your goals, target market, and campaign priorities. It identifies which channels to use, how much budget to allocate, and how to structure your campaigns before advertising begins.",
          },
          {
            icon: 4,
            title: "Audience & channel targeting",
            description:
              "Your ads target specific audiences across the channels most relevant to your campaign. Targeting can consider search intent, location, demographics, interests, behaviours, and existing customer audiences, depending on the advertising platform.",
          },
          {
            icon: 5,
            title: "Digital media buying",
            description:
              "We allocate your advertising budget across the digital platforms and campaigns included in your media plan. Bids, spending, and budget distribution are managed based on campaign priorities and performance, so more of your investment can be directed toward opportunities producing stronger results.",
          },
          {
            icon: 6,
            title: "Ad placement & campaign management",
            description:
              "Your ads are placed across selected platforms, placements, and audience segments based on your media strategy. Once campaigns are live, we monitor clicks, conversions, costs, and audience response so we can adjust targeting, placements, bids, and budgets as performance data comes in.",
          },
        ],
        closingParagraph:
          "Campaign measurement guides where your advertising budget goes next. If one audience, channel, keyword, placement, or campaign delivers stronger results at an acceptable cost, you can direct more budget toward it. You can adjust underperforming campaigns by changing targeting, bids, placements, creative, landing pages, or budget allocation.",
      },
      {
        type: "insights",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960648/services-advertising-imgs/technico_digital_advertising_i394q7.png",
          alt: "Digital advertising campaigns managed across paid channels",
        },
        headline:
          "Delivering high-performance marketing to multiple industries",
        intro:
          "Getting to the top of organic search results can take time, especially when your business competes for keywords already targeted by established websites. The difficulty varies by industry, location, keyword, and the strength of the businesses already ranking. That is where paid media can help fill the gap while your organic visibility develops.",
        items: [
          {
            title: "When paid search can make sense alongside SEO",
            description:
              "SEO and paid advertising serve different purposes. SEO builds organic visibility over time, while paid search can put your business in front of people searching for your services as soon as a campaign is running. For competitive searches, using both can give your business immediate paid visibility while you work toward stronger organic rankings.\n\nFor example, a law firm entering a competitive market could use PPC to appear for selected legal searches while building out service pages and organic authority. A solar company could run paid campaigns around high-intent installation searches, while a car detailing business could target people searching within specific service areas.",
          },
          {
            title: "How PPC costs work",
            description:
              "With PPC advertising, you pay when someone clicks your ad rather than simply paying to appear in search results. The amount you pay for each click is not fixed. Cost-per-click estimates can range from a few dollars to considerably more depending on the keyword, industry, location, audience, competition, and commercial value of the search.\n\nLet’s say, if a keyword has an estimated $10 cost per click and your campaign receives 100 paid clicks, the click cost would be roughly $1,000 before management fees or other campaign costs. The actual amount can be higher or lower because advertisers compete through real-time ad auctions.\n\nThe cheapest click isn’t necessarily the goal. A $15 click that generates a qualified customer can be more valuable than a $3 click from someone unlikely to buy. Campaign performance should therefore be evaluated using conversions, cost per lead, customer acquisition cost, and return on ad spend, not CPC alone.",
          },
        ],
      },
      {
        type: "featuresSplit",
        eyebrow: "Industries We Serve",
        headline: "Your industry changes the media buying strategy",
        paragraphs: [
          "Advertising competition isn’t equal across industries. Legal services, medical services, home services, automotive businesses, construction companies, renewable energy providers, and hospitality businesses can face very different search competition, CPCs, customer values, and buying cycles. That is why your media plan should consider your industry, target location, keyword competition, estimated CPC, search intent, conversion value, and available budget before deciding where your advertising dollars should go.",
        ],
        listHeading: "Industries We Work With",
        items: [
          { text: "Automotive car" },
          { text: "Travel & hospitality" },
          { text: "Health and wellness" },
          { text: "Medical services" },
          { text: "Legal services" },
          { text: "Home improvement" },
          { text: "Home services" },
          { text: "Construction" },
          { text: "Renewable energy" },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960646/services-advertising-imgs/technico-industries-serve_z397wr.png",
          alt: "Industries served by Technico's media buying strategies",
        },
      },
      {
        type: "imageStatement",
        eyebrow: "Digital Advertising Funnels",
        headline: "Building paid campaigns around leads, not just clicks",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960644/services-advertising-imgs/technico-high-performance_xav0zw.png",
          alt: "High-performance paid campaigns built around leads, not just clicks",
        },
        paragraph:
          "Advertising works best when every dollar has a purpose and every campaign has a clear objective. Your media buying strategy determines how you use that budget within the campaign. You can adjust bids, shift spending between campaigns, and allocate more or less budget to different audiences, channels, and ad placements based on performance. The goal isn’t simply to buy more clicks; it’s to decide where, when, and how your advertising budget should be spent to reach the intended audience efficiently. Don’t waste money on ineffective advertisements. We create high-performing advertising funnels that automatically generate leads, nurture prospects, and close deals on Google, Meta, LinkedIn, and other platforms. By building strong client relationships, our tried-and-true system has helped clients committed to growth achieve consistent revenue.",
        bullets: [
          {
            text: "Create a complete sales funnel, from click to customer, rather than just running advertisements.",
            link: {
              label: "sales funnel",
              href: "https://builtin.com/articles/sales-funnel",
            },
          },
          "Pre-qualify prospects to increase the effectiveness and efficiency of your lead generation.",
          "Made to make the transition from stranger to buyer as smooth as possible.",
          "You’ll be fully aware of what’s generating income and what’s working.",
        ],
      },
      {
        type: "cta",
        title:
          "Don’t spend money on ads without knowing which campaigns actually work.",
        description:
          "Partner with Technico Digital Solutions to identify and implement the most effective campaigns for your website or business.",
        cta: { label: "Grow Your Business Strategically", href: "/contact" },
        spacing: "tight-bottom",
      },
      {
        type: "introPanel",
        eyebrow: "Technico",
        headline: "The #1 digital advertising company for your business",
        paragraphs: [
          {
            text: "Technico Digital Solutions is home to an experienced team of media buying and digital advertising professionals. You’ll be leaving your business in good hands. Every dollar you spend comes back twice with real leads and real customers. Grow with our digital marketing agency Canada.",
            link: {
              label: "digital marketing agency Canada",
              href: "https://technicosolutions.com/",
            },
          },
          {
            text: "For other services, we also offer web development, web design, email marketing, social media marketing, social media management, and strategies to improve search engine rankings and social media engagement.",
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960642/services-advertising-imgs/technico-digital-advertising-company_oujftq.png",
          alt: "Digital advertising company managing paid campaigns for business growth",
        },
      },
      {
        type: "faq",
        headline: ["Frequently asked", "questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question:
              "Should I work with a local digital advertising company for my business?",
            answer:
              "Yes, working with a local digital advertising company and a digital marketing agency gives you a clear advantage because they understand your local market, audience, and competition. A local team also makes communication easier and faster. They can create personalized strategies across digital platforms to increase website traffic, generate more qualified leads, and drive sales while aligning with your business goals.",
          },
          {
            question: "Should small businesses hire a marketing agency?",
            answer:
              "Yes, small businesses can benefit greatly from hiring a marketing agency. Agencies bring expertise, tools, and strategies that may be difficult to manage in-house. Even on a limited budget, they can provide solutions to grow your business effectively.",
          },
          {
            question:
              "How long does it take to see results after hiring a digital advertising company?",
            answer:
              "Results are not instantaneous, and success takes time. Most successful campaigns start showing meaningful progress within three to six months. Paid ads (PPC) can deliver quick brand visibility, but those results stop once you stop paying. SEO and integrated campaigns, on the other hand, build long-term authority by increasing organic traffic and helping your website rank organically.",
            emphasis: "PPC",
          },
          {
            question: "What is the difference between SEM and PPC?",
            answer:
              "Search engine marketing (SEM) focuses on increasing your visibility in search results through paid advertising. Pay-per-click (PPC) is an advertising model where you pay when someone clicks your ad. PPC is commonly used for paid search campaigns, while it can also apply to ads on other digital platforms.",
          },
          {
            question: "How do you measure paid advertising performance? ",
            answer:
              "Paid advertising performance is measured against your campaign goals using metrics such as impressions, clicks, click-through rate (CTR), cost per click (CPC), conversions, and cost per conversion or lead. When revenue tracking is available, return on ad spend (ROAS) can also help show how effectively your advertising budget is generating revenue.",
          },
        ],
      },
    ],
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    subtitle: "Social Media Management",
    quote: "Build meaningful connections with your target market",
    shortDescription:
      "Day-to-day social management built around your audience, competitors, and platform trends.",
    description: [
      "Social media management at Technico goes beyond filling up your content calendar. The team looks at who you want to reach, where those people are active, what your competitors are doing, and which topics and formats are getting attention in your industry. We handle the day-to-day work behind your accounts, including content planning, copywriting, creative production, scheduling, publishing, and community management.",
      "Our marketers keep an eye on platform and industry trends, so content can respond to what audiences are interested in instead of following the same content plan month after month. Performance data — impressions, reach, engagement, clicks, CTR, follower growth, and website traffic — is reviewed to see what's getting noticed and driving action, so posts, formats, topics, and calls to action can be adjusted accordingly. Social media management services include",
    ],
    tags: [
      "Strategy & Research",
      "Community Management",
      "Traffic & Conversion Tracking",
      "Content & Creative",
      "Performance Analytics",
      "Reporting & Optimization",
    ],
    sections: [
      {
        type: "hero",
        eyebrow: "Social Media Management",
        headline: "Social media management that boosts engagement & growth",
        paragraphs: [
          {
            text: "Strategically manage your social media and turn followers into loyal customers.",
          },
          {
            text: "Leave all your social media management in the hands of the experienced digital marketing team at Technico Digital Solutions. Our social media efforts focus on building an active, engaged following of potential customers. Your brand deserves premium content, not outdated tactics, so we dedicate our expertise exclusively to delivering effective social media services.",
          },
        ],
      },
      {
        type: "cta",
        title:
          "Grow your social media presence with genuine engagement, not just anyone",
        description:
          "Achieve real results with effective strategies from marketing experts.",
        cta: {
          label: "Begin Your Social Media Campaigns Now",
          href: "/contact",
        },
      },
      {
        type: "featuresSplit",
        eyebrow: "Social Media Strategy",
        headline: "Why your business needs a social media marketing strategy",
        paragraphs: [
          "SMM for small businesses can be challenging, but you're not alone. It's possible to grow your social media accounts and achieve your marketing goals.",
        ],
        listHeading: "What A Dedicated Strategy Delivers",
        items: [
          {
            text: "A dedicated social media management team keeps your brand active, consistent, and relevant across all major social media networks.",
          },
          {
            text: "Social media management expert helps your business connect with the right audience and build meaningful relationships online.",
          },
          {
            text: "A strong social media management strategy guarantees every post, comment, and campaign supports your marketing goals.",
          },
          {
            text: "Managing multiple social media platforms can be time-consuming; we manage social media for you so you can focus on running your business.",
          },
          {
            text: "Consistent engagement boosts brand awareness, generates leads, and strengthens your online reputation.",
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960690/services-social-media-imgs/technico-social-media-strategy_x3pcqa.png",
          alt: "Social media marketing strategy built around business goals",
        },
      },
      {
        type: "featuresSplit",
        eyebrow: "Channel Monitoring",
        headline: "Stay ahead with ongoing channel monitoring & optimization",
        paragraphs: [
          "Anyone can post or create content, but what you need is a team that can truly make a difference for your social media accounts — using proven strategy and the right social media management tools to drive consistency, performance, and real results.",
        ],
        listHeading: "How We Monitor And Optimize",
        items: [
          {
            text: "Use social media listening to craft strategies that drive more traffic to your website.",
          },
          {
            text: "Boost traffic, generate leads, and drive new sales to grow the brand online naturally.",
          },
          {
            text: "Monitor your channels to optimize campaigns, refine messaging, and engage your audience.",
          },
          {
            text: "Turn insights into actionable strategies that maximize ROI and strengthen your online presence.",
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960688/services-social-media-imgs/technico-channel-monitoring_of66xm.png",
          alt: "Ongoing social media channel monitoring and optimization",
        },
      },
      {
        type: "insights",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960693/services-social-media-imgs/technico-social-media-accounts_lnadbr.png",
          alt: "Expert management of a business's social media accounts",
        },
        headline: "You deserve an expert to manage your social media accounts",
        intro:
          "Don’t settle for less, and don’t try to do it all yourself. You need a social media management team that can help you manage multiple social media channels. Here’s what you should ask an agency.",
        items: [
          {
            title: "Are you effectively measuring social media ROI?",
            description:
              "We continuously monitor traffic, engagement, and conversions from all of your channels using live reporting. Our strategies assign a specific value to each conversion. This gives our clients an understanding of their return on investment.",
          },
          {
            title: "Do they have full transparency?",
            description:
              "Clients can review our service quality through our excellent feedback and high ratings. We maintain a strong reputation on Google. This reflects our commitment to transparency and reliability. Our services keep businesses one step ahead of the competition.",
            link: {
              label: "strong reputation on Google",
              href: "https://www.localfalcon.com/blog/how-google-reputation-management-improves-your-rankings-and-how-to-do-it",
            },
          },
          {
            title: "Can you handle an average agency?",
            description:
              "We go beyond the typical agency approach to deliver exceptional results for our clients. Our strategies, expertise, and dedication make sure businesses achieve measurable growth.",
          },
        ],
      },
      {
        type: "introPanel",
        eyebrow: "Technico",
        headline: "Work with us because your success is our top priority",
        paragraphs: [
          {
            text: "You may rely on social media management software to help you, but nothing beats the work of an expert. Technico Digital Solutions, a digital marketing company, gets into the details when managing our clients' accounts.",
          },
          {
            text: "We rely on research and implement strategies that work best for you, supported by the right social media management tools, and we don't copy-paste strategies just because you have the same industry as our other clients. We give you a unique plan, one that will bring you better leads turned into customers.",
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960692/services-social-media-imgs/technico-social-media-management-software_r1plps.png",
          alt: "Social media management tools and software supporting expert-led strategy",
        },
      },
      {
        type: "faq",
        headline: ["Frequently asked", "questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question: "What social media accounts do you manage?",
            answer:
              "All of the major platforms, including Facebook, Instagram, TikTok, YouTube, LinkedIn, X (formerly Twitter), and Pinterest, are managed by our social media management team. Our Instagram management services are different from our LinkedIn approach because we specialize in platform-specific tactics.",
          },
          {
            question: "What is your process to social media management?",
            answer:
              "Social media brand management involves maintaining and enhancing your brand's reputation on social media platforms. Our service includes using consistent messaging, monitoring your online presence, and engaging with your audience to increase brand awareness and loyalty.",
            link: {
              label: "brand management",
              href: "https://limbd.org/brand-management-definition-importance-elements-principles-benefits-examples-tips-for-effective-brand-management/",
            },
          },
          {
            question:
              "Will you apply the 5-5-5 rule to your social media strategy?",
            answer:
              "We customize our social media strategy to meet the unique requirements of every company. The 5-5-5 rule is not always necessary. In the 5-5-5 rule, you should share five posts of original content from other people or a link to resources outside of your company or yourself on your social networks for every five promotional pieces you post. You should also interact with your audience in five different ways, such as liking or responding to comments on your page.",
            emphasis: "5-5-5 rule",
          },
        ],
      },
    ],
  },
  {
    slug: "email-marketing",
    title: "Email Marketing",
    subtitle: "Email Marketing",
    quote: "Drive conversions with targeted campaigns",
    shortDescription:
      "Targeted, research-grounded email campaigns built to keep the conversation going.",
    description: [
      "Although Technico is particularly focused on SEO as a core growth driver, we still strongly believe in the power of email marketing as a complementary channel. We do not create generic, mass-produced email campaigns that end up in spam folders or get ignored — every email strategy we develop is tailored to the recipient, grounded in research, and designed with intent.",
      "Technico uses email marketing to keep the conversation going after someone joins a mailing list, submits an enquiry, makes a purchase, or becomes an existing customer, with contacts grouped based on where they are in the customer journey rather than sent one message as an entire database. We write the emails, create the design, organise your contacts into the right groups, and set up automated follow-ups, then track opens, clicks, and conversions to adjust future campaigns.",
    ],
    sections: [
      {
        type: "hero",
        eyebrow: "Email Marketing",
        headline:
          "Simplify your outreach with scalable email marketing services",
        paragraphs: [
          {
            text: "Every message matters. We make yours stand out in the inbox.",
          },
          {
            text: "Your business deserves consistent engagement that actually leads to sales. Yet sending out random emails without a clear plan wastes effort and resources. That's where our best email marketing services come in. Technico Solutions helps you create meaningful connections with your audience through campaigns that inform, convert, and retain.",
            link: {
              label: "email marketing services",
              href: "https://technicosolutions.com/services/email-marketing/",
            },
          },
          {
            text: "Our digital experts combine strategy, creativity, and technology to manage your email marketing efforts from start to finish. You gain access to powerful email marketing tools and automation features that make every message purposeful and easy to manage.",
          },
        ],
      },
      {
        type: "cta",
        title:
          "Boost engagement with targeted email campaigns that deliver real results.",
        description:
          "Partner with Technico Digital Solutions and simplify how you connect with your audience.",
        cta: { label: "Start Email Campaign", href: "/contact" },
      },
      {
        type: "featuresSplit",
        eyebrow: "Email Marketing Solutions",
        headline: "Your competitive edge with our email marketing solutions",
        paragraphs: [
          "Your customers check their inboxes daily. A well-timed email can drive them straight to your website. We help you reach them through highly targeted campaigns built on real data and customer insight.",
          {
            text: "Every campaign is monitored and optimized for open rates, click-throughs, and conversions. You get measurable outcomes and full control over your marketing strategy.",
            link: {
              label: "click-throughs",
              href: "https://www.getresponse.com/help/click-through.html",
            },
          },
        ],
        listHeading: "We Use",
        items: [
          {
            text: "Advanced marketing automation tools that save time & increase engagement",
          },
          { text: "Drag and drop editors for easy campaign creation" },
          { text: "Pre-designed email templates that adapt to your brand" },
          {
            text: "Detailed reporting resources for accurate tracking & analysis",
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960717/services-email-marketing-imgs/technico-email-marketing-solutions_maxmkt.png",
          alt: "Email marketing solutions that give a business a competitive edge",
        },
      },
      {
        type: "process",
        eyebrow: "Email Marketing Process",
        headline: "Laying the foundation for a successful email campaign",
        paragraph:
          "Let our digital marketers plan a strong email marketing strategy by understanding your audience and defining your business goals. Our process guarantees every email serves a purpose and every send moves you closer to your goals.",
        steps: [
          {
            title: "Planning & segmentation",
            description:
              "Using advanced segmentation to identify customer groups and send personalized messages that match their interests.",
          },
          {
            title: "Design & content",
            description:
              "Our email editor makes it easy to design responsive email templates that look great on any device.",
          },
          {
            title: "Automation setup",
            description:
              "We create automated workflows that send the right emails at the right time, from welcome messages to re-engagement campaigns.",
          },
          {
            title: "Testing & optimization",
            description:
              "Every campaign goes through A/B testing to improve subject lines, visuals, and calls to action.",
          },
          {
            title: "Reporting",
            description:
              "You'll receive clear, easy-to-read reports on what's performing and what can be improved.",
          },
        ],
      },
      {
        type: "results",
        headline: "All the tools to power your email marketing success",
        description:
          "Managing emails manually takes time. That's why our solutions combine email marketing with automation and advanced features, so your business can consistently keep up with the trend. Our email marketing agency uses the best email marketing platforms available to provide flexibility and scalability for every business size.",
        items: [
          {
            title: "Workflow builder",
            description: "Visual workflow builder for automated campaigns.",
          },
          {
            title: "Landing pages",
            description:
              "Landing page builder that connects emails to landing pages.",
          },
          {
            title: "Lead generation",
            description: "Signup forms and lead generation tools integration.",
          },
          {
            title: "CRM integration",
            description:
              "CRM integration for customer relationship management.",
          },
        ],
      },
      {
        type: "featuresSplit",
        eyebrow: "Email Marketing Agency",
        headline:
          "Work with an email marketing agency and see the full benefits",
        paragraphs: [],
        listHeading: "What You Get",
        items: [
          { text: "Consistent campaign management and optimization" },
          { text: "Access to the best email marketing software" },
          {
            text: "Strong sender reputation through proper scheduling & content quality",
          },
          { text: "Key features that support your long-term strategy" },
          { text: "SMS marketing capabilities for further outreach" },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960718/services-email-marketing-imgs/technico-email-marketing-agency_pwcdfu.png",
          alt: "Email marketing agency managing campaigns and automation",
        },
      },
      {
        type: "cta",
        title: "With Technico Solutions, every email serves a clear purpose.",
        description:
          "We help you communicate better, convert faster, and retain customers longer.",
        cta: { label: "Explore Our Services", href: "/services" },
      },
      {
        type: "introPanel",
        eyebrow: "Technico Digital Solutions",
        headline:
          "Technico Digital Solutions - your partner for strategic email marketing",
        paragraphs: [
          {
            text: "Email remains one of the most effective digital marketing tools for reaching and converting leads. Our email marketing capabilities and automation workflows give your business a smarter, more consistent way to connect with your target audience and existing customers.",
          },
          {
            text: "From planning to performance tracking, digital marketing experts at Technico Digital Solutions give you all the features and solutions needed for measurable growth.",
          },
          {
            text: "Simplify your marketing. Build stronger customer relationships. Let our digital marketing company create email campaigns that work for your business.",
            link: {
              label: "digital marketing company",
              href: "https://technicosolutions.com/",
            },
          },
        ],
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789960718/services-email-marketing-imgs/technico-email-marketing_n2ik0t.png",
          alt: "Email marketing campaigns that build stronger customer relationships",
        },
      },
      {
        type: "cta",
        title:
          "Upgrade your outreach with data-driven email marketing strategies customized to your business goals.",
        description:
          "Leave the marketing work to us and see how your customers grow.",
        cta: { label: "Set A Strategy Call", href: "/contact" },
      },
      {
        type: "faq",
        headline: ["Frequently asked", "questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question:
              "Will ecommerce businesses benefit from email marketing campaigns?",
            answer:
              "Through personalized messages, exclusive offers, and product recommendations, businesses can keep shoppers engaged and encourage repeat purchases. With the right email marketing services, e-commerce brands can nurture relationships, boost conversion rates, and turn occasional buyers into loyal customers.",
          },
          {
            question: "How do email marketing services work?",
            answer:
              "Email marketing works by helping your business connect directly with your market through targeted and personalized emails. Using a great email marketing platform, our marketers create campaigns, segment contact lists, and automate messages to reach the right people at the right time. These emails, such as newsletters, promotions, or updates, aim to build trust, strengthen relationships, and inspire specific actions like making purchases or engaging with the brand consistently.",
            link: {
              label: "segment contact lists",
              href: "https://help.sap.com/docs/SAP_EMARSYS/f8e2fafeea804018a954a8857d9dfff3/fdf57f2974c110148cf38fca9cd1c9ef.html",
            },
          },
          {
            question: "What are the limits of free email marketing services?",
            answer:
              "Free marketing services come with limits, like restricted contact lists, capped monthly sends, basic templates, and minimal automation options. These constraints make it hard to scale or track meaningful results. So, hiring professional email marketing services guarantees advanced targeting, analytics, and personalization. It’s the smarter path for businesses ready to grow customer reach effectively.",
          },
        ],
      },
    ],
  },
];

export async function getAllServices(): Promise<Service[]> {
  return services;
}

export async function getServiceBySlug(
  slug: string,
): Promise<Service | undefined> {
  return services.find((s) => s.slug === slug);
}

/**
 * Card/hero accent color per service, alternating pink/purple. Shared
 * by components/services/Services.tsx (the card grid) and
 * app/services/[slug]/page.tsx (the detail hero) so a service's
 * accent color is defined once and stays in sync between the two.
 */
export const SERVICE_ACCENT: Record<string, "pink" | "purple"> = {
  "search-engine-optimization": "purple",
  "website-design-and-development": "purple",
  "creative-design-and-content": "purple",
  advertising: "purple",
  "social-media-management": "purple",
  "email-marketing": "purple",
};

export function getServiceAccent(slug: string): "pink" | "purple" {
  return SERVICE_ACCENT[slug] ?? "purple";
}
