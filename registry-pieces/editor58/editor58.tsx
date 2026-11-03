"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "fade" | "reset" | "scroll";

interface Editor58Props {
  title?: string;
  /** Shown beside the title, as in "140 pages". */
  lengthLabel?: string;
  totalPages?: number;
  fromPage?: number;
  toPage?: number;
  pageLabel?: string;
  ofLabel?: string;
  status?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const editor58Demo: Editor58Props = {
  title: "Field notes, full draft",
  lengthLabel: "140 pages",
  totalPages: 140,
  fromPage: 12,
  toPage: 87,
  pageLabel: "Page",
  ofLabel: "of",
  status: "Still looking for chapter 6",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = { rest: "fade", fade: "reset", reset: "scroll", scroll: "rest" };
const HOLD: Record<Phase, number> = { rest: 3.5, fade: 0.6, reset: 0.4, scroll: 5 };

/* Fixed line widths so the long page reads as text without any randomness. */
const PARAGRAPHS = [
  [96, 92, 98, 88, 54],
  [94, 97, 90, 72],
  [98, 93, 95, 91, 86, 40],
  [92, 96, 64],
  [97, 90, 94, 89, 70],
  [95, 98, 92, 46],
];

/* The card is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
function useFitScale() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [entrance, setEntrance] = useState<{ shown: boolean; delay: number; still: boolean }>({
    shown: false,
    delay: 0,
    still: false,
  });

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const update = () => {
      const cs = getComputedStyle(o);
      const w = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      setScale(Math.min(1, w / i.offsetWidth, h > 0 ? h / i.offsetHeight : 1));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(o);
    /* Rise in the first time the slot scrolls into view; slots further right arrive a beat later. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const left = entry.boundingClientRect.left / Math.max(window.innerWidth, 1);
        setEntrance({ shown: true, delay: Math.round(Math.min(Math.max(left, 0), 1) * 360), still });
        seen.disconnect();
      },
      { threshold: 0.3 }
    );
    seen.observe(o);
    return () => {
      observer.disconnect();
      seen.disconnect();
    };
  }, []);

  return { outer, inner, scale, entrance: { ...entrance, shown: entrance.shown && scale !== null } };
}

export function Editor58({
  title,
  lengthLabel,
  totalPages = 140,
  fromPage = 12,
  toPage = 87,
  pageLabel,
  ofLabel,
  status,
  framed = true,
  stepMs = 800,
  className,
}: Editor58Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [page, setPage] = useState(toPage);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  /* The page counter crawls up with the same ease as the scroll, so it lands as the page stops. */
  useEffect(() => {
    if (phase === "reset") {
      setPage(fromPage);
      return;
    }
    if (phase !== "scroll") return;
    const duration = HOLD.scroll * stepMs;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = -(Math.cos(Math.PI * t) - 1) / 2;
      setPage(Math.round(fromPage + (toPage - fromPage) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, fromPage, toPage, stepMs]);

  const atStart = phase === "reset";
  const hidden = phase === "fade" || phase === "reset";
  const total = Math.max(1, totalPages);
  const thumbTop = ((atStart ? fromPage : toPage) / total) * 100;

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "w-md shrink-0",
          framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
        style={{
          transform: `scale(${scale ?? 1})`,
          opacity: entrance.shown ? 1 : 0,
          translate: entrance.shown ? "0 0" : "0 1.25rem",
          filter: entrance.shown ? "blur(0px)" : "blur(10px)",
          transition: entrance.still
            ? "none"
            : "opacity 1000ms ease-out, translate 1400ms cubic-bezier(0.16, 1, 0.3, 1), filter 1000ms ease-out",
          transitionDelay: `${entrance.delay}ms`,
        }}
      >
        <div className="rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
          <div className="flex items-baseline justify-between gap-4">
            <p className="truncate text-lg tracking-tight">{title}</p>
            <p className="shrink-0 text-sm text-muted-foreground">{lengthLabel}</p>
          </div>

          <div className="relative mt-5 h-72 overflow-hidden rounded-md border border-border bg-background">
            <div
              className={cn(
                "transition-opacity duration-500 motion-reduce:transition-none",
                hidden ? "opacity-0" : "opacity-100"
              )}
            >
              {/* One long page scrolling past; it jumps back only while hidden. */}
              <div
                aria-hidden="true"
                className="flex flex-col gap-6 px-5 py-5 pr-8 motion-reduce:transition-none"
                style={{
                  transform: `translateY(${atStart ? "0%" : "-62%"})`,
                  transition: phase === "scroll" && !entrance.still ? `transform ${HOLD.scroll * stepMs}ms cubic-bezier(0.45, 0, 0.55, 1)` : "none",
                }}
              >
                {[0, 1, 2].map((round) =>
                  PARAGRAPHS.map((lines, index) => (
                    <div key={`${round}-${index}`} className="flex flex-col gap-2">
                      {index % 3 === 0 && <span className="mb-1 h-2.5 w-28 rounded-full bg-foreground/25" />}
                      {lines.map((width, line) => (
                        <span key={line} className="h-1.5 rounded-full bg-foreground/10" style={{ width: `${width}%` }} />
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
            <span aria-hidden="true" className="absolute inset-y-3 right-2 w-1 rounded-full bg-muted">
              <span
                className="absolute inset-x-0 h-8 -translate-y-1/2 rounded-full bg-foreground/30 motion-reduce:transition-none"
                style={{
                  top: `${thumbTop}%`,
                  transition: phase === "scroll" && !entrance.still ? `top ${HOLD.scroll * stepMs}ms cubic-bezier(0.45, 0, 0.55, 1)` : "none",
                }}
              />
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="truncate text-sm text-muted-foreground">{status}</p>
            <p className="shrink-0 text-sm tabular-nums">
              {pageLabel} {page} {ofLabel} {totalPages}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
