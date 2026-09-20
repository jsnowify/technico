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
          "Search Engine Optimization Services Built For Canadian Businesses",
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
        headline: "Custom SEO Services That Align With Your Business Goals",
        paragraph:
          "Let our Search Engine Optimization (SEO) services help your business climb the search engine results pages (SERPs) and reach your target audience.",
        cta: { label: "Get Custom SEO", href: "/contact" },
        items: [
          {
            icon: 0,
            title: "Keyword Research",
            description:
              "Keyword research identifies the search terms your target market uses to find products, services, and information related to your business. From there, we strategically optimize your web pages with targeted keywords to improve your rankings and make sure your content resonates with the right audience.",
          },
          {
            icon: 1,
            title: "Link Building",
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
            title: "On-Page SEO",
            description:
              "On-page SEO optimizes individual web pages so search engines can better understand their content and users can find relevant information. We fine-tune elements such as page content, title tags, meta descriptions, and other on-page signals to improve your website’s relevance and visibility in search results.",
          },
          {
            icon: 6,
            title: "Off-Page SEO",
            description:
              "Off-page SEO builds your website’s authority and reputation through signals beyond your own website. This can include link building, digital mentions, reputation management, and other strategies that strengthen your website’s credibility and support higher search rankings.",
          },
          {
            icon: 7,
            title: "White Hat SEO",
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
          "Maximize Conversions And Turn Organic\nTraffic Into Paying Customers",
        description:
          "Getting Traffic To Your Site Is Great. But The Challenge Is Turning That Traffic Into Real Customers. Our SEO Solutions Don't Just Bring Visitors, But Guide Them To Take Action. With The Right Website Content And A Deep Dive Into Google Analytics, We Tweak Every Page To Align With Google Rankings And Turn Those Clicks Into Sales.",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/f_avif/q_auto:best/f_webp/q_auto:best/dpr_auto/agency/technico-agency-1_qv5a4s.png",
          alt: "Two business partners shaking hands after a successful meeting",
        },
        features: [
          { text: "Optimized User Experience To Keep Visitors Engaged." },
          { text: "Clear, Compelling CTAs To Lead Them To Conversion." },
          {
            text: "Conversion Rate Optimization (CRO) Tactics To Boost ROI.",
            link: {
              label: "Conversion Rate Optimization",
              href: "https://digitalmarketinginstitute.com/blog/what-is-conversion-rate-optimization-cro",
            },
          },
        ],
      },
      {
        type: "cta",
        title: "Stop Wasting Traffic!",
        description:
          "Maximize Your SEO Efforts With Data-Driven Insights And Actionable Strategies To Convert Visitors Into Loyal Customers.",
        cta: {
          label: "Secure Your Free Strategy Consultation Today",
          href: "/contact",
        },
        spacing: "compact",
      },
      {
        type: "insights",
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/f_avif/q_auto:best/f_webp/q_auto:best/dpr_auto/f_auto/q_auto/agency/technico-agency-2_fljus5.png",
          alt: "A consultant listening closely to a client during a one-on-one conversation",
        },
        headline:
          "SEO Success With Clear, Actionable Insights – That's Our Commitment",
        intro:
          "We Don't Want To Keep You Guessing If SEO Works. Our SEO Specialists Guarantee You're Always In The Loop, With Insights That Help Keep Your Site Climbing The Ranks And Delivering Results. You Can Track Everything: Search Engine Rankings, Traffic, And Engagement. You Get:",
        items: [
          {
            title: "Detailed SEO Reporting & Performance Tracking",
            description:
              "Keep Your SEO Campaign Transparent With Detailed Monthly Reports That Show Exactly How Your Website Is Performing. Our SEO Specialists Track Keyword Rankings, Organic Traffic, Engagement, Conversions, And Other Important Performance Indicators To Measure Progress. Each Report Provides Clear Insights And Recommendations So You Understand What Is Driving Results And Where Your Campaign Needs Improvement.",
          },
          {
            title: "Continuous SEO Optimization & Strategy Refinement",
            description:
              "SEO Requires Ongoing Adjustments As Search Trends, Competitors, Algorithms, And Your Website Performance Change. Our SEO Team Continuously Analyzes Campaign Data To Identify Opportunities And Refine Your Strategy. From Technical SEO And On-Page Optimization To Content Updates And Keyword Targeting, We Make Data-Driven Improvements Designed To Strengthen Rankings, Increase Qualified Traffic, And Improve Your Website's Search Performance.",
          },
          {
            title: "Custom SEO Strategies & Actionable Recommendations",
            description:
              "Your Vancouver Business, Audience, And Competitive Landscape Are Unique, So Your SEO Strategy Should Not Follow A One-Size-Fits-All Approach. We Use Your Performance Data, Market Insights, And Search Behaviour To Develop And Adjust A Customized SEO Strategy Around Your Business Goals. You Receive Actionable Recommendations That Help Prioritize The Right Keywords, Content Opportunities, Technical Improvements, And Optimization Efforts For Sustainable Organic Growth.",
          },
        ],
      },
      {
        type: "cta",
        title: "Your Loyal Customers Know You. New Customers Don't.",
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
        headline: "SEO Company Delivering Guaranteed Results",
        description:
          "Our SEO Company Delivers Measurable Results Across Competitive Industries, Using Targeted Keywords, Local SEO, And Customized Strategies To Increase Rankings, Qualified Leads, Inquiries, Bookings, And Consultations. Here Are Examples Of Results Achieved For Businesses In Construction, Solar, Dental, And Legal Services.",
        items: [
          {
            title: "Solar Companies",
            description:
              "30% Boost In Google Rankings For High-Conversion Keywords With A 25% Increase In Qualified Leads",
          },
          {
            title: "Dental Clinics",
            description:
              "Custom Strategies Improved Local Search Results, Which Drove A 50% Increase In Appointment Bookings & Patient Inquiries.",
          },
          {
            title: "Construction Firms",
            description:
              "Optimized Keywords Boosted Search Engine Rankings, Resulting In A 40% Rise In Inbound Leads And Project Inquiries.",
          },
          {
            title: "Law Firms",
            icon: 12,
            description:
              "Achieved Top Search Engine Rankings, Which Resulted In A 35% Increase In Consultations And More Qualified Leads.",
          },
        ],
      },
      {
        type: "growBusiness",
        headline: ["Grow Your Business", "Local SEO Matters"],
        intro:
          "Don't Let Competitors Capture The Vancouver Customers Searching For Your Services. Vancouver Has 167,453 Licensed Businesses Competing For The Same Local Customers Searching On Google. If Your Website Isn't Visible On The First Page, Those Customers Are More Likely To Choose A Competitor Simply Because They Found Them First. The Impact Of Search Visibility Is Significant.",
        items: [
          {
            text: "97% Of Consumers Research A Business's Online Presence Before Visiting Its Location Or Making A Purchase.",
            tag: "What",
          },
          {
            text: 'More Than 200 Million "Near Me" Searches Were Made Each Month In Early 2026.',
            tag: "Are",
          },
          {
            text: "Local Businesses Get An Average Of 943 Views From Search And 317 From Google Maps. Being Visible On Both Helps Businesses Reach More Local Customers.",
            tag: "Waiting",
          },
          {
            text: "AI Overviews Now Appear In 68% Of Local Searches. Many Local Customers May See Google's AI-Generated Summary Before Reaching Individual Business Listings Or Websites.",
            tag: "You",
          },
        ],
        closing:
          "Want Your Business To Stand Out In Local Search? We Create Neighbourhood-Level Keyword Strategies For Vancouver Businesses Targeting Areas Such As Gastown, Yaletown, Kitsilano, Commercial Drive, Main Street, Burnaby, And Richmond. Each Location Receives Dedicated Keyword Research, Citation Building, And Locally Relevant Content.",
      },
      {
        type: "cta",
        title:
          "Technico Digital Solutions — Bringing Your Business to New Heights",
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
        headline: ["Frequently Asked", "Questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question: "Is It Worth Paying Someone To Do SEO?",
            answer:
              "Yes, Paying For Professional SEO Services Is Definitely Worth It. Search Engine Marketing (SEM) Requires Expertise To Achieve Good, Long-Term Results. A Dedicated SEO Expert Creates A Strategy That Improves Your Website's Ranking, Drives Quality Traffic, And Increases Conversions. Professional Services Guarantee You're Not Leaving Your Business Success To Chance.",
            link: {
              label: "Search Engine Marketing",
              href: "https://www.techtarget.com/searchcontentmanagement/definition/Search-engine-marketing-SEM",
            },
          },
          {
            question: "Can ChatGPT Do SEO?",
            answer:
              "While ChatGPT can assist with SEO for content creation, it’s not a substitute for a comprehensive SEO strategy. For the best results, your business needs the right digital agency to handle keyword optimization, internal linking, Google Ads, and other SEO efforts. ChatGPT can support creating relevant content, but SEO requires a more hands-on, specialized approach.",
          },
          {
            question: "Who Uses SEO The Most?",
            answer:
              "Businesses across various industries use SEO, but it’s particularly beneficial for e-commerce sites, local businesses, and service providers looking to increase online visibility. Companies with a dedicated internet marketing budget prioritize SEO to improve search rankings and attract more leads.",
          },
          {
            question:
              "Why Do I Need SEO If My Vancouver Business Already Has Loyal Customers?",
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
          "Website Design & Development Services for Canadian Businesses Moving Online",
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
        headline: "Web Design and Development Built Around Your Business",
        intro:
          "Technico Digital Solutions provides both web design and web development as an integrated service. Our web devs combine the visual and user-experience side of your website with the development needed to make it functional, responsive, fast, and ready to support your business online.",
        cta: { label: "Let's Work Together", href: "/contact" },
        columns: [
          {
            title: "Web Design",
            rows: [
              {
                icon: 0,
                label: "Focus",
                value: "How your website looks, feels, and guides visitors",
              },
              {
                icon: 1,
                label: "Visual Interface",
                value:
                  "Typography, imagery, buttons, spacing, & interface elements",
              },
              {
                icon: 2,
                label: "Layout & Structure",
                value:
                  "Organises page layouts, content placement, menus, navigation",
              },
              {
                icon: 3,
                label: "User Experience",
                value:
                  "Plans how visitors move through the website and find information",
              },
              {
                icon: 4,
                label: "Primary Outcome",
                value:
                  "Creates an intuitive, consistent experience for visitors",
              },
            ],
          },
          {
            title: "Web Development",
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
                label: "Website Build",
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
                label: "Primary Outcome",
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
        headline: "Get the Website Features Your Business Needs",
        paragraphs: [
          "Your website should do more than look good. It should work for your business.",
          "You don’t need to understand technical terms like databases, CRM integrations, SSO, or web-based programs before starting a website project. Tell us what you need your website to help you do, whether that’s taking payments, managing bookings, collecting enquiries, giving members secure access, connecting with your CRM, or creating tools your team can use behind the scenes. Marketing strategists at Technico can recommend and build the right website features around how your business operates and how your customers use your site.",
        ],
        // TODO: placeholder — swap for a real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        listHeading: "Database-driven custom solutions include:",
        items: [
          { text: "Mobile and user-friendly, responsive website" },
          {
            text: "Integration of association management and membership systems",
          },
          { text: "Shopping carts, e-commerce, and payment integration" },
          {
            text: "Single Sign-On (SSO) and password-protected content",
            link: {
              label: "Single Sign-On",
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
        headline: "Responsive Web\nDesign Services",
        paragraph:
          "Web design and SEO are closely connected because the way a website is built and presented can affect how easily people use it and how well search engines access its content. Responsive design helps your website work across mobile, tablet, and desktop devices, while clear navigation and page structure make it easier for visitors to find what they need.\n\nOur web designers also consider factors that can influence search performance, including page speed, Core Web Vitals, mobile usability, crawlability, and content structure. Custom web design does not improve rankings on its own, but a well-built website can create a stronger technical and user-experience foundation for SEO.",
        // TODO: placeholder — swap for the real phone-mockup + sketch-pages photo.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
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
          "Layouts that support SEO & Content",
        ],
      },
      {
        type: "imageStatement",
        eyebrow: "Propel . Business",
        headline:
          "Propel Your Business Goals, Don't Let A Poorly Built Website Limit Your Growth",
        cta: { label: "Let's Connect", href: "/contact" },
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        paragraph:
          "We are forward-thinking enough to make plans for the future. It's time to work with our web design company if you run into any of these problems.",
      },
      {
        type: "imageStatement",
        eyebrow: "Slow",
        headline: "Slow Page Speed Can Cost You Visitors",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        paragraph:
          "People Arrive On Your Website Expecting To Find An Answer Quickly. When A Page Keeps Them Waiting, That Delay Creates Friction Before They Have Even Read Your Offer, Checked Your Services, Or Reached Your Call To Action. Google Research Found That 53% Of Mobile Site Visits Were Abandoned When Pages Took Longer Than Three Seconds To Load. Google Also Recommends A Largest Contentful Paint (LCP) Of 2.5 Seconds Or Less, Which Measures How Quickly The Main Content Visible To A User Loads. Careless Coding, Oversized Images, Unnecessary Scripts, And Too Many Plugins Can All Weigh A Website Down. Our Web Developers Consider Performance During Development, So Your Pages Remain Fast And Easy To Use As Your Website Grows.",
      },
      {
        type: "imageStatement",
        eyebrow: "Poor",
        headline: "Poor Technical SEO Can Make Your Website Harder To Find",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        paragraph:
          "Technical SEO Helps Search Engines Find, Crawl, Index, And Interpret Your Pages. Google Specifically Notes That Website Design Can Make Indexing Difficult And That Pages Need To Meet Technical Requirements Before Google Can Find, Crawl, Index, And Consider Them For Search Results. That Is Why We Consider SEO During Website Development Instead Of Treating It As Something To Add After Launch. Site Structure, Internal Linking, Mobile Usability, Page Performance, Crawlability, Indexability, Redirects, And Other Technical Elements Can Be Addressed As The Website Is Built.",
      },
      {
        type: "imageStatement",
        eyebrow: "Website",
        headline: "Your Website Should Be Able To Grow With Your Business",
        // No `shape` set — defaults to "stairStep", same landscape
        // (1200x474) shape as Propel/Slow/Poor above, instead of the
        // near-square "column" shape which blew up to an enormous
        // height on full-bleed section widths.
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        paragraph:
          "A Five-Page Website Can Be Simple When Your Business First Launches. Sooner Or Later, You Will Be Adding Dozens Of Service Pages, Multiple Locations, Hundreds Of Products, Customer Accounts, Booking Systems, Payment Processing, CRM Integrations, Gated Content, Or New Marketing Campaigns. Consider These.",
        bullets: [
          "A Solar Company Could Start With Residential Installation And Later Add Commercial Solar, Battery Storage, EV Charging, Financing Information, And Individual Service-Area Pages.",
          "An E-Commerce Business Could Grow From 20 Products To 2,000.",
          "A Service Business Could Expand From One City Into Several Canadian Markets.",
        ],
        closingParagraph:
          "Your Website Architecture And Technology Need To Accommodate That Growth Without Becoming Difficult To Manage. Our Web Developers Consider What Your Business Needs Now And What The Website Could Need Next. That Gives You Room To Add Pages, Functionality, Integrations, And New Customer Journeys As Your Business Expands.",
      },
      {
        type: "process",
        eyebrow: "Web Development",
        headline: "Our Web Development And Web Design Process",
        paragraph:
          "The Best Thing About Our Web Design-Development Services Is That, Rather Than Taking A One-Size-Fits-All Approach, We Concentrate On Each Client Separately To Attend To Their Particular Concerns.",
        steps: [
          {
            title: "Research",
            description:
              "Every Project Requires Planning And A Deep Understanding Of Your Company. To Provide The Best Results, We Conduct Extensive Research.",
          },
          {
            title: "Build",
            description:
              "The Skilled Web Developers At Technico Digital Solutions Turn Your Design Into A Functional Website That Propels Your Company To Success.",
          },
          {
            title: "Web Designing",
            description:
              "Develop The Perfect Look By Fusing Functionality And Style To Promote The Success Of Your Company And Guarantee Peak Performance.",
          },
          {
            title: "Deploy",
            description:
              "Prepared For Launch After A Thorough Quality Assurance Procedure. To Make Sure Everything Runs Smoothly After Launch, Get Continuing Support.",
          },
        ],
      },
      { type: "techStack" },
      {
        type: "introPanel",
        eyebrow: "Technico",
        headline:
          "Technico Digital Solutions For Data-Driven and Professional Web Design and Development",
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
        // TODO: placeholder — swap for the real cube-grid photo once
        // one's picked (same placeholder used further down this
        // service's imageStatement sections).
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "faq",
        headline: ["Frequently Asked", "Questions"],
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
              "Can I Choose Web Design And Web Development Services Separately, Or Are They Only Offered As A Package?",
            answer:
              "You Can Choose Any Of The Services You Think Your Website Needs. But To Make Sure That You Are Availing The Right Service, What We Will Do Is Audit Your Website, Discuss Your Goals, And Research Competitors To See What Your Website Exactly Needs.",
          },
          {
            question: "How Much Time Is Needed To Complete The Website Design?",
            answer:
              "A Website Can Take Around 4 To 8 Weeks To Design And Develop. For Example, A Small Service Business Needing A 5 To 10-Page Website Could Be Closer To 2 To 3 Weeks. A Law Firm With Separate Pages For Multiple Practice Areas, Lawyer Profiles, Locations, Resources, And Lead Forms Could Take 3 To 4 Weeks Or Longer. Large E-Commerce Or Custom-Development Projects Can Also Require Additional Time. We Establish The Project Scope And Expected Timeline Before Development Starts.",
          },
          {
            question:
              "What Is Included In Website Design And Development Services?",
            answer:
              "Website Design And Development Services Can Include Website Planning, Custom Design, Responsive Development, Page Creation, Forms, Integrations, Performance Optimization, Testing, And Launch Support. You Can Hire Technico Digital Solutions For Website Design And Development As A Standalone Service. However, We Recommend Pairing Your New Website With A Digital Marketing And SEO Package. A Well-Built Website Gives Your Business The Foundation, But SEO, Content, And Other Marketing Strategies Help People Find It And Turn The Site Into An Active Source Of Traffic And Leads.",
          },
          {
            question: "Will My New Website Be Mobile-Friendly And SEO-Ready?",
            answer:
              "Yes. We Build Websites To Work Across Desktop, Tablet, And Mobile Devices And Consider Technical SEO Requirements During Development. However, An SEO-Ready Website Is Not The Same As An SEO-Optimized Website. Ranking For Valuable Searches Also Requires Keyword Research, Useful And Optimized Content, Service And Location Pages Where Appropriate, Authority Building, And Ongoing SEO Work. We Can Provide These Through Our SEO And Digital Marketing Services Rather Than Promising That Development Alone Will Make A New Website Rank.",
          },
          {
            question: "Do You Build E-Commerce Websites?",
            answer:
              "Yes. Our Devs At Technico Digital Solutions Build E-Commerce Websites For Businesses That Want To Sell Products Online. We Build Features Such As Product And Category Pages, Shopping Carts, Secure Payment Integrations, Customer Accounts, And Other E-Commerce Functionality. Our Web Designers And Developers Can Also Recommend A Suitable Platform And Setup Based On The Number Of Products You Sell And The Integrations Your Business Needs.",
          },
          {
            question: "Do You Provide Website Support After Launch?",
            answer:
              "Yes. We At Technico Digital Solutions Provide Website Support After Launch To Help Keep Your Website Functional, Secure, And Up To Date. Post-Launch Requirements Vary By Website, But Support Can Include Updates, Troubleshooting, Performance Checks, Content Changes, Functionality Improvements, And Additional Development As Your Business Grows.",
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
          "Graphic Design Services For Canadian Businesses Going Digital",
        paragraphs: [
          { text: "Your Brand Has A Story. We Make It Impossible To Ignore." },
          {
            text: "Technico Digital Solutions Is A Digital Marketing Agency In Canada Offering Graphic Design And Creative Content Services. Our Team Creates Brand Graphics, Website Visuals, Social Media Creative, Marketing Materials, And Other Digital Assets For Businesses Including Solar Companies, Automotive Businesses, Professional Services, And Local Service Providers. We Design Around The Business And The Audience Rather Than Using The Same Creative Approach For Every Client. A Solar Company Needs Visuals That Make Its Services And Technology Easier To Understand, While A Car Wash Or Detailing Business Relies Heavily On Strong Imagery To Show The Quality Of Its Work. Our Designers Consider Your Industry, Brand, Customers, And Where The Creative Will Appear Before Developing The Final Concept.",
          },
        ],
      },
      {
        type: "cta",
        title: "Transform Your Brand With Designs That Speak To Your Audience",
        description: "Collaborate With Our Team And Level Up Your Business.",
        cta: {
          label: "Get My Free Strategy Consultation",
          href: "/contact",
        },
      },
      {
        type: "insights",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        headline: "Building A Visual Identity That Defines Your Brand",
        intro:
          "Creating A Strong Brand Identity Doesn't Just Mean Having The Best Logos. It's About Telling Your Story In A Way That Grabs Attention. We Help Businesses Create A Distinct Brand Presence That Aligns With Your Values And Speaks Directly To Your True Market. Our Digital Design Solutions Simplify Even The Most Complex Ideas And Turn Them Into Relevant Visuals.",
        // No accordion items for this section — leave empty rather
        // than inventing Q&A-style entries that weren't provided.
        items: [],
        closingParagraph:
          "If You're Looking To Level Up Your Website Development Or Marketing Materials, Our Technico Digital Solutions Team Guarantees Your Brand Stands Out.",
      },
      {
        type: "results",
        headline:
          "Put Your Brand In The Spotlight With Graphic Design Services",
        description:
          "Visual Design Can Shape How People Judge A Business Online Before They Spend Much Time Reading Its Content. In Stanford's Web Credibility Research, 46.1% Of Comments About Website Credibility Referred To The Site's Design, Including Its Layout, Typography, Images, White Space, And Colour Scheme. People Form Visual Impressions Of Websites Remarkably Quickly. Another Research Published By Google Found That A Website's Visual Complexity Can Influence Aesthetic Judgments Within The First 50 Milliseconds Of Viewing It. Our Designers Create Visuals Around Your Brand, Audience, And Marketing Channel So The Creative Remains Consistent While Still Serving The Purpose Of Each Campaign.",
        descriptionLink: {
          label: "Stanford's Web Credibility Research",
          href: "https://credibility.stanford.edu/pdf/How_Do_People_Evaluate_a_Web_Site%27s_Credibility_v37.pdf",
        },
        items: [
          {
            title: "Website Graphics",
            description:
              "Include Banners, Custom Images, Icons, And Other Visual Elements Used Across Your Website. Web Graphics Support Your Content, Highlight Information And Help Visitors Navigate Your Pages.",
          },
          {
            title: "Logo Design & Branding",
            description:
              "A Unique Logo Is Your Brand's First Impression. Effective Branding Creates A Lasting Visual Identity That Speaks To Your Values And Connects With Your Audience.",
          },
          {
            title: "UI/UX Design Elements",
            description:
              "Great UI/UX Design Is All About Simplicity And Functionality. Elements Include Buttons, Menus, Forms, Navigation, And Other Interactive Parts Of Your Website.",
            link: {
              label: "UI/UX",
              href: "https://www.figma.com/resource-library/difference-between-ui-and-ux/",
            },
          },
          {
            title: "Social Media Graphics",
            description:
              "Bold And Engaging Graphics Grow Your Social Media Presence. Managing Instagram, Facebook, Or Any Other Platform? Quality Visuals Make Posts Stand Out.",
          },
          {
            title: "Email Templates",
            description:
              "Custom Email Templates Make Sure Your Communication Looks Polished And Professional. From Newsletters To Promotions, We Keep Your Brand Consistent And On-Brand With Every Send.",
          },
          {
            title: "Digital Ads",
            description:
              "Digital Ad Graphics Are Visual Assets Made For Paid Campaigns Across Search And Other Advertising Platforms. Let's Turn Clicks Into Conversions To Guarantee Your Message Reaches The Right Audience.",
          },
        ],
      },
      {
        type: "contentPillars",
        eyebrow: "Content",
        headline: "Content Creation That Keeps Your Brand Message Consistent",
        paragraph:
          "Graphic Design Determines How Your Marketing Looks, While Content Determines What It Says. Technico Digital Solutions Provides Both As Part Of Its Digital Marketing Services. We Keep The Visuals And Messaging Aligned Across Websites, Search Content, Social Media, Advertising, And Other Marketing Channels.",
        quote:
          "A Landing Page Needs More Than An Attractive Layout. It Also Needs Copy That Explains The Offer And Gives Visitors A Reason To Take The Next Step. A Social Media Campaign Needs Graphics That Catch Attention And Captions Or Ad Copy That Communicate The Message. Our Creative And Marketing Teams Bring These Elements Together Around The Same Brand And Campaign Goals.",
        quoteAttribution: "Marketing Experts At Technico Digital Solutions",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        items: [
          {
            title: "Landing Page Design & Copy",
            description:
              "Combine Persuasive Copy With Purposeful Design To Guide Visitors Toward Action. We Create Landing Pages Where The Messaging, Layout, Visuals, And Calls To Action Work Together To Make Your Offer Easy To Understand.",
          },
          {
            title: "Website Graphics & Content",
            description:
              "Bring Your Website Together With Visuals And Content That Support The Same Message. From Page Graphics And Branded Imagery To Clear Website Copy, We Help Create A Consistent Experience That Reflects Your Brand And Keeps Visitors Engaged.",
          },
          {
            title: "Social Media Creative & Ad Copy",
            description:
              "Your Brand Must Communicate Clearly Across Digital Platforms. We Pair Attention-Grabbing Graphics With Captions And Ad Copy Built Around Your Campaign. We Create Social Media Assets That Keep Your Visuals And Messaging Consistent.",
          },
          {
            title: "Brand Storytelling & Product Descriptions",
            description:
              "Build A Stronger Brand Presence By Aligning What Your Business Says With How It Looks. We Combine Brand Messaging, Visual Direction, And Storytelling To Communicate Your Identity Across Marketing Materials And Customer Touchpoints.",
          },
        ],
      },
      {
        type: "cta",
        title: "Ready To Take Your Digital Presence To The Next Level?",
        description:
          "Let's Create Stunning Visuals And Compelling Content That Drive Real Results.",
        cta: {
          label: "Arrange a Discovery Call",
          href: "/contact",
        },
      },
      {
        type: "pillarCards",
        eyebrow: "Graphic Design",
        headline:
          "How Graphic Design Drives Qualified Leads And Customers To Your Site",
        intro:
          "Graphic Design Acts As A High-Precision Filter That Attracts The Right Audience While Simultaneously Guiding Them Through The Sales Funnel. In A Digital Space Flooded With Generic Content, Intentional Design Serves As A Beacon For Your Ideal Customer.",
        items: [
          {
            title: "Strategic",
            description:
              "Strategic Use Of Colour Theory, Imagery, And Style Attracts The Right Audience.",
          },
          {
            title: "Instant Trust",
            description:
              "A Well-Designed Landing Page Creates Instant Trust And A Sense Of Security For First-Time Visitors.",
          },
          {
            title: "Calls-To-Action",
            description:
              "Strategic Placement Of Call-To-Action Buttons Makes The Next Steps Obvious.",
          },
          {
            title: "Content Structure",
            description:
              "Clear Structure Of Data And Benefits Breaks Complex Information Into Digestible, Scannable Sections.",
          },
        ],
        closingParagraph:
          "Strategic Design Eliminates User Guesswork And Provides A Seamless Transition From Curiosity To A Lead. By Aligning Your Visual Identity With Audience Expectations, You Make Your Site Traffic Relevant And Ready To Engage.",
      },
      {
        type: "highlights",
        eyebrow: "Why Technico",
        headline:
          "Creative Graphic Design Company with a Collaborative Approach",
        paragraph:
          "When you choose Technico Digital Solutions as your graphic design firm, you can expect more than great graphics. Our designers and content creators collaborate closely to make sure that every element of your marketing, from visuals to messaging, perfectly aligns for maximum impact.",
        items: [
          {
            icon: 0,
            title: "Data-Informed Designs",
            description: "Backed by strategic insight.",
          },
          {
            icon: 1,
            title: "Fast Turnaround",
            description: "To keep projects on track.",
          },
          {
            icon: 2,
            title: "Effective Communication",
            description: "To keep you in the loop.",
          },
          {
            icon: 3,
            title: "Multi-Industry Experience",
            description: "To create workable designs.",
          },
          {
            icon: 4,
            title: "Content Alignment",
            description: "For brands to shine consistently.",
          },
          {
            icon: 5,
            title: "Unique Approach",
            description: "To meet your unique specifications.",
          },
        ],
      },
      {
        type: "process",
        eyebrow: "Graphic Design",
        headline: "Technico's Graphic Design Process",
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
            title: "Creative Direction",
            description:
              "Get a defined visual and messaging direction based on your brand.",
          },
          {
            title: "Design & Content Creation",
            description:
              "See your ideas take shape through visuals and copy created to work together.",
          },
          {
            title: "Review & Revisions",
            description:
              "Review the work, provide feedback and request refinements if necessary.",
          },
          {
            title: "Final Delivery",
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
          "Let a Digital Marketing and Design Agency Level Up Your Digital Presence",
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
        // TODO: placeholder — swap for the real cube-grid photo once
        // one's picked (same placeholder used in Web Development's
        // introPanel above).
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
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
        headline: ["Frequently Asked", "Questions"],
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
        headline: "Strategic Media Buying For Businesses Across Vancouver",
        paragraphs: [
          { text: "Target Smarter. Spend Wiser. Grow Faster." },
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
          "Don't Pressure Yourself To Handle Every Aspect Of Your Business",
        description:
          "Leave The Marketing Strategy To Our Team. Our Digital Marketing Experts Capture Your Target Audience And Turn Them Into Customers.",
        cta: {
          label: "Let's Discuss Your Digital Marketing Strategies",
          href: "/contact",
        },
      },
      {
        type: "highlights",
        eyebrow: "Digital Marketing Services",
        headline: "Put Your Ad Budget Where It Works Hardest",
        paragraph:
          "Media buying is the process of selecting and purchasing advertising placements across relevant channels to reach a defined audience within a specific budget. It includes media planning, platform selection, audience targeting, ad placement, budget allocation, campaign monitoring, and ongoing optimization. Technico Digital Solutions manages this process across paid search, PPC, and social media advertising. We help you decide where your ads should run, how your budget should be distributed, which audiences to target, and how campaigns should be adjusted based on performance.",

        items: [
          {
            icon: 0,
            title: "Search Engine Marketing (SEM)",
            description:
              "SEM puts your business in front of people actively searching for products or services like yours. Technico plans and manages paid search campaigns around relevant keywords, search intent, audience location, ad messaging, and budget. Platforms & Tools: Google Ads, Microsoft Advertising, Google Keyword Planner, Google Analytics 4",
          },
          {
            icon: 1,
            title: "Pay-Per-Click Advertising (PPC)",
            description:
              "PPC is an advertising model where you pay when someone clicks your ad. Technico manages PPC campaigns by setting budgets, choosing targeting criteria, monitoring cost per click and conversions, testing ads, and adjusting bids based on campaign performance. Platforms & Tools: Google Ads, Microsoft Advertising, Google Analytics 4, Google Tag Manager",
          },
          {
            icon: 2,
            title: "Paid Social Advertising",
            description:
              "Paid social advertising places sponsored content in front of selected audiences on social media platforms. We use audience targeting based on factors such as location, interests, demographics, behaviour, and customer data to reach relevant users. Platforms & Tools: Meta Ads Manager, LinkedIn Campaign Manager, TikTok Ads Manager, Google Analytics 4",
          },
        ],
        closingParagraph:
          "These channels can work separately or as part of one media buying strategy. SEM uses paid search campaigns to reach people already searching for relevant products or services, while paid social helps you reach and re-engage targeted audiences across social platforms. PPC, on the other hand, describes the payment model where you pay when someone clicks your ad. PPC can be used across search, display, social media, and other digital advertising channels.",
      },
      {
        type: "highlights",
        eyebrow: "Media Buying Services",
        headline: "How We Manage Your Media Buying",
        paragraph:
          "Media buying involves more than purchasing ad space. At Technico Digital Solutions, we plan where your advertising budget should go, identify the audiences and channels worth targeting, manage digital media purchases and placements, and monitor campaign performance. Each decision is based on your audience, budget, campaign goals, and the results your ads generate.",
        items: [
          {
            icon: 3,
            title: "Media Planning & Strategy",
            description:
              "Your media plan defines how your advertising budget will be used based on your goals, target market, and campaign priorities. It identifies which channels to use, how much budget to allocate, and how to structure your campaigns before advertising begins.",
          },
          {
            icon: 4,
            title: "Audience & Channel Targeting",
            description:
              "Your ads target specific audiences across the channels most relevant to your campaign. Targeting can consider search intent, location, demographics, interests, behaviours, and existing customer audiences, depending on the advertising platform.",
          },
          {
            icon: 5,
            title: "Digital Media Buying",
            description:
              "We allocate your advertising budget across the digital platforms and campaigns included in your media plan. Bids, spending, and budget distribution are managed based on campaign priorities and performance, so more of your investment can be directed toward opportunities producing stronger results.",
          },
          {
            icon: 6,
            title: "Ad Placement & Campaign Management",
            description:
              "Your ads are placed across selected platforms, placements, and audience segments based on your media strategy. Once campaigns are live, we monitor clicks, conversions, costs, and audience response so we can adjust targeting, placements, bids, and budgets as performance data comes in.",
          },
        ],
        closingParagraph:
          "Campaign measurement guides where your advertising budget goes next. If one audience, channel, keyword, placement, or campaign delivers stronger results at an acceptable cost, you can direct more budget toward it. You can adjust underperforming campaigns by changing targeting, bids, placements, creative, landing pages, or budget allocation.",
      },
      {
        type: "insights",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        headline:
          "Delivering High-Performance Marketing To Multiple Industries",
        intro:
          "Getting to the top of organic search results can take time, especially when your business competes for keywords already targeted by established websites. The difficulty varies by industry, location, keyword, and the strength of the businesses already ranking. That is where paid media can help fill the gap while your organic visibility develops.",
        items: [
          {
            title: "When Paid Search Can Make Sense Alongside SEO",
            description:
              "SEO and paid advertising serve different purposes. SEO builds organic visibility over time, while paid search can put your business in front of people searching for your services as soon as a campaign is running. For competitive searches, using both can give your business immediate paid visibility while you work toward stronger organic rankings.\n\nFor example, a law firm entering a competitive market could use PPC to appear for selected legal searches while building out service pages and organic authority. A solar company could run paid campaigns around high-intent installation searches, while a car detailing business could target people searching within specific service areas.",
          },
          {
            title: "How PPC Costs Work",
            description:
              "With PPC advertising, you pay when someone clicks your ad rather than simply paying to appear in search results. The amount you pay for each click is not fixed. Cost-per-click estimates can range from a few dollars to considerably more depending on the keyword, industry, location, audience, competition, and commercial value of the search.\n\nLet’s say, if a keyword has an estimated $10 cost per click and your campaign receives 100 paid clicks, the click cost would be roughly $1,000 before management fees or other campaign costs. The actual amount can be higher or lower because advertisers compete through real-time ad auctions.\n\nThe cheapest click isn’t necessarily the goal. A $15 click that generates a qualified customer can be more valuable than a $3 click from someone unlikely to buy. Campaign performance should therefore be evaluated using conversions, cost per lead, customer acquisition cost, and return on ad spend, not CPC alone.",
          },
        ],
      },
      {
        type: "featuresSplit",
        eyebrow: "Industries We Serve",
        headline: "Your Industry Changes The Media Buying Strategy",
        paragraphs: [
          "Advertising competition isn’t equal across industries. Legal services, medical services, home services, automotive businesses, construction companies, renewable energy providers, and hospitality businesses can face very different search competition, CPCs, customer values, and buying cycles. That is why your media plan should consider your industry, target location, keyword competition, estimated CPC, search intent, conversion value, and available budget before deciding where your advertising dollars should go.",
        ],
        listHeading: "Industries We Work With",
        items: [
          { text: "Automotive Car" },
          { text: "Travel & Hospitality" },
          { text: "Health And Wellness" },
          { text: "Medical Services" },
          { text: "Legal Services" },
          { text: "Home Improvement" },
          { text: "Home Services" },
          { text: "Construction" },
          { text: "Renewable Energy" },
        ],
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "imageStatement",
        eyebrow: "Digital Advertising Funnels",
        headline: "Building Paid Campaigns Around Leads, Not Just Clicks",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
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
        headline: "The #1 Digital Advertising Company For Your Business",
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
        // TODO: placeholder — swap for the real photo once one's
        // picked (same placeholder used elsewhere in this service).
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "faq",
        headline: ["Frequently Asked", "Questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question:
              "Should I Work With A Local Digital Advertising Company For My Business?",
            answer:
              "Yes, working with a local digital advertising company and a digital marketing agency gives you a clear advantage because they understand your local market, audience, and competition. A local team also makes communication easier and faster. They can create personalized strategies across digital platforms to increase website traffic, generate more qualified leads, and drive sales while aligning with your business goals.",
          },
          {
            question: "Should Small Businesses Hire A Marketing Agency?",
            answer:
              "Yes, small businesses can benefit greatly from hiring a marketing agency. Agencies bring expertise, tools, and strategies that may be difficult to manage in-house. Even on a limited budget, they can provide solutions to grow your business effectively.",
          },
          {
            question:
              "How Long Does It Take To See Results After Hiring A Digital Advertising Company?",
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
        headline: "Social Media Management That Boosts Engagement & Growth",
        paragraphs: [
          {
            text: "Strategically Manage Your Social Media And Turn Followers Into Loyal Customers.",
          },
          {
            text: "Leave All Your Social Media Management In The Hands Of The Experienced Digital Marketing Team At Technico Digital Solutions. Our Social Media Efforts Focus On Building An Active, Engaged Following Of Potential Customers. Your Brand Deserves Premium Content, Not Outdated Tactics, So We Dedicate Our Expertise Exclusively To Delivering Effective Social Media Services.",
          },
        ],
      },
      {
        type: "cta",
        title:
          "Grow Your Social Media Presence With Genuine Engagement, Not Just Anyone",
        description:
          "Achieve Real Results With Effective Strategies From Marketing Experts.",
        cta: {
          label: "Begin Your Social Media Campaigns Now",
          href: "/contact",
        },
      },
      {
        type: "featuresSplit",
        eyebrow: "Social Media Strategy",
        headline: "Why Your Business Needs A Social Media Marketing Strategy",
        paragraphs: [
          "SMM For Small Businesses Can Be Challenging, But You're Not Alone. It's Possible To Grow Your Social Media Accounts And Achieve Your Marketing Goals.",
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
        // TODO: placeholder — swap for a real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "featuresSplit",
        eyebrow: "Channel Monitoring",
        headline: "Stay Ahead With Ongoing Channel Monitoring & Optimization",
        paragraphs: [
          "Anyone Can Post Or Create Content, But What You Need Is A Team That Can Truly Make A Difference For Your Social Media Accounts — Using Proven Strategy And The Right Social Media Management Tools To Drive Consistency, Performance, And Real Results.",
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
        // TODO: placeholder — swap for a real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "insights",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        headline: "You Deserve An Expert To Manage Your Social Media Accounts",
        intro:
          "Don’t settle for less, and don’t try to do it all yourself. You need a social media management team that can help you manage multiple social media channels. Here’s what you should ask an agency.",
        items: [
          {
            title: "Are You Effectively Measuring Social Media ROI?",
            description:
              "We continuously monitor traffic, engagement, and conversions from all of your channels using live reporting. Our strategies assign a specific value to each conversion. This gives our clients an understanding of their return on investment.",
          },
          {
            title: "Do They Have Full Transparency?",
            description:
              "Clients can review our service quality through our excellent feedback and high ratings. We maintain a strong reputation on Google. This reflects our commitment to transparency and reliability. Our services keep businesses one step ahead of the competition.",
            link: {
              label: "strong reputation on Google",
              href: "https://www.localfalcon.com/blog/how-google-reputation-management-improves-your-rankings-and-how-to-do-it",
            },
          },
          {
            title: "Can You Handle An Average Agency?",
            description:
              "We go beyond the typical agency approach to deliver exceptional results for our clients. Our strategies, expertise, and dedication make sure businesses achieve measurable growth.",
          },
        ],
      },
      {
        type: "introPanel",
        eyebrow: "Technico",
        headline: "Work With Us Because Your Success Is Our Top Priority",
        paragraphs: [
          {
            text: "You May Rely On Social Media Management Software To Help You, But Nothing Beats The Work Of An Expert. Technico Digital Solutions, A Digital Marketing Company, Gets Into The Details When Managing Our Clients' Accounts.",
          },
          {
            text: "We Rely On Research And Implement Strategies That Work Best For You, Supported By The Right Social Media Management Tools, And We Don't Copy-Paste Strategies Just Because You Have The Same Industry As Our Other Clients. We Give You A Unique Plan, One That Will Bring You Better Leads Turned Into Customers.",
          },
        ],
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "faq",
        headline: ["Frequently Asked", "Questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question: "What Social Media Accounts Do You Manage?",
            answer:
              "All Of The Major Platforms, Including Facebook, Instagram, TikTok, YouTube, LinkedIn, X (Formerly Twitter), And Pinterest, Are Managed By Our Social Media Management Team. Our Instagram Management Services Are Different From Our LinkedIn Approach Because We Specialize In Platform-Specific Tactics.",
          },
          {
            question: "What Is Your Process To Social Media Management?",
            answer:
              "Social Media Brand Management Involves Maintaining And Enhancing Your Brand's Reputation On Social Media Platforms. Our Service Includes Using Consistent Messaging, Monitoring Your Online Presence, And Engaging With Your Audience To Increase Brand Awareness And Loyalty.",
            link: {
              label: "Brand Management",
              href: "https://limbd.org/brand-management-definition-importance-elements-principles-benefits-examples-tips-for-effective-brand-management/",
            },
          },
          {
            question:
              "Will You Apply The 5-5-5 Rule To Your Social Media Strategy?",
            answer:
              "We Customize Our Social Media Strategy To Meet The Unique Requirements Of Every Company. The 5-5-5 Rule Is Not Always Necessary. In The 5-5-5 Rule, You Should Share Five Posts Of Original Content From Other People Or A Link To Resources Outside Of Your Company Or Yourself On Your Social Networks For Every Five Promotional Pieces You Post. You Should Also Interact With Your Audience In Five Different Ways, Such As Liking Or Responding To Comments On Your Page.",
            emphasis: "5-5-5 Rule",
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
          "Simplify Your Outreach With Scalable Email Marketing Services",
        paragraphs: [
          {
            text: "Every Message Matters. We Make Yours Stand Out In The Inbox.",
          },
          {
            text: "Your Business Deserves Consistent Engagement That Actually Leads To Sales. Yet Sending Out Random Emails Without A Clear Plan Wastes Effort And Resources. That's Where Our Best Email Marketing Services Come In. Technico Solutions Helps You Create Meaningful Connections With Your Audience Through Campaigns That Inform, Convert, And Retain.",
            link: {
              label: "Email Marketing Services",
              href: "https://technicosolutions.com/services/email-marketing/",
            },
          },
          {
            text: "Our Digital Experts Combine Strategy, Creativity, And Technology To Manage Your Email Marketing Efforts From Start To Finish. You Gain Access To Powerful Email Marketing Tools And Automation Features That Make Every Message Purposeful And Easy To Manage.",
          },
        ],
      },
      {
        type: "cta",
        title:
          "Boost Engagement With Targeted Email Campaigns That Deliver Real Results.",
        description:
          "Partner With Technico Digital Solutions And Simplify How You Connect With Your Audience.",
        cta: { label: "Start Email Campaign", href: "/contact" },
      },
      {
        type: "featuresSplit",
        eyebrow: "Email Marketing Solutions",
        headline: "Your Competitive Edge With Our Email Marketing Solutions",
        paragraphs: [
          "Your Customers Check Their Inboxes Daily. A Well-Timed Email Can Drive Them Straight To Your Website. We Help You Reach Them Through Highly Targeted Campaigns Built On Real Data And Customer Insight.",
          {
            text: "Every Campaign Is Monitored And Optimized For Open Rates, Click-Throughs, And Conversions. You Get Measurable Outcomes And Full Control Over Your Marketing Strategy.",
            link: {
              label: "Click-Throughs",
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
        // TODO: placeholder — swap for a real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "process",
        eyebrow: "Email Marketing Process",
        headline: "Laying The Foundation For A Successful Email Campaign",
        paragraph:
          "Let our digital marketers plan a strong email marketing strategy by understanding your audience and defining your business goals. Our process guarantees every email serves a purpose and every send moves you closer to your goals.",
        steps: [
          {
            title: "Planning & Segmentation",
            description:
              "Using Advanced Segmentation To Identify Customer Groups And Send Personalized Messages That Match Their Interests.",
          },
          {
            title: "Design & Content",
            description:
              "Our Email Editor Makes It Easy To Design Responsive Email Templates That Look Great On Any Device.",
          },
          {
            title: "Automation Setup",
            description:
              "We Create Automated Workflows That Send The Right Emails At The Right Time, From Welcome Messages To Re-Engagement Campaigns.",
          },
          {
            title: "Testing & Optimization",
            description:
              "Every Campaign Goes Through A/B Testing To Improve Subject Lines, Visuals, And Calls To Action.",
          },
          {
            title: "Reporting",
            description:
              "You'll Receive Clear, Easy-To-Read Reports On What's Performing And What Can Be Improved.",
          },
        ],
      },
      {
        type: "results",
        headline: "All The Tools To Power Your Email Marketing Success",
        description:
          "Managing Emails Manually Takes Time. That's Why Our Solutions Combine Email Marketing With Automation And Advanced Features, So Your Business Can Consistently Keep Up With The Trend. Our Email Marketing Agency Uses The Best Email Marketing Platforms Available To Provide Flexibility And Scalability For Every Business Size.",
        items: [
          {
            title: "Workflow Builder",
            description: "Visual Workflow Builder For Automated Campaigns.",
          },
          {
            title: "Landing Pages",
            description:
              "Landing Page Builder That Connects Emails To Landing Pages.",
          },
          {
            title: "Lead Generation",
            description: "Signup Forms And Lead Generation Tools Integration.",
          },
          {
            title: "CRM Integration",
            description:
              "CRM Integration For Customer Relationship Management.",
          },
        ],
      },
      {
        type: "featuresSplit",
        eyebrow: "Email Marketing Agency",
        headline:
          "Work With An Email Marketing Agency And See The Full Benefits",
        paragraphs: [],
        listHeading: "What You Get",
        items: [
          { text: "Consistent Campaign Management And Optimization" },
          { text: "Access To The Best Email Marketing Software" },
          {
            text: "Strong Sender Reputation Through Proper Scheduling & Content Quality",
          },
          { text: "Key Features That Support Your Long-Term Strategy" },
          { text: "SMS Marketing Capabilities For Further Outreach" },
        ],
        // TODO: placeholder — swap for a real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "cta",
        title: "With Technico Solutions, Every Email Serves A Clear Purpose.",
        description:
          "We Help You Communicate Better, Convert Faster, And Retain Customers Longer.",
        cta: { label: "Explore Our Services", href: "/services" },
      },
      {
        type: "introPanel",
        eyebrow: "Technico Digital Solutions",
        headline:
          "Technico Digital Solutions - Your Partner for Strategic Email Marketing",
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
        // TODO: placeholder — swap for a real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
      },
      {
        type: "cta",
        title:
          "Upgrade Your Outreach With Data-Driven Email Marketing Strategies Customized To Your Business Goals.",
        description:
          "Leave The Marketing Work To Us And See How Your Customers Grow.",
        cta: { label: "Set A Strategy Call", href: "/contact" },
      },
      {
        type: "faq",
        headline: ["Frequently Asked", "Questions"],
        cta: { label: "Get In Touch", href: "/contact" },
        items: [
          {
            question:
              "Will Ecommerce Businesses Benefit From Email Marketing Campaigns?",
            answer:
              "Through personalized messages, exclusive offers, and product recommendations, businesses can keep shoppers engaged and encourage repeat purchases. With the right email marketing services, e-commerce brands can nurture relationships, boost conversion rates, and turn occasional buyers into loyal customers.",
          },
          {
            question: "How Do Email Marketing Services Work?",
            answer:
              "Email marketing works by helping your business connect directly with your market through targeted and personalized emails. Using a great email marketing platform, our marketers create campaigns, segment contact lists, and automate messages to reach the right people at the right time. These emails, such as newsletters, promotions, or updates, aim to build trust, strengthen relationships, and inspire specific actions like making purchases or engaging with the brand consistently.",
            link: {
              label: "segment contact lists",
              href: "https://help.sap.com/docs/SAP_EMARSYS/f8e2fafeea804018a954a8857d9dfff3/fdf57f2974c110148cf38fca9cd1c9ef.html",
            },
          },
          {
            question: "What Are The Limits Of Free Email Marketing Services?",
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
