"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "draw" | "mark";

interface Monitoring26Props {
  label?: string;
  unit?: string;
  /** Response times from oldest to newest; the last one is the current figure. */
  points?: number[];
  /** Drawn as a faint dashed line across the chart. */
  threshold?: number;
  thresholdLabel?: string;
  startLabel?: string;
  endLabel?: string;
  statusLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const monitoring26Demo: Monitoring26Props = {
  label: "Response time, last hour",
  unit: "ms",
  points: [212, 198, 205, 231, 219, 246, 238, 224, 262, 241, 228, 214, 236, 252, 233, 219, 207, 226, 214, 198, 191, 203, 188, 182],
  threshold: 400,
  thresholdLabel: "Alert at 400 ms",
  startLabel: "60 min ago",
  endLabel: "Now",
  statusLabel: "Healthy",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "draw", draw: "mark", mark: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 0.9, draw: 2, mark: 0.6 };

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
export function Monitoring26({
  label,
  unit,
  points = [],
  threshold = 0,
  thresholdLabel,
  startLabel,
  endLabel,
  statusLabel,
  framed = true,
  stepMs = 900,
  className,
}: Monitoring26Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const current = points[points.length - 1] ?? 0;
  const [shownValue, setShownValue] = useState(current);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  /* The figure counts up while the line draws, eased so both land together. */
  useEffect(() => {
    if (phase === "reset") {
      setShownValue(0);
      return;
    }
    if (phase !== "draw") return;
    const duration = stepMs * 1.8;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShownValue(Math.round(current * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, current, stepMs]);

  const max = Math.max(1, threshold, ...points) * 1.15;
  const y = (value: number) => 100 - (value / max) * 100;
  const x = (index: number) => (points.length > 1 ? (index / (points.length - 1)) * 100 : 0);
  const line = points.map((value, index) => `${index === 0 ? "M" : "L"}${x(index)} ${y(value)}`).join(" ");
  const area = points.length > 1 ? `${line} L100 100 L0 100 Z` : "";
  const drawn = phase !== "reset";
  const marked = phase === "mark" || phase === "rest";

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
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <p className="text-5xl tracking-tight tabular-nums">
              {shownValue}
              <span className="ml-1.5 text-lg tracking-normal text-muted-foreground">{unit}</span>
            </p>
            {statusLabel && (
              <span
                className={cn(
                  "mb-1.5 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-sm text-emerald-700 transition-opacity duration-500 dark:text-emerald-400",
                  marked ? "opacity-100" : "opacity-0"
                )}
              >
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {statusLabel}
              </span>
            )}
          </div>

          <div className="relative mt-8 h-36">
            {threshold > 0 && (
              <div className="absolute inset-x-0 border-t border-dashed border-foreground/20" style={{ top: `${y(threshold)}%` }}>
                <span className="absolute right-0 bottom-1.5 text-sm text-muted-foreground">{thresholdLabel}</span>
              </div>
            )}
            {/* The line is revealed left to right by a clip, so the stroke never stretches. */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 size-full overflow-visible"
              style={{
                clipPath: drawn ? "inset(-10% 0 -10% 0)" : "inset(-10% 100% -10% 0)",
                transition: drawn && !entrance.still ? `clip-path ${stepMs * 1.8}ms cubic-bezier(0.33, 1, 0.68, 1)` : "none",
              }}
            >
              <path d={area} className="fill-primary/10" />
              <path
                d={line}
                fill="none"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="stroke-primary"
              />
            </svg>
            {points.length > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/15 transition-all duration-500 ease-out motion-reduce:transition-none",
                  marked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
                style={{ left: "100%", top: `${y(current)}%` }}
              />
            )}
          </div>
          <div className="mt-3 flex justify-between text-sm text-muted-foreground">
            <span>{startLabel}</span>
            <span>{endLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
