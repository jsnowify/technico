import type { ReactNode } from "react";
import styles from "./Header.module.css";

/** Height is measured by the grid, so opening and closing use the same distance. */
export default function HeaderDrop({
  open,
  children,
  className = "",
  id,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      data-open={open}
      aria-hidden={!open}
      inert={!open}
      className={`${styles.drop} ${className}`}
    >
      <div className={styles.dropClip}>
        <div className={styles.dropBody}>{children}</div>
      </div>
    </div>
  );
}
