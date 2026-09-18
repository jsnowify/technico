import type { ReactNode } from "react";

interface EditorialHeaderProps {
  label: string;
  title: ReactNode;
  copy?: ReactNode;
  aside?: ReactNode;
  headingLevel?: "h1" | "h2";
  className?: string;
}

/** Shared header rhythm used by Home, About, Blog, and Contact. */
export default function EditorialHeader({
  label,
  title,
  copy,
  aside,
  headingLevel = "h2",
  className = "",
}: EditorialHeaderProps) {
  const Heading = headingLevel;
  return (
    <header className={`border-t border-white/20 pt-5 ${className}`}>
      <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
        <p className="flex items-start gap-3 font-mono text-xs tracking-[0.04em] text-content-muted uppercase">
          <span aria-hidden="true" className="text-accent">
            {"//"}
          </span>
          <span>{label}</span>
        </p>
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,0.85fr)] lg:gap-14">
          <Heading
            className={`${headingLevel === "h1" ? "text-[clamp(2.25rem,11vw,3.875rem)]" : "h2-section"} max-w-[22ch] leading-[1.06] font-medium tracking-heading text-white-text text-balance break-words`}
          >
            {title}
          </Heading>
          {(copy || aside) && (
            <div className="min-w-0 lg:pt-1">
              {copy && (
                <div className="body-copy max-w-[54ch] leading-[1.65] text-content">
                  {copy}
                </div>
              )}
              {aside && <div className={copy ? "mt-7" : ""}>{aside}</div>}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
