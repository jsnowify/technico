interface ProcessStep {
  title: string;
  description: string;
}

interface ServicesProcessProps {
  eyebrow: string;
  headline: string;
  paragraph: string;
  steps: ProcessStep[];
  /**
   * "centered" (default) is the original layout: description
   * centered in the gap between the title and an invisible mirror
   * of it, text-center, no indent — used by Web Development.
   * "edge" pushes the description flush to the outer edge of the
   * card (right for primary/title-left cards, left for
   * secondary/title-right cards) and justifies + indents it like a
   * paragraph — used by the Graphic Design process only. Per
   * `ServiceHighlights`/CTA convention: pass this explicitly per
   * section rather than changing the shared default, since the
   * default is depended on elsewhere.
   */
  descriptionLayout?: "centered" | "edge";
}

const PRIMARY_STEP_PATH =
  "M1007 0C1029.09 0 1047 17.9086 1047 40V132.473C1047 154.564 1029.09 172.473 1007 172.473H202.876C186.085 172.473 172.473 186.085 172.473 202.876C172.473 219.668 158.86 233.28 142.069 233.28H40C17.9086 233.28 0 215.372 0 193.28V40C0 17.9086 17.9086 0 40 0H1007Z";

const SECONDARY_STEP_PATH =
  "M39.9991 233.281C17.9077 233.281 -0.000974997 215.373 -0.000973066 193.281L-0.000964981 100.809C-0.00096305 78.7171 17.9076 60.8085 39.999 60.8085L844.121 60.8086C860.913 60.8086 874.525 47.1961 874.525 30.4043C874.525 13.6125 888.138 -1.3888e-05 904.93 -1.242e-05L1007 -3.49691e-06C1029.09 -1.56562e-06 1047 17.9086 1047 40L1047 193.281C1047 215.373 1029.09 233.281 1007 233.281L39.9991 233.281Z";

