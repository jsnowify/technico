import type { CSSProperties } from "react";
import styles from "./HorizontalStaggerRows.module.css";

/** Seven high-contrast bands matching the Home Solutions hover language. */
export default function HorizontalStaggerRows() {
  return (
    <span aria-hidden="true" className={styles.wash}>
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          className={styles.band}
          style={{ "--band": index } as CSSProperties}
        />
      ))}
    </span>
  );
}
