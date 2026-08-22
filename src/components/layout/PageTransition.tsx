import { useRef } from "react";
import { useEffect } from "react";
import { gsap } from "gsap";
import { transitionCellRefs } from "../../lib/transitionCellRefs";

const COLS = 8;
const ROWS = 5;
const CELL_COUNT = COLS * ROWS;

function CubeLayer({
  color,
  collect,
}: {
  color: string;
  collect: (i: number, el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: CELL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => collect(i, el)}
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

export default function PageTransition() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    [
      transitionCellRefs.purple1,
      transitionCellRefs.black,
      transitionCellRefs.purple2,
    ].forEach((cells) => {
      gsap.set(cells, { scaleY: 0, transformOrigin: "bottom" });
    });
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden"
      aria-hidden="true"
    >
      <CubeLayer
        color="var(--color-accent)"
        collect={(i, el) => {
          if (el) transitionCellRefs.purple1[i] = el;
        }}
      />
      <CubeLayer
        color="#000000"
        collect={(i, el) => {
          if (el) transitionCellRefs.black[i] = el;
        }}
      />
      <CubeLayer
        color="var(--color-accent)"
        collect={(i, el) => {
          if (el) transitionCellRefs.purple2[i] = el;
        }}
      />
    </div>
  );
}
