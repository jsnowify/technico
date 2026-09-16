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
        items: [
          {
            icon: 0,
            title: "Keyword Research",
            description:
              "Keyword Research Identifies The Search Terms Your Target Market Uses To Find Products, Services, And Information Related To Your Business. From There, We Strategically Optimize Your Web Pages With Targeted Keywords To Improve Your Rankings And Make Sure Your Content Resonates With The Right Audience.",
          },
          {
            icon: 1,
            title: "Link Building",
            description:
              "Link Building Helps Strengthen Your Website's Authority By Earning Quality Backlinks From Relevant And Trusted Websites. Our Link-Building Strategy Focuses On Securing Quality Backlinks From Trusted Websites In Your Industry, These Links Will Boost Your Authority And Help Your Business Rank Higher On Search Results, By Using White-Hat SEO Techniques, Your Rankings Grow Naturally And Sustainably.",
          },
          {
            icon: 2,
            title: "Technical SEO",
            description:
              "Technical SEO Improves How Search Engines Crawl, Index, And Understand Your Website. Our Technical SEO Services Include Site Audits, Fixing Technical Errors, And Addressing Issues That Slow Down Your Website. By Improving Your Site's Performance, We Make It Easier For Search Engines To Crawl Your Content And Increase Your Brand Visibility Across Search Engines.",
          },
          {
            icon: 3,
            title: "Local SEO",
            description:
              "Local SEO Helps Your Business Appear In Search Results When Potential Customers Look For Services In Your Area. We Optimize Your Google Business Profile And Other Local Search Signals To Improve Your Visibility For Nearby Searches, Attract High-Intent Traffic, And Grow Your Local Presence.",
          },
          {
            icon: 4,
            title: "International SEO",
            description:
              "International SEO Helps Search Engines Serve The Right Version Of Your Website To Users In Different Countries, Regions, And Languages. We Optimize Your Website For International Search Visibility So You Can Expand Your Reach Across Markets Without Losing Focus On The Customers Most Relevant To Your Business.",
          },
          {
            icon: 5,
            title: "On-Page SEO",
            description:
              "On-Page SEO Optimizes Individual Web Pages So Search Engines Can Better Understand Their Content And Users Can Find Relevant Information. We Fine-Tune Elements Such As Page Content, Title Tags, Meta Descriptions, And Other On-Page Signals To Improve Your Website's Relevance And Visibility In Search Results.",
          },
          {
            icon: 6,
            title: "Off-Page SEO",
            description:
              "Off-Page SEO Builds Your Website's Authority And Reputation Through Signals Beyond Your Own Website. This Can Include Link Building, Digital Mentions, Reputation Management, And Other Strategies That Strengthen Your Website's Credibility And Support Higher Search Rankings.",
          },
          {
            icon: 7,
            title: "White Hat SEO",
            description:
              "White Hat SEO Uses Search Optimization Techniques That Follow Search Engine Guidelines And Focus On Sustainable Organic Growth. We Avoid Keyword Stuffing And Black-Hat Tactics And Focus Instead On Useful Content, Relevant Optimization, And Strategies Intended To Build Lasting Search Visibility.",
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
            emphasis: "Conversion Rate Optimization",
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
            emphasis: "Search Engine Marketing",
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
        headline: "Get The Website Features Your Business Needs",
        paragraphs: [
          "Your website should do more than look good. It should work for your business. You don't need to understand technical terms like databases, CRM integrations, SSO, or web-based programs before starting a website project. Yet ultimately, you need your website to help you do, whether that's taking payments, managing bookings, collecting enquiries, giving members secure access, connecting with your CRM, or creating tools your team can use behind the scenes. Marketing strategists at Technico can recommend, and build the right website features around how your business operates and how your customers use your site.",
        ],
        // TODO: placeholder — swap for a real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        listHeading: "Database-Driven Custom Solutions Include",
        items: [
          { text: "Mobile and user-friendly, responsive website" },
          {
            text: "Integration of association management and membership systems",
          },
          { text: "Shopping carts, e-commerce, and payment integration" },
          {
            text: "Single Sign-On (SSO) and password-protected content",
            emphasis: "Single Sign-On (SSO)",
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
          "Web Design And SEO Are Closely Connected Because The Way A Website Is Built And Presented Can Affect How Easily People Use It And How Well Search Engines Access Its Content. Responsive Design Helps Your Website Work Across Mobile, Tablet, And Desktop Devices, While Clear Navigation And Page Structure Make It Easier For Visitors To Find What They Need. Our Web Designers Also Consider Factors That Can Influence Search Performance, Including Page Speed, Core Web Vitals, Mobile Usability, Crawlability, And Content Structure. Custom Web Design Does Not Improve Rankings On Its Own, But A Well-Built Website Can Create A Stronger Technical And User-Experience Foundation For SEO.",
        // TODO: placeholder — swap for the real phone-mockup + sketch-pages photo.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        cta: { label: "Let's Connect", href: "/contact" },
        checklist: [
          "Responsive For Desktop, Tablet, & Mobile",
          "Clear Navigation And Page Structure",
          "Fast-Loading Pages And Performance Improvements",
          "Mobile Usability",
          "Core Web Vitals",
          "Search-Friendly Content Structure",
          "Visual Consistency Across The Website",
          "Layouts That Support SEO & Content",
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
          "Technico Digital Solutions For Data-Driven And Professional Web Design And Development",
        paragraphs: [
          {
            text: "Web Design And Development Is A Marketing Strategy You Need To Create A Trusted Website That Your Customers Will Enjoy. Website Design And Development Is Not Just About Aesthetics; It Also Includes Factors Like Loading Speed, Menu Design, Accessibility, And Overall User Experience.",
          },
          {
            text: "While Some Platforms Allow You To Customize A Website Easily, They Don't Cover Everything Your Business Needs. That's Why It's Necessary To Hire Professional Website Developers And Designers. Partner With Technico Digital Solutions, A Digital Marketing Company, To Build A Website That Looks Great, Performs Flawlessly, And Drives Results.",
            // TODO: confirm destination — defaulted to the services
            // list since none of the 6 services is specifically
            // "digital marketing".
            link: { label: "Digital Marketing Company", href: "/services" },
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
              "Why Is Website Design And Online Marketing Important For My Business?",
            answer:
              "Acts As A Company's Online Storefront To Showcase Professionalism, Values, And Brand Identity. A Company's Website Serves As The Initial Point Of Contact With Prospective Clients. As A Result, It Is Essential In Forming Their Opinions And Affecting Their Choices. A Stanford University Study Found That 75% Of Users Base Their Opinion Of A Company's Credibility Solely On Its Website Design.",
            emphasis: "Stanford University",
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
          label: "Stanford's",
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
        headline: "Your Partner In Media Buying And Digital Growth",
        paragraphs: [
          { text: "Target Smarter. Spend Wiser. Grow Faster." },
          {
            text: "Technico Digital Solutions, A Digital Advertising Company, Understands Exactly What Your Business Needs — From Media Buying To Cutting-Edge Online Marketing. As A Full-Service Marketing Agency, We Handle Every Aspect Of Your Marketing Strategy. So Sit Back, Relax, And Watch Your Business Grow With Technico Digital Solutions.",
            link: {
              label: "Digital Advertising Company",
              href: "https://technicosolutions.com/services/media-buying-and-digital-advertising/",
            },
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
        headline: "Our Digital Marketing Services For Business Growth",
        paragraph:
          "A Digital Marketing Agency Doesn't Simply Post Online Without Research And Careful Planning. What Our Digital Marketing Company Does Is Offer Multiple Solutions, As Not All Fit Every Type Of Business. Here's What You Can Find At Technico Digital Solutions.",
        subheading: {
          title: "Digital Marketing Services",
          paragraph:
            "The Online World Is Saturated, And It May Seem Like There's No Hope Of Getting Your Business Noticed, But With The Right Strategy, It's Possible. Our Internet Marketing Agency Works To Create Multiple Strategies To Determine What's Best For Your Business.",
        },
        items: [
          {
            icon: 0,
            title: "Search Engine Marketing (SEM)",
            description:
              "Boost Your Brand On Search Engines Through Data-Driven Strategies. Our Campaigns Combine Paid Search And Search Engine Optimization Techniques To Help Your Business Appear Where Your Customers Are.",
          },
          {
            icon: 1,
            title: "Pay-Per-Click Advertising (PPC)",
            description:
              "Reach The Right Audience At The Right Time With Targeted PPC And Google Ads Campaigns. We Create And Manage Strategies That Maximize Clicks, Conversions, And ROI, So Every Dollar You Spend Brings Measurable Results.",
          },
          {
            icon: 2,
            title: "Social Media Marketing (SMM)",
            description:
              "Engage, Connect, And Grow Your Audience Through Social Media Campaigns. From Creative Content To Paid Promotions, We Help Your Brand Stand Out On Platforms Like Facebook, Instagram, LinkedIn, And More.",
          },
        ],
      },
      {
        type: "highlights",
        eyebrow: "Media Buying Services",
        headline:
          "Media Buying Services That Put Your Brand In Front Of The Right Audience",
        paragraph:
          "Your Brand Message Reaches The Right Audience Through The Most Effective Channels. We Analyze Market Trends, Negotiate The Best Ad Placements, And Optimize Campaigns To Deliver Maximum Exposure And ROI.",
        items: [
          {
            icon: 3,
            title: "Purchasing High-End Digital Media",
            description:
              "Make The Most Of Your Digital Advertising Efforts And Achieve Results By Using Our Digital Media Buying Services To Efficiently Target Your Audience Across Multiple Online Platforms.",
          },
          {
            icon: 4,
            title: "Unorthodox Advertising",
            description:
              "Unconventional Marketing Services Spark Conversation About Your Brand. We Explore Innovative Marketing Techniques That Capture Attention And Engage Your Audience.",
          },
          {
            icon: 5,
            title: "Media Planning And Management",
            description:
              "Create Specialized Media Strategies Based On Your Target Market, Budget, And Business Goals. Our Team Manages Placements And Optimizes Campaigns For Maximum Reach And Impact.",
          },
          {
            icon: 6,
            title: "Placements Of Digital Ads",
            description:
              "Make The Most Of Your Digital Advertising Efforts By Placing Your Ads In Strategic Locations. To Reach Your Target Audience Online, Our Team Will Determine The Best Placements And Channels.",
          },
        ],
      },
      {
        type: "featuresSplit",
        eyebrow: "Industries We Serve",
        headline:
          "Delivering High-Performance Marketing To Multiple Industries",
        paragraphs: [
          "Regardless Of The Sector, Our Team Uses Innovative Solutions And Data-Driven Insights To Increase Growth, Engagement, And Visibility.",
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
        headline:
          "Take Control Of Every Channel With Effective Digital Advertising",
        // TODO: placeholder — swap for the real photo once one's picked.
        image: {
          src: "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg",
          alt: "",
        },
        paragraph:
          "Don't Waste Money On Ineffective Advertisements. We Create High-Performing Advertising Funnels That Automatically Generate Leads, Nurture Prospects, And Close Deals On Google, Meta, LinkedIn, And Other Platforms. By Building Strong Client Relationships, Our Tried-And-True System Has Helped Clients Committed To Growth Achieve Consistent Revenue.",
        bullets: [
          "Create A Complete Sales Funnel, From Click To Customer, Rather Than Just Running Advertisements.",
          "Pre-Qualify Prospects To Increase The Effectiveness And Efficiency Of Your Lead Generation.",
          "Made To Make The Transition From Stranger To Buyer As Smooth As Possible.",
          "You'll Be Fully Aware Of What's Generating Income And What's Working.",
        ],
      },
      {
        type: "cta",
        title:
          "Don't Spend Money On Ads Without Knowing Which Campaigns Actually Work",
        description:
          "Partner With Technico Digital Solutions To Identify And Implement The Most Effective Campaigns For Your Website Or Business.",
        cta: { label: "Grow Your Business Strategically", href: "/contact" },
        spacing: "tight-bottom",
      },
      {
        type: "introPanel",
        eyebrow: "Technico",
        headline: "The #1 Digital Advertising Company For Your Business",
        paragraphs: [
          {
            text: "Technico Digital Solutions Is Home To An Experienced Team Of Media Buying And Digital Advertising Professionals. You'll Be Leaving Your Business In Good Hands — Every Dollar You Spend Comes Back Twice With Real Leads And Real Customers.",
          },
          {
            text: "We Also Offer Web Development, Web Design, Email Marketing, Social Media Marketing, And Social Media Management To Support The Rest Of Your Digital Presence.",
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
              "Yes, hiring a local digital advertising company understands the local market, audience, and competition. Working with a local team also makes communication easier and faster. They can provide personalized strategies to help you achieve your business goals and generate more leads and sales.",
          },
          {
            question: "Should Small Businesses Hire A Marketing Agency?",
            answer:
              "Yes, small businesses can benefit greatly from hiring a marketing agency. Agencies bring expertise, tools, and strategies that may be difficult to manage in-house. Even on a limited budget, a marketing agency can provide solutions to grow your business effectively.",
          },
          {
            question:
              "How Long Does It Take To See Results After Hiring A Digital Advertising Company?",
            answer:
              "Results are not instantaneous, and success takes time. Significant progress usually happens within three to six months. Paid ads (PPC) can bring quick visibility, but those results stop once you stop paying. SEO, on the other hand, builds long-term authority by helping your website rank organically.",
            emphasis: "PPC",
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
            text: "A Dedicated Social Media Management Team Keeps Your Brand Active, Consistent, And Relevant Across All Major Social Media Networks.",
          },
          {
            text: "A Social Media Management Expert Helps Your Business Connect With The Right Audience And Build Meaningful Relationships Online.",
          },
          {
            text: "A Strong Social Media Management Strategy Guarantees Every Post, Comment, And Campaign Supports Your Marketing Goals.",
          },
          {
            text: "Managing Multiple Social Media Platforms Can Be Time-Consuming; We Manage Social Media For You So You Can Focus On Running Your Business.",
          },
          {
            text: "Consistent Engagement Boosts Brand Awareness, Generates Leads, And Strengthens Your Online Reputation.",
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
            text: "Use Social Media Listening To Craft Strategies That Drive More Traffic To Your Website.",
          },
          {
            text: "Boost Traffic, Generate Leads, And Drive New Sales To Grow The Brand Online Naturally.",
          },
          {
            text: "Monitor Your Channels To Optimize Campaigns, Refine Messaging, And Engage Your Audience.",
          },
          {
            text: "Turn Insights Into Actionable Strategies That Maximize ROI And Strengthen Your Online Presence.",
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
          "Don't Settle For Less, And Don't Try To Do It All Yourself. You Need A Social Media Management Team That Can Help You Manage Multiple Social Media Channels. Here's What You Should Ask An Agency:",
        items: [
          {
            title: "Are You Effectively Measuring Social Media ROI?",
            description:
              "We Continuously Monitor Traffic, Engagement, And Conversions From All Of Your Channels Using Live Reporting. Our Strategies Assign A Specific Value To Each Conversion. This Gives Our Clients An Understanding Of Their Return On Investment.",
          },
          {
            title: "Do They Have Full Transparency?",
            description:
              "Clients Can Review Our Service Quality Through Our Excellent Feedback And High Ratings. We Maintain A Strong Reputation On Google. This Reflects Our Commitment To Transparency And Reliability. Our Services Keep Businesses One Step Ahead Of The Competition.",
          },
          {
            title: "Can You Handle An Average Agency?",
            description:
              "We Go Beyond The Typical Agency Approach To Deliver Exceptional Results For Our Clients. Our Strategies, Expertise, And Dedication Make Sure Businesses Achieve Measurable Growth.",
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
            text: "Every Message Matters. We Make Yours Stand Out In The Inbox. Your Business Deserves Consistent Engagement That Actually Leads To Sales. Yet Sending Out Random Emails Without A Clear Plan Wastes Effort And Resources. That's Where Our Best Email Marketing Services Come In. Technico Solutions Helps You Create Meaningful Connections With Your Audience Through Campaigns That Inform, Convert, And Retain.",
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
          "Every Campaign Is Monitored And Optimized For Open Rates, Click-Throughs, And Conversions. You Get Measurable Outcomes And Full Control Over Your Marketing Strategy.",
        ],
        listHeading: "We Use",
        items: [
          {
            text: "Advanced Marketing Automation Tools That Save Time & Increase Engagement",
          },
          { text: "Drag And Drop Editors For Easy Campaign Creation" },
          { text: "Pre-Designed Email Templates That Adapt To Your Brand" },
          {
            text: "Detailed Reporting Resources For Accurate Tracking & Analysis",
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
          "Let Our Digital Marketers Plan A Strong Email Marketing Strategy By Understanding Your Audience And Defining Your Business Goals. Our Process Guarantees Every Email Serves A Purpose And Every Send Moves You Closer To Your Goals.",
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
        headline: "Your Partner For Strategic Email Marketing",
        paragraphs: [
          {
            text: "Email Remains One Of The Most Effective Digital Marketing Tools For Reaching And Converting Leads. Our Email Marketing Capabilities And Automation Workflows Give Your Business A Smarter, More Consistent Way To Connect With Your Target Audience And Existing Customers. From Planning To Performance Tracking, Digital Marketing Experts At Technico Digital Solutions Give You All The Features And Solutions Needed For Measurable Growth. Simplify Your Marketing. Build Stronger Customer Relationships. Let Our Digital Marketing Company Create Email Campaigns That Work For Your Business.",
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
              "Through Personalized Messages, Exclusive Offers, And Product Recommendations, Businesses Can Keep Shoppers Engaged And Encourage Repeat Purchases. With The Right Email Marketing Services, E-Commerce Brands Can Nurture Relationships, Boost Conversion Rates, And Turn Occasional Buyers Into Loyal Customers.",
          },
          {
            question: "How Do Email Marketing Services Work?",
            answer:
              "Email Marketing Works By Helping Your Business Connect Directly With Your Market Through Targeted And Personalized Emails. Using A Great Email Marketing Platform, Our Marketers Create Campaigns, Segment Contact Lists, And Automate Messages To Reach The Right People At The Right Time. These Emails, Such As Newsletters, Promotions, Or Updates, Aim To Build Trust, Strengthen Relationships, And Inspire Specific Actions Like Making Purchases Or Engaging With The Brand Consistently.",
          },
          {
            question: "What Are The Limits Of Free Email Marketing Services?",
            answer:
              "Free Marketing Services Come With Limits, Like Restricted Contact Lists, Capped Monthly Sends, Basic Templates, And Minimal Automation Options. These Constraints Make It Hard To Scale Or Track Meaningful Results. So, Hiring Professional Email Marketing Services Guarantees Advanced Targeting, Analytics, And Personalization. It's The Smarter Path For Businesses Ready To Grow Customer Reach Effectively.",
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
