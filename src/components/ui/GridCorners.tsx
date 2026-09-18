interface GridCornersProps {
  accent?: "purple" | "pink";
  className?: string;
}

/** Registration marks for connected editorial grids. Parent must be relative. */
export default function GridCorners({
  accent = "purple",
  className,
}: GridCornersProps) {
  const color =
    className ?? (accent === "pink" ? "text-accent-light" : "text-accent");
  const base = `pointer-events-none absolute z-10 grid h-4 w-4 place-items-center bg-black-bg font-mono text-sm leading-none ${color}`;
  return (
    <>
      <span data-grid-corner aria-hidden="true" className={`${base} -top-2 -left-2`}>
        +
      </span>
      <span data-grid-corner aria-hidden="true" className={`${base} -top-2 -right-2`}>
        +
      </span>
      <span data-grid-corner aria-hidden="true" className={`${base} -bottom-2 -left-2`}>
        +
      </span>
      <span data-grid-corner aria-hidden="true" className={`${base} -right-2 -bottom-2`}>
        +
      </span>
    </>
  );
}
