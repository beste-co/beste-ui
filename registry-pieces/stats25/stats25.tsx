"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "draw";

interface Stats25Props {
  title?: string;
  place?: string;
  value?: string;
  /** Appears once the earlier year is drawn in, as in "1.5°C warmer than 1994". */
  delta?: string;
  /** This year's readings, one per point. */
  series?: number[];
  /** The earlier year's readings at the same points. */
  baseline?: number[];
  labels?: string[];
  compareLabel?: string;
  comparedLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const stats25Demo: Stats25Props = {
  title: "Summer water temperature",
  place: "Upper Rhine, 14 river sensors",
  value: "21.9°C",
  delta: "1.5°C warmer than 1994",
  series: [17.2, 17.9, 18.6, 19.4, 20.3, 21.1, 21.6, 21.9, 21.4, 20.8, 20.1, 19.6],
  baseline: [16.1, 16.6, 17.2, 17.9, 18.7, 19.5, 20.1, 20.4, 20.0, 19.4, 18.8, 18.3],
  labels: ["June", "July", "August", "September"],
  compareLabel: "Compare with 1994",
  comparedLabel: "Compared with 1994",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "approach", approach: "press", press: "draw", draw: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.2, approach: 1.2, press: 0.4, draw: 1.6 };

const W = 100;
const H = 40;

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

export function Stats25({
  title,
  place,
  value,
  delta,
  series = [],
  baseline = [],
  labels = [],
  compareLabel,
  comparedLabel,
  cursorLabel,
  framed = true,
  stepMs = 900,
  className,
}: Stats25Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const compared = phase === "draw" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";

  const all = [...series, ...baseline];
  const min = all.length > 0 ? Math.min(...all) : 0;
  const max = all.length > 0 ? Math.max(...all) : 1;
  const range = Math.max(max - min, 0.001);
  const x = (index: number, count: number) => (count > 1 ? (index / (count - 1)) * W : W / 2);
  const y = (v: number) => H - 3 - ((v - min) / range) * (H - 6);
  const path = (values: number[]) =>
    values.map((v, index) => `${index === 0 ? "M" : "L"}${x(index, values.length).toFixed(2)} ${y(v).toFixed(2)}`).join(" ");
  const line = path(series);
  const area = series.length > 1 ? `${line} L${W} ${H} L0 ${H} Z` : "";
  /* The dot marks the warmest reading, the one the headline figure names. */
  const peakIndex = series.reduce((best, v, index) => (v > (series[best] ?? -Infinity) ? index : best), 0);
  const peak = series[peakIndex];

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "w-xl shrink-0",
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
        <div className="rounded-lg bg-card px-6 py-6 text-card-foreground shadow-xs">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="truncate text-lg tracking-tight">{title}</p>
              <p className="truncate text-sm text-muted-foreground">{place}</p>
            </div>
            <div className="relative grid shrink-0 justify-items-end">
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-9 items-center rounded-md border border-border px-3.5 text-sm transition-all duration-300 motion-reduce:transition-none",
                  phase === "press" && "scale-95 bg-muted",
                  compared ? "scale-95 opacity-0" : "opacity-100"
                )}
              >
                {compareLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-9 items-center gap-1.5 text-sm text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none",
                  compared ? "opacity-100" : "opacity-0"
                )}
              >
                <Check className="size-4 text-primary" aria-hidden="true" />
                {comparedLabel}
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-3rem, 5.5rem)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className={cn(
                    "size-7 fill-foreground stroke-background transition-transform duration-150",
                    phase === "press" && "scale-90"
                  )}
                >
                  <path d="M4 2.5 20 11l-7.2 1.6L9.6 19.5z" strokeLinejoin="round" />
                </svg>
                {cursorLabel && (
                  <span className="absolute left-4 top-6 rounded-full bg-foreground px-4 py-1.5 text-base text-background ring-2 ring-background">
                    {cursorLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-4">
            <p className="text-5xl tracking-tight tabular-nums">{value}</p>
            {delta && (
              <span
                className={cn(
                  "mb-1.5 inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-sm text-amber-700 transition-all duration-500 motion-reduce:transition-none dark:text-amber-400",
                  compared ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
                style={{ transitionDelay: compared ? `${stepMs}ms` : "0ms" }}
              >
                {delta}
              </span>
            )}
          </div>

          <div className="relative mt-6 h-40">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
              {area && <path d={area} className="fill-primary/10" />}
              {baseline.length > 1 && (
                <path
                  d={path(baseline)}
                  pathLength={1}
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  className="stroke-muted-foreground/50"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: compared ? 0 : 1,
                    opacity: compared ? 1 : 0,
                    /* Draw in left to right when compared; on reset it simply fades away. */
                    transition: entrance.still
                      ? "none"
                      : compared
                        ? "stroke-dashoffset 1400ms cubic-bezier(0.65, 0, 0.35, 1), opacity 200ms ease-out"
                        : "opacity 400ms ease-out, stroke-dashoffset 0ms linear 400ms",
                  }}
                />
              )}
              {series.length > 1 && (
                <path
                  d={line}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  className="stroke-primary"
                />
              )}
            </svg>
            {peak !== undefined && (
              <span
                aria-hidden="true"
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-card"
                style={{ left: `${(x(peakIndex, series.length) / W) * 100}%`, top: `${(y(peak) / H) * 100}%` }}
              />
            )}
          </div>
          {labels.length > 0 && (
            <div className="mt-3 flex justify-between">
              {labels.map((label, index) => (
                <span key={index} className="text-sm text-muted-foreground">
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
