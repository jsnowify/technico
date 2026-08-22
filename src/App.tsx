import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Loader from "./components/layout/Loader";
import PageTransition from "./components/layout/PageTransition";
import CustomCursor from "./components/layout/CustomCursor";
import SmoothScroll from "./components/layout/SmoothScroll";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { transitionState } from "./lib/transitionState";
import { notifyPageReady } from "./lib/pageReady";
import { getLenis } from "./lib/smoothScroll";
import { ScrollTrigger } from "./lib/gsap";

import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import Blog from "./pages/Blog/Blog";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // With Lenis active, a plain window.scrollTo fights its internal
    // scroll-position tracking (it'll "spring back" toward wherever
    // Lenis still thinks it is). Route the reset through Lenis itself
    // when it's mounted; fall back to native scroll when reduced-motion
    // has left Lenis uninitialized.
    const lenis = getLenis();

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

// Most navigation goes through TransitionLink, whose own timeline calls
// notifyPageReady() once its cover/reveal wave finishes. But some route
// changes never touch TransitionLink — browser back/forward, a typed
// URL, etc. — so nothing is covering the screen and nothing would ever
// tell the new page it's safe to reveal. This catches that case and
// fires the signal immediately instead.
//
// Compares the actual pathname against the previous one (rather than
// counting effect invocations) so it's unaffected by React StrictMode's
// dev-only double-invoke of effects on mount — the initial load isn't
// a "change" either way, so it's naturally skipped without needing an
// isFirstRun flag that double-invoke can desync.
function RouteReadyWatcher() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (!transitionState.isAnimating) {
      notifyPageReady();
    }
  }, [pathname]);

  return null;
}

function App() {
  // ScrollTrigger stale-measurement safety net, app-wide.
  //
  // Custom @font-face fonts (Suisse Intl) load asynchronously and
  // reflow the page after first paint. When that happens, every
  // ScrollTrigger's measured start/end positions go stale against the
  // new document height — Header's scroll morph, every [data-io-reveal]
  // block, every ScrambleText instance's own trigger, Hero's watermark
  // parallax, all of it. That reads exactly like erratic behavior on
  // scroll (especially scroll-reverse) near a section boundary — the
  // trigger point ScrollTrigger is watching for no longer lines up
  // with where the element actually sits.
  //
  // This used to live only inside Stack.tsx, scoped to whichever page
  // used the pinned "pile of folders" effect. Home no longer uses
  // <Stack>, so it's hoisted here instead, covering every route.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    window.addEventListener("load", refresh);
    // Safety net for anything else that reflows late (async images,
    // SVGs, etc.) — a second, delayed refresh after everything should
    // have settled.
    const timeout = window.setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Visually hidden until focused (tab from page load) — lets
          keyboard users jump past Header's nav/dropdown/magnetic CTAs
          straight to page content instead of tabbing through all of it
          on every single page. */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <Loader />
      <PageTransition />
      <CustomCursor />
      <SmoothScroll />
      <ScrollToTop />
      <RouteReadyWatcher />
      <Header />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
