"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "rise" | "mark";

interface DayValue {
  label: string;
  value: number;
  /** Same day last week, drawn as a faint bar behind. */
  previous?: number;
}

interface SideStat {
  label: string;
  value: string;
}

interface Stats20Props {
  label?: string;
  value?: number;
  delta?: string;
  days?: DayValue[];
  /** Index of the day that gets the value bubble, usually today. */
  highlight?: number;
  /** Shown after the number in the bubble, as in "14 deploys". */
  unit?: string;
  stats?: SideStat[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const stats20Demo: Stats20Props = {
  label: "Deploys this week",
  value: 64,
  delta: "18% vs last week",
  days: [
    { label: "Mon", value: 9, previous: 7 },
    { label: "Tue", value: 12, previous: 9 },
    { label: "Wed", value: 10, previous: 8 },
    { label: "Thu", value: 14, previous: 10 },
    { label: "Fri", value: 11, previous: 9 },
    { label: "Sat", value: 3, previous: 5 },
    { label: "Sun", value: 5, previous: 6 },
  ],
  highlight: 3,
  unit: "deploys",
  stats: [
    { label: "Median lead time", value: "3h 12m" },
    { label: "Change failure rate", value: "1.6%" },
  ],
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "rise", rise: "mark", mark: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 0.9, rise: 2, mark: 0.6 };

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

export function Stats20({
  label,
  value = 0,
  delta,
  days = [],
  highlight = 0,
  unit,
  stats = [],
  framed = true,
  stepMs = 900,
  className,
}: Stats20Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [shownValue, setShownValue] = useState(value);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  /* The figure counts up while the bars rise, eased so it lands with the last bar. */
  useEffect(() => {
    if (phase === "reset") {
      setShownValue(0);
      return;
    }
    if (phase !== "rise") return;
    const duration = stepMs * 1.8;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShownValue(Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, value, stepMs]);

  const max = Math.max(1, ...days.map((day) => Math.max(day.value, day.previous ?? 0)));
  const up = phase !== "reset";
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
          <p className="mt-1 text-5xl tracking-tight tabular-nums">{shownValue}</p>
          {delta && (
            <p
              className={cn(
                "mt-1 text-sm text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                marked ? "opacity-100" : "opacity-0"
              )}
            >
              {delta}
            </p>
          )}

          <div className="mt-8 flex h-36 items-end gap-2.5">
            {days.map((day, index) => {
              const isHighlight = index === highlight;
              return (
                <div key={index} className="relative flex h-full flex-1 items-end justify-center">
                  {day.previous !== undefined && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 rounded-sm bg-muted"
                      style={{ height: `${(day.previous / max) * 100}%` }}
                    />
                  )}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative w-full origin-bottom rounded-sm transition-transform ease-out motion-reduce:transition-none",
                      isHighlight ? "bg-primary" : "bg-primary/35"
                    )}
                    style={{
                      height: `${(day.value / max) * 100}%`,
                      transform: `scaleY(${up ? 1 : 0})`,
                      transitionDuration: up ? "900ms" : "400ms",
                      transitionDelay: up ? `${index * 90}ms` : "0ms",
                    }}
                  />
                  {isHighlight && (
                    <span
                      className={cn(
                        "absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-sm tabular-nums text-background shadow-lg transition-all duration-500 ease-out motion-reduce:transition-none",
                        marked ? "opacity-100" : "translate-y-1 opacity-0"
                      )}
                      style={{ bottom: `calc(${(day.value / max) * 100}% + 0.5rem)` }}
                    >
                      {day.value} {unit}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2.5">
            {days.map((day, index) => (
              <span
                key={index}
                className={cn(
                  "flex-1 text-center text-sm",
                  index === highlight ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {day.label}
              </span>
            ))}
          </div>

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
