export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Never let a content field containing </script> escape JSON-LD.
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
