import EditorialPageReveal from "@/components/ui/EditorialPageReveal";

const BLOG_IMAGE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1789361404/temporary-placeholder/blog_k83lrr.jpg";

export default function BlogIndexHeroReveal() {
  return (
    <EditorialPageReveal
      id="blog-index-hero-reveal"
      page="BLOG"
      code="04 / JOURNAL"
      image={BLOG_IMAGE}
      imageLabel="// Insights"
      heading="Insights on web development, SEO, and technology strategy."
    />
  );
}
