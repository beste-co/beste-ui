"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "fade" | "reset" | "draw";

interface Dashboard36Props {
  title?: string;
  subtitle?: string;
  /** Share of the cohort still active each week, from 0 to 100. The last value is the headline figure. */
  points?: number[];
  suffix?: string;
  startLabel?: string;
  endLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const dashboard36Demo: Dashboard36Props = {
  title: "Cohort retention",
  subtitle: "Signed up in March",
  points: [100, 68, 55, 49, 46, 44, 43, 42],
  suffix: "%",
  startLabel: "Week 1",
  endLabel: "Week 8",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "fade",
  fade: "reset",
  reset: "draw",
  draw: "rest",
};

/* How long each phase lasts, in steps. */
const HOLD: Record<Phase, number> = {
  rest: 4.5,
  fade: 0.8,
  reset: 0.3,
  draw: 2.6,
};

const W = 400;
const H = 144;
const PAD = 8;

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

/* Eases a figure toward its target; `instant` snaps it while it is hidden. */
function useEasedNumber(target: number, duration: number, instant: boolean) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (instant || from === target) {
      current.current = target;
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const next = from + (target - from) * (1 - (1 - p) ** 3);
      current.current = next;
      setValue(next);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, instant]);

  return value;
}

/* A soft Catmull-Rom curve through the points. */
function buildPath(coords: { x: number; y: number }[]) {
  if (coords.length === 0) return "";
  const at = (i: number) => coords[Math.max(0, Math.min(coords.length - 1, i))] ?? { x: 0, y: 0 };
  let d = `M ${at(0).x} ${at(0).y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

export function Dashboard36({
  title,
  subtitle,
  points = [],
  suffix,
  startLabel,
  endLabel,
  framed = true,
  stepMs = 800,
  className,
}: Dashboard36Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const drawMs = stepMs * 2;
  const first = points[0] ?? 0;
  const last = points[points.length - 1] ?? 0;
  const counting = phase === "draw" || phase === "rest";
  const figure = useEasedNumber(counting ? last : first, drawMs, phase === "reset");

  const top = Math.max(100, ...points);
  const coords = points.map((value, index) => ({
    x: points.length > 1 ? (index / (points.length - 1)) * W : 0,
    y: PAD + (1 - value / top) * (H - PAD * 2),
  }));
  const line = buildPath(coords);
  const end = coords[coords.length - 1];
  const area = line ? `${line} L ${W} ${H} L 0 ${H} Z` : "";

  const drawn = phase === "draw" || phase === "rest" || phase === "fade";
  const visible = phase !== "fade" && phase !== "reset";

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
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {title && <p className="truncate text-lg font-normal tracking-tight">{title}</p>}
              {subtitle && <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <p
              className={cn(
                "shrink-0 text-3xl font-normal tabular-nums tracking-tight transition-all duration-500 ease-out motion-reduce:transition-none",
                visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
            >
              {Math.round(figure)}
              {suffix}
            </p>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 block h-36 w-full overflow-visible text-primary" aria-hidden="true">
            {[0, 0.5, 1].map((t) => (
              <line
                key={t}
                x1={0}
                x2={W}
                y1={PAD + t * (H - PAD * 2)}
                y2={PAD + t * (H - PAD * 2)}
                className="stroke-border"
                strokeWidth={1}
                strokeDasharray="2 4"
              />
            ))}
            <path
              d={area}
              className={cn(
                "fill-current transition-opacity duration-700 ease-out motion-reduce:transition-none",
                phase === "rest" ? "opacity-10" : "opacity-0"
              )}
            />
            <path
              d={line}
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 1"
              className={cn(
                "ease-out motion-reduce:transition-none",
                phase === "reset" ? "transition-none" : "transition-all duration-500",
                visible || phase === "reset" ? "opacity-100" : "opacity-0"
              )}
              style={{
                strokeDashoffset: drawn ? 0 : 1,
                transitionDuration: phase === "draw" ? `${drawMs}ms` : undefined,
              }}
            />
            {end && (
              <circle
                cx={end.x}
                cy={end.y}
                r={4}
                strokeWidth={2}
                className={cn(
                  "fill-card stroke-current transition-opacity duration-500 ease-out motion-reduce:transition-none",
                  phase === "rest" ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </svg>

          {(startLabel || endLabel) && (
            <div className="mt-3 flex justify-between text-sm text-muted-foreground">
              <span>{startLabel}</span>
              <span>{endLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
