"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the list. Mirrors the inspector family; a contents list is usually bare. */
type Tone = "muted" | "outline" | "ghost";

/** Text and spacing preset. */
type Size = "sm" | "default" | "lg";

export interface ScrollTocItem {
  /** The id of the heading this entry scrolls to. */
  id: string;
  title: string;
  /** Heading level, 2 for h2, 3 for h3 and so on. @defaultValue 2 */
  level?: number;
}

export interface ScrollTocProps {
  /** The entries. Left out, headings are collected from `containerSelector`, or from `children`. */
  items?: ScrollTocItem[];
  /** Where to collect headings from when there are no `items`, e.g. "article". */
  containerSelector?: string;
  /** Which headings to collect. @defaultValue "h2, h3" */
  headingSelector?: string;
  /**
   * The element that scrolls: a selector, an element or a ref. Left out, the page.
   * With `children` it is the built-in scroll area.
   */
  root?: string | HTMLElement | React.RefObject<HTMLElement | null> | null;
  /**
   * Distance from the top of the scroll area, in pixels, where a heading becomes the
   * current one. Headings without a `scroll-margin-top` land just above it on click.
   * @defaultValue 96 */
  offset?: number;
  /** Heading above the list. Pass an empty string to drop it. @defaultValue "On this page" */
  title?: string;
  /** Hide deeper levels except under the current section. @defaultValue false */
  collapse?: boolean;
  /** Smooth scrolling on click, dropped for reduced motion. @defaultValue true */
  smooth?: boolean;
  /** Write the heading's id to the address bar on click. @defaultValue false */
  updateHash?: boolean;
  onActiveChange?: (id: string | null) => void;
  /**
   * Content to read. When given, the list and a scroll area holding this content are
   * laid out side by side and the headings come from it. Give the root a height.
   */
  children?: React.ReactNode;
  /** @defaultValue "ghost" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
  "aria-label"?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "rounded-xl bg-muted p-4",
  outline: "rounded-xl border border-border p-4",
  ghost: "",
};

const sizeStyles: Record<Size, { text: string; item: string; indent: number; title: string }> = {
  sm: { text: "text-sm", item: "py-1", indent: 12, title: "text-sm" },
  default: { text: "text-sm", item: "py-1.5", indent: 14, title: "text-sm" },
  lg: { text: "text-base", item: "py-2", indent: 16, title: "text-base" },
};

// Same spring as inspector-slider, through CSS linear() easing
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const slugify = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

/** Reads headings out of a container, giving any heading without an id a unique one. */
export function collectHeadings(container: ParentNode, selector = "h2, h3"): ScrollTocItem[] {
  const taken = new Set<string>();
  const items: ScrollTocItem[] = [];
  for (const el of Array.from(container.querySelectorAll<HTMLElement>(selector))) {
    const title = (el.textContent ?? "").trim();
    if (!title) continue;
    if (!el.id) {
      const base = slugify(title);
      let id = base;
      for (let n = 2; taken.has(id) || document.getElementById(id); n++) id = `${base}-${n}`;
      el.id = id;
    }
    taken.add(el.id);
    items.push({ id: el.id, title, level: Number(el.tagName.slice(1)) || 2 });
  }
  return items;
}

/** Plain text of a React node, for a heading's title before anything is mounted. */
function textOf(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/**
 * The same entries collectHeadings would find, read from the children's React tree, so the
 * list renders on the server and never shows empty while the page hydrates. Tag selectors only.
 */
function headingsFromChildren(children: React.ReactNode, selector = "h2, h3"): ScrollTocItem[] {
  const tags = new Set(selector.split(",").map((part) => part.trim().toLowerCase()).filter((part) => /^h[1-6]$/.test(part)));
  const taken = new Set<string>();
  const items: ScrollTocItem[] = [];
  const walk = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement<{ id?: string; children?: React.ReactNode }>(child)) return;
      if (typeof child.type === "string" && tags.has(child.type)) {
        const title = textOf(child.props.children).trim();
        if (!title) return;
        let id = child.props.id;
        if (!id) {
          const base = slugify(title);
          id = base;
          for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
        }
        taken.add(id);
        items.push({ id, title, level: Number(child.type.slice(1)) || 2 });
        return;
      }
      walk(child.props.children);
    });
  };
  walk(children);
  return items;
}

