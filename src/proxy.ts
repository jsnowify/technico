import { NextResponse, type NextRequest } from "next/server";

/**
 * This project's public canonical domain is technicosolutions.com. Vercel
 * deployment aliases, including technico-test.vercel.app, are test URLs even
 * when Vercel calls the deployment "production".
 *
 * A request-time X-Robots-Tag is required: build-time environment flags alone
 * cannot distinguish a test hostname from a live custom domain when both
 * point at the same production deployment.
 *
 * Do NOT use `robots.txt: Disallow: /` to implement noindex. Google needs to
 * fetch the response to observe this header.
 */
export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const isTestHost =
    hostname === "technico-test.vercel.app" || hostname.endsWith(".vercel.app");

  const response = NextResponse.next();

  if (isTestHost) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Run on pages and metadata endpoints, not Next.js static image/code assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