function StepCard({
  step,
  variant,
  isNewGroup = false,
  descriptionLayout = "centered",
}: {
  step: ProcessStep;
  variant: "primary" | "secondary";
  /** True for a "primary" card that starts a new Research/Build-style
   * pair (every primary card except the very first). Adds a fixed
   * 20px gap above it so it doesn't sit flush against the secondary
   * card of the previous pair. */
  isNewGroup?: boolean;
  descriptionLayout?: "centered" | "edge";
}) {
  const isPrimary = variant === "primary";
  const isEdge = descriptionLayout === "edge";

  const descriptionClassName = [
    "max-w-[500px]",
    isEdge ? "text-justify indent-6" : "text-center",
    "text-sm",
    "font-light",
    "leading-relaxed",
    "tracking-wide",
    "text-white/70",
    "sm:text-base",
  ].join(" ");

  const titleClassName = [
    "shrink-0",
    "whitespace-nowrap",
    "text-2xl",
    "font-bold",
    "leading-none",
    "text-white",
    "sm:text-3xl",
  ].join(" ");

  const invisibleTitleMirror = (
    <h3
      aria-hidden="true"
      className="
        invisible
        shrink-0
        select-none
        whitespace-nowrap
        text-2xl
        font-bold
        leading-none
        sm:text-3xl
      "
    >
      {step.title}
    </h3>
  );

  return (
    <div
      className={[
        "relative aspect-[1047/234] w-[88%] shrink-0",

        "sm:w-[84%]",
        "lg:w-[76%]",

        isNewGroup ? "mt-[20px]" : "",

        // PRIMARY
        // Shifted left by half of the secondary's rightward shift, so
        // the pair's combined bounding box is centered as a unit
        // instead of the whole pair drifting right. The *relative*
        // gap between primary and secondary stays identical to before
        // (8% / 9% / 10%), which is what the SVG notch/tab needs to
        // line up — only the shared center point moved.
        isPrimary
          ? [
              "-translate-x-[4%]",
              "sm:-translate-x-[4.5%]",
              "lg:-translate-x-[5%]",
            ].join(" ")
          : [
              "translate-x-[4%]",
              "sm:translate-x-[4.5%]",
              "lg:translate-x-[5%]",

              // Exact overlap needed for the SVG's 60.8px notch/tab.
              "-mt-[5.1%]",

              "sm:-mt-[4.9%]",

              "lg:-mt-[4.4%]",
            ].join(" "),
      ].join(" ")}
    >
      {/* =========================================================
          SVG SHAPE
          ========================================================= */}

      <svg
        viewBox="0 0 1047 234"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d={isPrimary ? PRIMARY_STEP_PATH : SECONDARY_STEP_PATH}
          fill="#1A1B1E"
        />
      </svg>

      {/* =========================================================
          CONTENT
          ========================================================= */}

      <div
        className={[
          "absolute inset-x-0 flex items-center",
          "px-6",
          "sm:px-8",
          "md:px-10",
          "lg:px-12",

          isPrimary ? "top-0 h-[73.7%]" : "bottom-0 h-[73.9%]",
        ].join(" ")}
      >
        {isPrimary ? (
          <>
            <h3 className={titleClassName}>{step.title}</h3>

            <div
              className={[
                "flex min-w-0 flex-1 px-6 sm:px-8",
                isEdge ? "justify-end" : "justify-center",
              ].join(" ")}
            >
              <p className={descriptionClassName}>{step.description}</p>
            </div>

            {/* Invisible mirror of the title, same width, so the flex-1
               paragraph column is bounded symmetrically on both sides
               and its centered text lines up with the true middle of
               the card instead of drifting toward the empty side.
               Only needed for the centered layout — edge layout has
               nothing on the far side to balance against. */}
            {!isEdge && invisibleTitleMirror}
          </>
        ) : (
          <>
            {/* Same mirror, mirrored on the left — centered layout
               only, see note above. */}
            {!isEdge && invisibleTitleMirror}

            <div
              className={[
                "flex min-w-0 flex-1 px-6 sm:px-8",
                isEdge ? "justify-start" : "justify-center",
              ].join(" ")}
            >
              <p className={descriptionClassName}>{step.description}</p>
            </div>

            <h3 className={titleClassName}>{step.title}</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default function ServicesProcess({
  eyebrow,
  headline,
  paragraph,
  steps,
  descriptionLayout = "centered",
}: ServicesProcessProps) {
  return (
    <section
      className="
        bg-black-bg
        px-6
        py-20
        sm:px-8
        sm:py-24
        md:px-10
        md:py-28
      "
    >
      {/* =========================================================
          HEADER
          ========================================================= */}

      <div
        className="
          flex
          flex-col
          gap-8
          lg:flex-row
          lg:items-start
          lg:justify-between
          lg:gap-12
        "
      >
        {/* LEFT */}

        <div className="max-w-full lg:max-w-[55%]">
          <span
            className="
              float-left
              mt-2
              mr-4
              flex
              items-center
              gap-2
            "
          >
            <span
              aria-hidden="true"
              className="
                h-2
                w-2
                shrink-0
                bg-white/70
              "
            />

            <span
              className="
                whitespace-nowrap
                text-sm
                font-light
                uppercase
                leading-none
                tracking-widest
                text-white/70
              "
            >
              {eyebrow}
            </span>
          </span>

          <h2
            className="
              text-[32px]
              font-medium
              leading-[1.15]
              tracking-tight
              text-white
              sm:text-[40px]
              md:text-[44px]
            "
          >
            {headline}
          </h2>

          <div className="clear-both" />
        </div>

        {/* RIGHT */}

        <p
          className="
            max-w-full
            text-sm
            font-light
            leading-relaxed
            text-white/70
            sm:text-base
            lg:max-w-[38%]
          "
        >
          {paragraph}
        </p>
      </div>

      {/* =========================================================
          PROCESS STACK
          ========================================================= */}

      <div
        className="
          mt-14
          flex
          flex-col
          items-center
          sm:mt-16
          md:mt-20
        "
      >
        {steps.map((step, index) => (
          <StepCard
            key={`${step.title}-${index}`}
            step={step}
            variant={index % 2 === 0 ? "primary" : "secondary"}
            isNewGroup={index % 2 === 0 && index > 0}
            descriptionLayout={descriptionLayout}
          />
        ))}
      </div>
    </section>
  );
}
