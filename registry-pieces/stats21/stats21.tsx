"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "draw" | "mark";

interface SideStat {
  label: string;
  value: string;
}

interface Stats21Props {
  label?: string;
  /** The figure before the change; the count starts here each loop. */
  before?: number;
  after?: number;
  suffix?: string;
  decimals?: number;
  delta?: string;
  /** One value per week. The line turns to the accent at `switchIndex`. */
  points?: number[];
  switchIndex?: number;
  markerLabel?: string;
  axisStart?: string;
  axisEnd?: string;
  stats?: SideStat[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const stats21Demo: Stats21Props = {
  label: "Checkout conversion",
  before: 2.2,
  after: 3.4,
  suffix: "%",
  decimals: 1,
  delta: "55% since the switch",
  points: [2.1, 2.3, 2.2, 2.1, 2.3, 2.2, 2.6, 2.8, 3.0, 3.1, 3.3, 3.4],
  switchIndex: 5,
  markerLabel: "Moved to Acme",
  axisStart: "12 weeks ago",
  axisEnd: "This week",
  stats: [
    { label: "Abandoned carts", value: "23%" },
    { label: "Average order", value: "$84" },
  ],
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "draw", draw: "mark", mark: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1, draw: 2.2, mark: 0.6 };

const W = 400;
const H = 144;
const PAD = 10;

/* The card is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
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

export function Stats21({
  label,
  before = 0,
  after = 0,
  suffix,
  decimals = 0,
  delta,
  points = [],
  switchIndex = 0,
  markerLabel,
  axisStart,
  axisEnd,
  stats = [],
  framed = true,
  stepMs = 900,
  className,
}: Stats21Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [shownValue, setShownValue] = useState(after);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  /* The figure climbs from the old rate while the new part of the line draws. */
  useEffect(() => {
    if (phase === "reset") {
      setShownValue(before);
      return;
    }
    if (phase !== "draw") return;
    const duration = stepMs * 2;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShownValue(before + (after - before) * (1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, before, after, stepMs]);

  const min = points.length > 0 ? Math.min(...points) : 0;
  const max = points.length > 0 ? Math.max(...points) : 1;
  const range = max - min || 1;
  const x = (i: number) => PAD + (points.length > 1 ? (i / (points.length - 1)) * (W - PAD * 2) : 0);
  const y = (v: number) => H - PAD - ((v - min) / range) * (H - PAD * 2);
  const line = (from: number, to: number) =>
    points
      .slice(from, to + 1)
      .map((v, i) => `${i === 0 ? "M" : "L"}${x(from + i).toFixed(1)} ${y(v).toFixed(1)}`)
      .join(" ");

  const last = points.length - 1;
  const pivot = Math.min(Math.max(switchIndex, 0), Math.max(last, 0));
  const beforePath = line(0, pivot);
  const afterPath = line(pivot, last);
  const areaPath = `${afterPath} L${x(last).toFixed(1)} ${H} L${x(pivot).toFixed(1)} ${H} Z`;
  const endValue = points[last] ?? 0;

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
              {shownValue.toFixed(decimals)}
              {suffix}
            </p>
            {delta && (
              <span
                className={cn(
                  "mb-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-sm text-emerald-700 transition-opacity duration-500 motion-reduce:transition-none dark:text-emerald-400",
                  marked ? "opacity-100" : "opacity-0"
                )}
              >
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
                {delta}
              </span>
            )}
          </div>

          <div className="relative mt-8 h-36">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
              <line
                x1={x(pivot)}
                x2={x(pivot)}
                y1={0}
                y2={H}
                strokeDasharray="3 4"
                className="stroke-border"
                strokeWidth={1}
              />
              <path
                d={areaPath}
                className="fill-primary/10 transition-opacity motion-reduce:transition-none"
                style={{ opacity: marked ? 1 : 0, transitionDuration: marked ? "700ms" : "300ms" }}
              />
              <path
                d={beforePath}
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-muted-foreground/40"
              />
              <path
                d={afterPath}
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1"
                className="stroke-primary transition-[stroke-dashoffset] ease-out motion-reduce:transition-none"
                style={{ strokeDashoffset: drawn ? 0 : 1, transitionDuration: drawn ? `${stepMs * 2}ms` : "400ms" }}
              />
            </svg>
            {markerLabel && (
              <span
                className="absolute top-0 whitespace-nowrap pl-2 text-sm text-muted-foreground"
                style={{ left: `${(x(pivot) / W) * 100}%` }}
              >
                {markerLabel}
              </span>
            )}
            <span
              aria-hidden="true"
              className={cn(
                "absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-card transition-all duration-500 ease-out motion-reduce:transition-none",
                marked ? "scale-100 opacity-100" : "scale-50 opacity-0"
              )}
              style={{ left: `${(x(last) / W) * 100}%`, top: `${(y(endValue) / H) * 100}%` }}
            />
          </div>
          {(axisStart || axisEnd) && (
            <div className="mt-2 flex justify-between gap-4 text-sm text-muted-foreground">
              <span>{axisStart}</span>
              <span>{axisEnd}</span>
            </div>
          )}

          {stats.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
              {stats.map((stat, index) => (
                <div key={index}>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-0.5 text-lg tracking-tight tabular-nums">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
