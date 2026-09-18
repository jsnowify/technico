import type { ReactNode } from "react";
import styles from "./ServiceSectionFrame.module.css";

interface ServiceSectionFrameProps {
  children: ReactNode;
  index: number;
  type: string;
  accent: "pink" | "purple";
}

export default function ServiceSectionFrame({
  children,
  index,
  type,
  accent,
}: ServiceSectionFrameProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className={styles.root} data-type={type} data-accent={accent}>
      <div className={styles.inner}>
        <div className={styles.chapter} aria-hidden="true">
          <span>{number}</span>
          <span className={styles.chapterLine} />
          <span>+</span>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
