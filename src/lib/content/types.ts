export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Plain paragraphs for now; swap for markdown/MDX/CMS body later. */
  content: string[];
  coverImage: string;
  publishedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  author: string;
  tags?: string[];
};

export type Service = {
  slug: string;
  title: string;
  /** Short line under the title, e.g. "Search Engine Optimization (SEO)". */
  subtitle?: string;
  /** Pull-quote line shown in the expanded accordion panel. */
  quote?: string;
  shortDescription: string;
  description: string[];
  /** Deliverable/service chips shown in the expanded accordion panel. */
  tags?: string[];
};