export const scrollTocDemo: ScrollTocProps = {
  title: "On this page",
  collapse: false,
  className: "h-[28rem] w-full max-w-3xl",
  children: (
    <article className="max-w-prose space-y-4 pr-2 text-base leading-relaxed text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">Before the session</h2>
      <p>Joni Mitchell tuned every guitar to its own open tuning, so the first hour of a session was spent on strings rather than songs.</p>
      <p>Engineers learned to leave that hour alone. It set the room, the tempo of the day and which instruments would be in reach.</p>
      <h3 className="text-lg font-semibold text-foreground">Choosing the room</h3>
      <p>A dead room keeps the voice close. A live one lets the guitar ring into the corners and come back a little late, which is its own kind of harmony.</p>
      <h3 className="text-lg font-semibold text-foreground">Microphones</h3>
      <p>One ribbon above the sound hole, one condenser near the twelfth fret, and a single valve microphone for the voice, set a hand apart from the lips.</p>
      <h2 className="text-xl font-semibold text-foreground">Tracking</h2>
      <p>Most takes were full performances. Stopping to punch in a line broke the thread of the tuning and the song together, so the band played through.</p>
      <p>When a take was close, the next one was usually worse. The rule became three passes, then a walk around the block.</p>
      <h3 className="text-lg font-semibold text-foreground">Headphone mixes</h3>
      <p>Every player had their own mix, and every mix had more of the voice than anyone admitted in the control room.</p>
      <h2 className="text-xl font-semibold text-foreground">Mixing</h2>
      <p>The mix was a matter of taking things away. Reverb was the room itself, and anything added later had to sound as if it had always been there.</p>
      <p>Tom Waits once described a good mix as the moment you stop hearing the speakers. That was the only test that mattered.</p>
      <h3 className="text-lg font-semibold text-foreground">Tape and air</h3>
      <p>Half-inch tape at thirty inches per second kept the top end open. The hiss was part of the record, like the paper under a drawing.</p>
      <h2 className="text-xl font-semibold text-foreground">Afterwards</h2>
      <p>The reels went into a cupboard labelled with the date and a single word for the mood of the day. Years later, those words were still right.</p>
      <p>Some of the best songs on the record were the ones nobody planned to keep.</p>
    </article>
  ),
};

type RootInput = ScrollTocProps["root"];

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function resolveRoot(root: RootInput): HTMLElement | null {
  if (!root || typeof document === "undefined") return null;
  if (typeof root === "string") return document.querySelector<HTMLElement>(root);
  if (root instanceof HTMLElement) return root;
  return root.current ?? null;
}

