import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import Button from "@/components/ui/Button";
import GeometricIcon from "@/components/ui/icons";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";

interface ServicesGrowBusinessProps {
  headline: [string, string];
  intro: string;
  items: { text: string; tag: string }[];
  closing: string;
}

export default function ServicesGrowBusiness({
  headline,
  intro,
  items,
  closing,
}: ServicesGrowBusinessProps) {
  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        headline={
          <>
            {headline[0]}
            <br />
            {headline[1]}
          </>
        }
        paragraph={intro}
      />
      <div className="relative mt-12 grid grid-cols-1 border-t border-l border-white/18 sm:grid-cols-2">
        <GridCorners />
        {items.map((item, index) => (
          <article
            data-stagger-hover
            key={index}
            className="group relative flex flex-col border-r border-b border-white/18 p-5 transition-colors duration-500  sm:p-7 lg:p-9"
          >
            <HorizontalStaggerRows />
            <div className="flex items-center justify-between">
              <GeometricIcon
                index={index}
                className="h-9 w-9 text-purple-accent"
              />
              <span
                aria-hidden="true"
                className="font-mono text-xs text-content-muted"
              >
                {String(index + 1).padStart(2, "0")} {"//"}
              </span>
            </div>
            <p className="body-copy my-7 max-w-[58ch] text-content">
              {item.text}
            </p>
            <div className="mt-auto border-t border-dashed border-white/20 pt-5">
              <Button to="/contact" variant="purple-fill" size="sm">
                {item.tag}
              </Button>
            </div>
          </article>
        ))}
      </div>
      <p className="body-copy mt-9 max-w-[76ch] text-content">{closing}</p>
    </section>
  );
}
