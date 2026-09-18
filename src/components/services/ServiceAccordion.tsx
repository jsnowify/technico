"use client";

import { useId, useState, type ReactNode } from "react";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import styles from "./ServiceAccordion.module.css";

export default function ServiceAccordion({
  items,
  initiallyOpen = 0,
}: {
  items: { title: string; body: ReactNode }[];
  initiallyOpen?: number | null;
}) {
  const id = useId();
  const [active, setActive] = useState<number | null>(initiallyOpen);
  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        const open = active === index;
        const panelId = `${id}-panel-${index}`;
        const buttonId = `${id}-button-${index}`;
        return (
          <div key={index} className={styles.item} data-open={open}>
            <h3>
              <button
                data-stagger-hover
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                className={styles.trigger}
                onClick={() => setActive(open ? null : index)}
              >
                <HorizontalStaggerRows />
                <span>{item.title}</span>
                <span className={styles.mark} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              inert={!open}
              className={styles.panel}
            >
              <div className={styles.clip}>
                <p className={styles.copy}>{item.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
