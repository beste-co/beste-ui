"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useRef } from "react";

type PageRevealProps = ComponentPropsWithoutRef<"div">;

export const pageRevealDemo: PageRevealProps = {
  className: "mx-auto flex max-w-xl flex-col gap-4 p-6",
  children: (
    <section data-reveal="">
      <h2 className="text-3xl font-semibold tracking-tight">Every section blurs into focus</h2>
      <p className="mt-3 text-base text-muted-foreground">Headings, paragraphs and cards arrive one after another as they scroll in.</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted p-5">First card</div>
        <div className="rounded-2xl bg-muted p-5">Second card</div>
      </div>
    </section>
  ),
};

/*
 * Element selectors only, so nothing that rewrites classes can detach it. The
 * sections stay hidden until the walker below has dimmed their pieces.
 */
const REVEAL_STYLE = `
@media (prefers-reduced-motion: no-preference) and (scripting: enabled) {
  [data-reveal-page]:not([data-reveal-ready]) [data-reveal],
  [data-reveal-page]:not([data-reveal-ready]) [data-reveal-nav] { opacity: 0; }
}
`;

const REVEAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const REVEAL_MS = 1100;
const REVEAL_STEP_MS = 90;
const REVEAL_MAX_DEPTH = 3;
const REVEAL_PROPS = ["opacity", "filter", "transition"];
const LEAF_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "BLOCKQUOTE", "A", "BUTTON", "IMG", "LI", "svg"]);

/*
 * Walks a section down to the pieces a reader sees as one thing: a heading, a
 * paragraph, a card, a photo, a list row. Surfaces (cards, panels, photo
 * frames) stay whole; layout wrappers are opened. Nothing in the blocks is
 * marked for this. Only reads the DOM, and each element's style once.
 */
function collectPieces(sections: Element[]) {
  const styles = new Map<Element, CSSStyleDeclaration>();
  const styleOf = (el: Element) => {
    let style = styles.get(el);
    if (!style) {
      style = getComputedStyle(el);
      styles.set(el, style);
    }
    return style;
  };

  const flowChildren = (el: Element) =>
    Array.from(el.children).filter((child) => {
      if (child.getAttribute("aria-hidden") === "true") return false;
      const style = styleOf(child);
      return style.display !== "none" && style.position !== "absolute" && style.position !== "fixed";
    });

  const out: Element[] = [];
  const walk = (el: Element, depth: number) => {
    const style = styleOf(el);
    // Something already moving (a marquee track) is left alone: visible from the start, never split into pieces
    if (style.animationName !== "none") return;
    const kids = flowChildren(el);
    const surface = style.backgroundImage !== "none" || !["rgba(0, 0, 0, 0)", "transparent"].includes(style.backgroundColor);
    if (kids.length === 0 || LEAF_TAGS.has(el.tagName) || depth >= REVEAL_MAX_DEPTH) {
      out.push(el);
      return;
    }
    if (kids.length === 1 && !surface) {
      walk(kids[0]!, depth);
      return;
    }
    if (surface && depth > 0) {
      out.push(el);
      return;
    }
    for (const kid of kids) walk(kid, depth + 1);
  };
  for (const section of sections) walk(section, 0);

  // Anything with its own filter (a blur-in photo) keeps it
  return out.filter((el): el is HTMLElement => (el instanceof HTMLElement || el instanceof SVGElement) && styleOf(el).filter === "none");
}

/**
 * Every `[data-reveal]` section inside blurs into focus as it scrolls in, its
 * pieces one after another. `[data-reveal-nav]` elements fade in on load.
 */
export function PageReveal({ children, ...props }: PageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = ref.current;
    if (!page) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      page.setAttribute("data-reveal-ready", "");
      return;
    }

    // All reads first, then all writes, so the walk never forces a fresh style pass
    const pieces = collectPieces(Array.from(page.querySelectorAll("[data-reveal]")));
    const navs = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal-nav]"));
    for (const piece of pieces) {
      piece.style.opacity = "0";
      piece.style.filter = "blur(8px)";
    }
    for (const nav of navs) nav.style.opacity = "0";
    page.setAttribute("data-reveal-ready", "");

    const navFrame = requestAnimationFrame(() => {
      for (const nav of navs) {
        nav.style.transition = `opacity ${REVEAL_MS}ms ${REVEAL_EASE}`;
        nav.style.opacity = "1";
      }
    });
    const clear = (el: HTMLElement) => {
      for (const prop of REVEAL_PROPS) el.style.removeProperty(prop);
    };
    const timers = [window.setTimeout(() => navs.forEach(clear), REVEAL_MS + 100)];

    const order = new Map(pieces.map((piece, index) => [piece, index]));
    const observer = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
        arriving.forEach((piece, index) => {
          observer.unobserve(piece);
          const delay = Math.min(index, 8) * REVEAL_STEP_MS;
          piece.style.transition = `opacity ${REVEAL_MS}ms ${REVEAL_EASE} ${delay}ms, filter ${REVEAL_MS}ms ${REVEAL_EASE} ${delay}ms`;
          piece.style.opacity = "1";
          piece.style.filter = "blur(0)";
          // Hand the element back to its own classes once it has landed
          timers.push(window.setTimeout(() => clear(piece), REVEAL_MS + delay + 50));
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    for (const piece of pieces) observer.observe(piece);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(navFrame);
      for (const timer of timers) window.clearTimeout(timer);
      pieces.forEach(clear);
      navs.forEach(clear);
    };
  }, []);

  return (
    <div ref={ref} data-reveal-page="" {...props}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static rules, no interpolation */}
      <style dangerouslySetInnerHTML={{ __html: REVEAL_STYLE }} />
      {children}
    </div>
  );
}
