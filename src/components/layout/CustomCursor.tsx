import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { transitionState } from "../../lib/transitionState";
import { loaderState } from "../../lib/loaderState";

/*
 * ================================================================
 * CUSTOM CURSOR
 * ================================================================
 * Renders nothing visible on its own — a fixed-position ring
 * (.cursor-box) and dot (.cursor-dot), both driven purely by
 * transform (x/y) and, for the ring, width/height. All of the
 * per-variant look (colors, the "Scroll" eye icon, label text
 * opacity) already lives in index.css under interactive markup;
 * this component only ever toggles the class names and content
 * those rules key off of.
 *
 * THREE STATES, keyed off data-cursor on the hovered element:
 *
 *   (none)      Default 48px ring + 20px dot, both centered on the
 *               pointer and lightly lagging behind it.
 *
 *   "highlight" The ring stops following the pointer and instead
 *               snaps to the hovered element's own bounding box
 *               (nav links, buttons) — see the CURSOR note on
 *               Header.tsx's NavItem for why the box targets the
 *               stable link element rather than its magnetic inner
 *               span. The dot keeps tracking the real pointer
 *               position inside it.
 *
 *   "label"     Ring keeps following the pointer (unlike
 *               "highlight"), turns into a solid pill, and shows
 *               data-cursor-label text ("Drag", "Scroll"). The dot
 *               hides — a difference-blend dot over a solid pill
 *               reads as a rendering glitch, not a cursor. When
 *               data-cursor-variant="scroll" is also present
 *               (Services/Process's pinned horizontal tracks), the
 *               blinking pixel-art eye from index.css joins the
 *               label text.
 *
 *   "text"      For real text inputs/textareas (BookingForm's fields).
 *               Ring collapses into a thin 2px caret that follows the
 *               pointer like the default state does, just narrower —
 *               reads as "you can type here" instead of the generic
 *               48px ring sitting over a text field. Dot hides, same
 *               reasoning as "label".
 *
 * PRESS FEEDBACK: independent of the variant above, the whole cursor
 * (ring + dot) scales down slightly on mouse button down and springs
 * back on release, everywhere — a small tactile "yes, that registered"
 * cue on every click, not just the ones with a data-cursor target.
 *
 * SUPPRESSION: loaderState.isActive and transitionState.isAnimating
 * are plain mutable objects (see their own files) with no change
 * event of their own, flipped directly by Loader.tsx / TransitionLink
 * mid-render. Polling them on gsap's own ticker — already running,
 * already the thing driving every quickTo on this component — avoids
 * standing up a second rAF loop just to watch two booleans.
 * ================================================================
 */

const BOX_SIZE = 48;
const DOT_SIZE = 20;
const TEXT_CARET_WIDTH = 2;
const TEXT_CARET_HEIGHT = 26;
const PRESS_SCALE = 0.82;

/*
 * Fine pointer (mouse/trackpad, not touch) and no reduced-motion
 * preference — read once at module load, same reasoning as
 * `prefersReducedMotion` itself in lib/gsap.ts: neither signal
 * changes mid-session, so there's nothing a live media-query
 * listener would ever need to react to.
 */
const supportsCustomCursor =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !prefersReducedMotion;

type CursorVariant = "highlight" | "label" | "text" | null;

