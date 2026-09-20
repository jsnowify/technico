import EditorialPageHero from "@/components/ui/EditorialPageHero";

export default function AboutHero() {
  return (
    <EditorialPageHero
      id="about-hero"
      page="ABOUT"
      code="05 / STUDIO"
      eyebrow="About Technico"
      compact
      lines={[
        "Your Trusted",
        "Digital Marketers",
        "For Business",
        "Transformation",
      ]}
    />
  );
}
