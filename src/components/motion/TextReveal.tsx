import type { ElementType, ReactNode } from "react";

type RevealTextProps = {
  children?: ReactNode;
  lines?: ReactNode[];
  as?: ElementType;
  className?: string;
};

export default function RevealText({
  children,
  lines,
  as: Tag = "h1",
  className,
}: RevealTextProps) {
  const items = lines ?? [children];

  return (
    <Tag className={className} data-reveal-title>
      {items.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span className="inline-block" data-reveal-line>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
