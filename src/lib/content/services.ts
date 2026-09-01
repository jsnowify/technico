import type { Service } from "@/lib/content/types";

/**
 * Hardcoded for now. Swap the array below for a CMS/markdown fetch later —
 * getAllServices() and getServiceBySlug() are already async so calling code
 * (sitemap.ts, app/services/**) won't need to change.
 *
 * All six entries below are real, client-approved copy.
 */
const services: Service[] = [
  {
    slug: "seo",
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
  },
  {
    slug: "web-development",
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
  },
  {
    slug: "content-services",
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
  },
  {
    slug: "advertising",
    title: "Advertising",
    subtitle: "Media Buying & Digital Advertising",
    quote: "Maximize ROI with data-driven advertising campaigns",
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
