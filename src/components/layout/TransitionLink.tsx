import { forwardRef } from "react";
import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";

/* ================================================================
   TRANSITION LINK
   ================================================================
   Thin wrapper around next/link's <Link> for internal navigation.

   Named "TransitionLink" (rather than just re-exporting <Link>) so
   any future page-transition behavior (e.g. the View Transitions
   API) has a single call site to land in later, without touching
   every caller in Header/Footer/NavLink again.

   Deliberately NOT a Client Component: next/link's <Link> can be
   rendered directly from Server Components, and keeping this file
   free of hooks lets Footer.tsx (a Server Component) render it
   without pulling in an unnecessary client boundary — real <a href>
   markup ships in the initial HTML either way, which is what
   crawlers need (see consideration.md, "Internal links").
   ================================================================ */

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ to, children, ...rest }, ref) {
    return (
      <Link ref={ref} href={to} {...rest}>
        {children}
      </Link>
    );
  },
);

export default TransitionLink;
