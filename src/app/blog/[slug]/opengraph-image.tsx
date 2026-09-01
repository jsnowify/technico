import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/content/blog";
import { SITE_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#010104",
        color: "#fbfbfe",
        padding: "64px",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#6b26d9" }}>
        {SITE_NAME}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 56,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {post?.title ?? "Blog"}
      </div>
    </div>,
    { ...size },
  );
}
