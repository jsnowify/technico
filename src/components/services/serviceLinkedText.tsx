export function serviceLinkedText(
  text: string,
  link?: { label: string; href: string },
) {
  if (!link) return text;
  const index = text.indexOf(link.label);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 transition-colors hover:text-purple-accent"
      >
        {link.label}
      </a>
      {text.slice(index + link.label.length)}
    </>
  );
}
