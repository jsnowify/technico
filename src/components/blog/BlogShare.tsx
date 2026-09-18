interface BlogShareProps {
  url: string;
  title: string;
}

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
  const links = [
    [
      "Facebook",
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      SHARE_ICONS.facebook,
    ],
    [
      "X",
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      SHARE_ICONS.x,
    ],
    [
      "LinkedIn",
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      SHARE_ICONS.linkedin,
    ],
  ] as const;

  return (
    <aside className="hidden self-start border border-white/20 lg:sticky lg:top-32 lg:block">
      <p className="border-b border-white/20 p-4 text-center font-mono text-[10px] tracking-[0.05em] text-content-muted uppercase">
        Share
      </p>
      {links.map(([label, href, path]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="flex h-14 w-14 items-center justify-center border-b border-white/15 text-content transition-colors last:border-b-0 hover:bg-accent hover:text-black-bg focus-visible:bg-accent focus-visible:text-black-bg focus-visible:outline-none"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path d={path} fill="currentColor" />
          </svg>
        </a>
      ))}
    </aside>
  );
}
