"use client";

import { useEffect, type RefObject } from "react";

/**
 * Closes an open popover when the user clicks/taps outside its
 * container or presses Escape — the one dismiss behavior
 * DatePicker, TimeSlotPicker, and TimezonePicker all need, pulled
 * out here so it can't drift between them. `containerRef` should
 * wrap both the trigger button and the panel, so clicking the
 * trigger itself doesn't get treated as an "outside" click.
 */
export function useDismiss(
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, isOpen, onDismiss]);
}
