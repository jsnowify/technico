import { useEffect } from "react";

const SITE_NAME = "Technico Digital Solutions Inc.";

/**
 * Sets `document.title` for the lifetime of the calling page.
 *
 * Every route previously inherited the single static <title> from
 * index.html, so screen readers announced the same title on every
 * in-app navigation (title is one of the few things reliably
 * announced on route change in an SPA with no full reload) and every
 * tab/bookmark/search result looked identical regardless of page.
 *
 * Restores the previous title on unmount so a page that conditionally
 * unmounts without a full navigation (unlikely here, but cheap to
 * guard) doesn't leave a stale title behind.
 */
export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${pageTitle} — ${SITE_NAME}`;

    return () => {
      document.title = previous;
    };
  }, [pageTitle]);
}
