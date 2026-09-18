import EditorialHeader from "@/components/ui/EditorialHeader";
import GridCorners from "@/components/ui/GridCorners";
import PixelRevealImage from "@/components/home/PixelRevealImage";

interface BlogHeroProps {
  title: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: string;
}

export default function BlogHero({
  title,
  coverImage,
  publishedAt,
  readTime,
  author,
}: BlogHeroProps) {
  const dateLabel = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="bg-black-bg">
      <div className="container-x mx-auto w-full max-w-[1920px] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36">
        <EditorialHeader
          label="Journal"
          headingLevel="h1"
          title={title}
          copy={
            <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs tracking-[0.035em] text-content-muted uppercase">
              <span>
                {dateLabel} / {readTime}
              </span>
              <span>{author}</span>
            </div>
          }
        />
        <figure className="relative mt-10 aspect-[4/3] overflow-hidden border border-white/20 sm:mt-14 sm:aspect-[16/8] lg:aspect-[21/8]">
          <GridCorners />
          <PixelRevealImage
            src={coverImage}
            alt={title}
            sizes="(min-width: 1920px) 1740px, 100vw"
          />
        </figure>
      </div>
    </section>
  );
}
