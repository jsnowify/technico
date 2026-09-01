import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-black-text">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-black-text/70">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-purple-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-accent"
      >
        Back home
      </Link>
    </div>
  );
}