export function ScrollToc({
  items,
  containerSelector,
  headingSelector = "h2, h3",
  root,
  offset = 96,
  title = "On this page",
  collapse = false,
  smooth = true,
  updateHash = false,
  onActiveChange,
  children,
  tone = "ghost",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: ScrollTocProps) {
  const listRef = React.useRef<HTMLOListElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const areaRef = React.useRef<HTMLDivElement>(null);
  // With children, the entries are known from the tree up front; the DOM pass after mount only refines them
  const [collected, setCollected] = React.useState<ScrollTocItem[] | null>(() =>
    !items && children !== undefined ? headingsFromChildren(children, headingSelector) : null,
  );
  const [active, setActive] = React.useState<string | null>(null);
  const lockRef = React.useRef<{ id: string; until: number } | null>(null);
  const onActiveRef = React.useRef(onActiveChange);
  onActiveRef.current = onActiveChange;
  const headingId = React.useId();

  const layout = children !== undefined;
  const entries = items ?? collected ?? [];
  const minLevel = entries.reduce((m, item) => Math.min(m, item.level ?? 2), Number.POSITIVE_INFINITY);
  const metrics = sizeStyles[size];

  // Headings come from the built-in area, a selector, or not at all when items are given
  useIsoLayoutEffect(() => {
    if (items) return;
    const container = layout ? areaRef.current : containerSelector ? document.querySelector(containerSelector) : null;
    if (!container) return;
    const apply = (next: ScrollTocItem[]) =>
      setCollected((prev) =>
        prev && prev.length === next.length && prev.every((p, i) => p.id === next[i]?.id && p.title === next[i]?.title) ? prev : next,
      );
    // The first read happens before the browser paints; it also gives the headings their ids
    apply(collectHeadings(container, headingSelector));
    let frame = 0;
    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => apply(collectHeadings(container, headingSelector)));
    };
    const mo = new MutationObserver(read);
    mo.observe(container, { childList: true, subtree: true, characterData: true });
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
    };
  }, [items, layout, containerSelector, headingSelector]);

  const scroller = React.useCallback(() => (layout ? areaRef.current : resolveRoot(root)), [layout, root]);

  // The current section: the last heading past the line, the last one at the very bottom
  React.useEffect(() => {
    if (entries.length === 0) return;
    const scrollEl = scroller();
    const target: HTMLElement | Window = scrollEl ?? window;
    const headings = entries.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const visible = new Set<Element>();
    let frame = 0;

    const measure = () => {
      frame = 0;
      const viewTop = scrollEl ? scrollEl.getBoundingClientRect().top : 0;
      const scrollTop = scrollEl ? scrollEl.scrollTop : window.scrollY;
      const viewHeight = scrollEl ? scrollEl.clientHeight : window.innerHeight;
      const scrollHeight = scrollEl ? scrollEl.scrollHeight : document.documentElement.scrollHeight;
      const max = Math.max(0, scrollHeight - viewHeight);
      const atBottom = max > 0 && scrollTop >= max - 2;

      let current: string | null = null;
      if (atBottom) current = headings[headings.length - 1]?.id ?? null;
      else {
        for (const el of headings) {
          if (el.getBoundingClientRect().top - viewTop <= offset + 1) current = el.id;
          else break;
        }
        if (!current) {
          // Nothing has reached the line yet: the topmost heading in view, else the first
          const firstVisible = headings.find((el) => visible.has(el));
          current = (firstVisible ?? headings[0])?.id ?? null;
        }
      }
      const lock = lockRef.current;
      if (lock && performance.now() < lock.until) current = lock.id;
      setActive((prev) => (prev === current ? prev : current));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const io = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) visible.add(record.target);
          else visible.delete(record.target);
        }
        schedule();
      },
      { root: scrollEl, rootMargin: `-${offset}px 0px 0px 0px` },
    );
    for (const el of headings) io.observe(el);
    target.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const onEnd = () => {
      lockRef.current = null;
      schedule();
    };
    target.addEventListener("scrollend", onEnd);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      target.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      target.removeEventListener("scrollend", onEnd);
    };
  }, [entries, scroller, offset, containerSelector]);

  React.useEffect(() => {
    onActiveRef.current?.(active);
  }, [active]);

  // Slide the marker onto the current entry; it lands in place the first time
  useIsoLayoutEffect(() => {
    const list = listRef.current;
    const rail = railRef.current;
    if (!list || !rail) return;
    const place = () => {
      const link = active ? list.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(active)}"]`) : null;
      if (!link || link.offsetParent === null) {
        rail.dataset.marker = "hidden";
        return;
      }
      const first = rail.dataset.marker !== "shown";
      if (first) rail.dataset.instant = "true";
      rail.style.setProperty("--toc-y", `${link.offsetTop}px`);
      rail.style.setProperty("--toc-h", `${link.offsetHeight}px`);
      rail.dataset.marker = "shown";
      if (first) requestAnimationFrame(() => delete rail.dataset.instant);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active, entries, collapse]);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const scrollEl = scroller();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || Math.max(0, offset - 16);
    const viewTop = scrollEl ? scrollEl.getBoundingClientRect().top : 0;
    const current = scrollEl ? scrollEl.scrollTop : window.scrollY;
    const top = current + el.getBoundingClientRect().top - viewTop - margin;
    lockRef.current = { id, until: performance.now() + 1200 };
    setActive(id);
    (scrollEl ?? window).scrollTo({ top, behavior: smooth && !reduce ? "smooth" : "auto" });
    if (!el.hasAttribute("tabindex") && !/^(a|button|input|select|textarea)$/i.test(el.tagName)) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    if (updateHash) history.replaceState(null, "", `#${id}`);
  };

  // Which top-level section the current entry belongs to, for collapsing the rest
  const sectionOf = (index: number) => {
    for (let i = index; i >= 0; i--) if ((entries[i]?.level ?? 2) <= minLevel) return i;
    return 0;
  };
  const activeIndex = entries.findIndex((item) => item.id === active);
  const activeSection = activeIndex >= 0 ? sectionOf(activeIndex) : -1;

  const nav = (
    <nav
      aria-label={ariaLabel ?? (title ? undefined : "Table of contents")}
      aria-labelledby={title && !ariaLabel ? headingId : undefined}
      data-slot="scroll-toc"
      className={cn("min-w-0", metrics.text, toneStyles[tone], !layout && className)}
    >
      {title && (
        <p id={headingId} className={cn("mb-3 select-none font-medium text-foreground", metrics.title)}>
          {title}
        </p>
      )}
      <div className="relative">
        <div
          ref={railRef}
          aria-hidden="true"
          data-marker="hidden"
          className="group/rail pointer-events-none absolute inset-y-0 left-0 w-px bg-border"
        >
          <div
            className="absolute -left-px w-[3px] rounded-full bg-foreground opacity-100 group-data-[marker=hidden]/rail:opacity-0 motion-safe:transition-[transform,height,opacity] motion-safe:duration-500 group-data-[instant=true]/rail:transition-none"
            style={{ transform: "translateY(var(--toc-y, 0px))", height: "var(--toc-h, 0px)", transitionTimingFunction: SPRING_EASE }}
          />
        </div>
        <ol ref={listRef} className="relative">
          {entries.map((item, index) => {
            const depth = Math.max(0, (item.level ?? 2) - minLevel);
            const current = item.id === active;
            const hidden = collapse && depth > 0 && sectionOf(index) !== activeSection;
            return (
              <li
                key={item.id}
                data-depth={depth}
                className={cn(
                  "grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-300",
                  hidden ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
                )}
                style={{ transitionTimingFunction: SPRING_EASE }}
              >
                {/* Entries settle in top to bottom when the list first fills */}
                <div
                  className="min-h-0 overflow-hidden motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:starting:-translate-y-1 starting:opacity-0"
                  style={{ transitionDelay: `${Math.min(index, 12) * 35}ms`, transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                >
                  <a
                    href={`#${item.id}`}
                    data-toc-id={item.id}
                    data-active={current || undefined}
                    aria-current={current ? "location" : undefined}
                    tabIndex={hidden ? -1 : undefined}
                    onClick={(event) => go(event, item.id)}
                    style={{ paddingLeft: 12 + depth * metrics.indent }}
                    className={cn(
                      "block cursor-pointer select-none rounded-sm pr-2 leading-snug text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[active=true]:text-foreground data-[active=true]:font-medium",
                      metrics.item,
                    )}
                  >
                    {item.title}
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );

  if (!layout) return nav;

  return (
    <div data-slot="scroll-toc-layout" className={cn("grid min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-8 md:grid-cols-[12rem_minmax(0,1fr)]", className)}>
      <div className="hidden min-h-0 overflow-y-auto md:block">{nav}</div>
      <div ref={areaRef} tabIndex={0} className="min-h-0 overflow-y-auto overscroll-contain rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        {children}
      </div>
    </div>
  );
}
