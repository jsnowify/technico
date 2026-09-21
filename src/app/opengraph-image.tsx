import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

// A real default social preview shared by the static pages. Service and
// article routes already provide their own dynamically generated OG images.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0c",
        color: "#fbfbfe",
        padding: 64,
      }}
    >
      <div style={{ display: "flex", color: "#a78bfa", fontSize: 28 }}>
        {SITE_NAME}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 62,
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        Digital marketing agency that prioritize your profit, not just traffic.
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#a78bfa" }}>
        {new URL(SITE_URL).hostname}
      </div>
    </div>,
    { ...size },
  );
}
