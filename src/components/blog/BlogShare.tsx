/* ================================================================
   BLOG SHARE
   ----------------------------------------------------------------
   Blog-specific UI: the small dark "SHARE" pill (Facebook / X /
   LinkedIn) that sits alongside a blog post's body copy. It has no
   business logic of its own — the share links are plain `?u=`/
   `?url=` query params — so this stays a plain Server Component
   and lives under components/blog rather than components/ui; it's
   only ever rendered from the blog post page and isn't meant to be
   reused anywhere else.

   STICKY BEHAVIOR
   `position: sticky` (`lg:sticky lg:top-32`) on the outer wrapper,
   no scroll listeners. A sticky element stays pinned only for as
   long as it's inside its parent's box, so it needs a parent that's
   taller than itself — here that's the flex row in the blog post
   page (`BlogHero` + `<BlogShare>` as row-items with
   `items-start`), which is exactly as tall as the article copy next
   to it. That's what makes the pill follow the scroll while the
   article is still going, then stop and scroll away normally once
   the article (and its parent row) ends — the parent boundary
   *is* the blog content area, so nothing extra is needed to bound
   it. `self-start` is set explicitly here too, so this still works
   correctly even if the row's own alignment ever changes.

   Desktop-only for now (`hidden lg:block`) — mobile placement for
   this panel hasn't been speced yet; unchanged from before.
   ================================================================ */

interface BlogShareProps {
  /** Absolute URL of the post being shared. */
  url: string;
  title: string;
}

/** One icon glyph per network, drawn from a shared 24x24 viewBox. */
const SHARE_ICONS = {
  facebook:
    "M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.86c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.58v1.9h2.78l-.44 2.91h-2.34v7.03C18.34 21.21 22 17.06 22 12.06Z",
  x: "M13.6 10.62 20.16 3h-1.56l-5.7 6.62L8.36 3H3l6.88 10.01L3 21h1.56l6.02-6.99L15.64 21H21l-7.4-10.38Zm-2.13 2.48-.7-1L5.3 4.17h2.4l4.48 6.41.7 1 5.83 8.34h-2.4l-4.84-6.92Z",
  linkedin:
    "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18.34H5.67v-8.4h2.67v8.4ZM7 8.78a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.34 9.56h-2.67v-4.08c0-.97-.02-2.22-1.35-2.22-1.36 0-1.57 1.06-1.57 2.15v4.15H10.1v-8.4h2.56v1.15h.04c.36-.68 1.24-1.4 2.55-1.4 2.73 0 3.23 1.8 3.23 4.13v4.52Z",
} as const;

export default function BlogShare({ url, title }: BlogShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      path: SHARE_ICONS.facebook,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      path: SHARE_ICONS.x,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      path: SHARE_ICONS.linkedin,
    },
  ];

  return (
    <div className="hidden self-start lg:sticky lg:top-32 lg:block lg:h-fit lg:w-[88px]">
      <div className="flex flex-col items-center gap-6 rounded-[20px] bg-[#1A1B1E] py-6">
        <span className="font-mono text-[11px] font-light tracking-[0.14em] text-white/50 uppercase">
          Share
        </span>

        <div className="flex flex-col gap-3">
          {shareLinks.map(({ label, href, path }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${label}`}
              data-cursor="highlight"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-secondary text-white transition-opacity hover:opacity-80"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path d={path} fill="currentColor" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
