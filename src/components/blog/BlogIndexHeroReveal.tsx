import EditorialPageReveal from "@/components/ui/EditorialPageReveal";

const BLOG_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789971707/blog-imgs/technico-blog_d6caun.png";

export default function BlogIndexHeroReveal() {
  return (
    <EditorialPageReveal
      id="blog-index-hero-reveal"
      page="BLOG"
      code="04 / JOURNAL"
      image={BLOG_IMAGE}
      imageAlt="Technico Digital Solutions insights on web development, SEO, and technology strategy"
      imageLabel="// Insights"
      heading="Insights on web development, SEO, and technology strategy."
    />
  );
}
