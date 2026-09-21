import EditorialHeader from "@/components/ui/EditorialHeader";
import GridCorners from "@/components/ui/GridCorners";
import PixelRevealImage from "@/components/home/PixelRevealImage";
import { formatPostDate } from "@/lib/utils/date";

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
  const dateLabel = formatPostDate(publishedAt, "long");

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
            priority
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-black-bg/86 p-4 font-mono text-[10px] tracking-[0.05em] text-content-muted uppercase sm:text-xs">
            <span>
              Published{" "}
              <time dateTime={publishedAt} className="text-content">
                {dateLabel}
              </time>
            </span>
            <span>{readTime}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
