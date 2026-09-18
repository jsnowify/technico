export const SITE_READY_EVENT = "technico:site-ready";

/**
 * The preloader owns the first-page reveal. Components that have an entrance
 * animation can check this flag and then subscribe to the event when the
 * preloader has not finished yet. The data attribute also makes subsequent
 * client-side visits work: the persistent root layout does not replay its
 * preloader, so newly mounted page components can start immediately.
 */
export function isSiteReady(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.siteReady === "true"
  );
}

export function announceSiteReady(): void {
  if (typeof document === "undefined" || isSiteReady()) return;

  document.documentElement.dataset.siteReady = "true";
  window.dispatchEvent(new Event(SITE_READY_EVENT));
}