export default function CustomCursor() {
  const boxRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!supportsCustomCursor) return;

    const box = boxRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!box || !dot || !label) return;

    document.documentElement.classList.add("custom-cursor-active");

    const moveBoxX = gsap.quickTo(box, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    const moveBoxY = gsap.quickTo(box, "y", {
      duration: 0.5,
      ease: "power3.out",
    });
    const sizeBoxW = gsap.quickTo(box, "width", {
      duration: 0.35,
      ease: "power3.out",
    });
    const sizeBoxH = gsap.quickTo(box, "height", {
      duration: 0.35,
      ease: "power3.out",
    });
    const moveDotX = gsap.quickTo(dot, "x", {
      duration: 0.15,
      ease: "power3.out",
    });
    const moveDotY = gsap.quickTo(dot, "y", {
      duration: 0.15,
      ease: "power3.out",
    });
    // Press feedback — independent of the hover-driven x/y/width/height
    // tweens above, so a click mid-hover doesn't fight the highlight
    // snap; scale rides on top of whatever position/size those set.
    const scaleBox = gsap.quickTo(box, "scale", {
      duration: 0.25,
      ease: "power3.out",
    });
    const scaleDot = gsap.quickTo(dot, "scale", {
      duration: 0.25,
      ease: "power3.out",
    });

    gsap.set(box, {
      x: -BOX_SIZE / 2,
      y: -BOX_SIZE / 2,
      width: BOX_SIZE,
      height: BOX_SIZE,
      scale: 1,
      opacity: 0,
    });
    gsap.set(dot, {
      x: -DOT_SIZE / 2,
      y: -DOT_SIZE / 2,
      scale: 1,
      opacity: 0,
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let mouseInside = false;
    let activeVariant: CursorVariant = null;
    let activeTarget: Element | null = null;
    let boxVisible = false;
    let dotVisible = false;
    let pressed = false;

    const applyHighlight = (el: Element) => {
      const rect = el.getBoundingClientRect();
      moveBoxX(rect.left);
      moveBoxY(rect.top);
      sizeBoxW(rect.width);
      sizeBoxH(rect.height);
      box.classList.add("cursor-box--highlight");
    };

    const applyLabel = (el: Element) => {
      label.textContent = el.getAttribute("data-cursor-label") ?? "";
      box.classList.add("cursor-box--label");
      if (el.getAttribute("data-cursor-variant") === "scroll") {
        box.classList.add("cursor-box--scroll");
      }
      dot.classList.add("cursor-dot--label");
    };

    // Thin caret for real text inputs/textareas — same follow-the-
    // pointer behavior as the default ring, just collapsed down to a
    // 2px-wide bar so it reads as "type here" instead of a 48px hoop
    // sitting on top of a one-line field.
    const applyText = () => {
      box.classList.add("cursor-box--text");
      dot.classList.add("cursor-dot--label");
      sizeBoxW(TEXT_CARET_WIDTH);
      sizeBoxH(TEXT_CARET_HEIGHT);
      moveBoxX(mouseX - TEXT_CARET_WIDTH / 2);
      moveBoxY(mouseY - TEXT_CARET_HEIGHT / 2);
    };

    const reset = () => {
      activeVariant = null;
      activeTarget = null;
      box.classList.remove(
        "cursor-box--highlight",
        "cursor-box--label",
        "cursor-box--scroll",
        "cursor-box--text",
      );
      dot.classList.remove("cursor-dot--label");
      label.textContent = "";
      sizeBoxW(BOX_SIZE);
      sizeBoxH(BOX_SIZE);
      moveBoxX(mouseX - BOX_SIZE / 2);
      moveBoxY(mouseY - BOX_SIZE / 2);
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      const target = (e.target as Element | null)?.closest("[data-cursor]");
      if (!target || target === activeTarget) return;

      if (activeTarget) reset();
      activeTarget = target;

      const variant = target.getAttribute("data-cursor");
      if (variant === "highlight") {
        activeVariant = "highlight";
        applyHighlight(target);
      } else if (variant === "label") {
        activeVariant = "label";
        applyLabel(target);
      } else if (variant === "text") {
        activeVariant = "text";
        applyText();
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !activeTarget) return;

      const related = e.relatedTarget as Element | null;
      // Moving to a descendant of the same [data-cursor] element isn't
      // a real exit — closing/reopening here would just flicker the
      // ring's class list every time the pointer crosses a child.
      if (related && activeTarget.contains(related)) return;

      reset();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseInside = true;

      moveDotX(mouseX - DOT_SIZE / 2);
      moveDotY(mouseY - DOT_SIZE / 2);

      // "highlight" owns the ring's position/size itself (snapped to
      // the hovered element's rect) — "text" follows the pointer like
      // the default state but offset by its own (much narrower) size —
      // everything else follows the pointer using the default ring size.
      if (activeVariant === "text") {
        moveBoxX(mouseX - TEXT_CARET_WIDTH / 2);
        moveBoxY(mouseY - TEXT_CARET_HEIGHT / 2);
      } else if (activeVariant !== "highlight") {
        moveBoxX(mouseX - BOX_SIZE / 2);
        moveBoxY(mouseY - BOX_SIZE / 2);
      }
    };

    const handlePointerLeaveWindow = () => {
      mouseInside = false;
    };

    // Press feedback: a light scale-down on button down, springing
    // back on release — deliberately global (not gated on
    // `activeTarget`) so every click on the page gets the same
    // tactile acknowledgement, not just clicks on data-cursor targets.
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pressed = true;
      scaleBox(PRESS_SCALE);
      scaleDot(PRESS_SCALE);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !pressed) return;
      pressed = false;
      scaleBox(1);
      scaleDot(1);
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeaveWindow,
    );
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    // Opacity is computed here rather than left to the CSS
    // `.cursor-dot--label { opacity: 0 }` rule, because this loop
    // also needs to drive opacity for the loader/transition/
    // mouse-left-window cases — and an inline style from gsap.to
    // always outranks that class regardless of write order. Folding
    // "should the dot show at all" into one number sidesteps the
    // fight instead of losing it silently.
    const tick = () => {
      const generallyVisible =
        mouseInside && !loaderState.isActive && !transitionState.isAnimating;
      const nextBoxVisible = generallyVisible;
      const nextDotVisible =
        generallyVisible &&
        activeVariant !== "label" &&
        activeVariant !== "text";

      if (nextBoxVisible !== boxVisible) {
        boxVisible = nextBoxVisible;
        gsap.to(box, {
          opacity: boxVisible ? 1 : 0,
          duration: 0.2,
          overwrite: "auto",
        });
      }

      if (nextDotVisible !== dotVisible) {
        dotVisible = nextDotVisible;
        gsap.to(dot, {
          opacity: dotVisible ? 1 : 0,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    };
    gsap.ticker.add(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");

      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeaveWindow,
      );
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);

      gsap.ticker.remove(tick);
      gsap.killTweensOf([box, dot]);
    };
  }, []);

  if (!supportsCustomCursor) return null;

  return (
    <>
      <div ref={boxRef} className="cursor-box" aria-hidden="true">
        <span ref={labelRef} className="cursor-box__label" />
        <span className="cursor-box__eye" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
