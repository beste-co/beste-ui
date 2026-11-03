"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "arrive" | "trace";

interface Notification25Props {
  title?: string;
  detail?: string;
  /** Recent values behind the sparkline, oldest first. */
  trend?: number[];
  followTitle?: string;
  followTime?: string;
  /** Frosted rim around each note, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const notification25Demo: Notification25Props = {
  title: "Signups from Lisbon up 38%",
  detail: "Since Monday, mostly from one newsletter",
  trend: [12, 14, 13, 15, 14, 17, 23, 29],
  followTitle: "Checkout errors back to normal",
  followTime: "2h ago",
  framed: true,
  stepMs: 700,
};

const NEXT: Record<Phase, Phase> = {
  rest: "clear",
  clear: "arrive",
  arrive: "trace",
  trace: "rest",
};

/* How long each phase lasts, in steps. */
const HOLD: Record<Phase, number> = {
  rest: 5,
  clear: 1.2,
  arrive: 0.9,
  trace: 1.8,
};

const SW = 96;
const SH = 40;
const SPAD = 4;

/* The stack is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
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

export function Notification25({
  title,
  detail,
  trend = [],
  followTitle,
  followTime,
  framed = true,
  stepMs = 700,
  className,
}: Notification25Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  const coords = trend.map((value, index) => ({
    x: trend.length > 1 ? (index / (trend.length - 1)) * SW : 0,
    y: SPAD + (1 - (value - min) / range) * (SH - SPAD * 2),
  }));
  const line = coords.map((c, index) => `${index === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const end = coords[coords.length - 1];

  const noteShown = phase !== "clear";
  /* The line resets while its note is still hidden, then traces once the note has landed. */
  const traced = phase !== "arrive";

  const frame = cn(
    "transition-all duration-500 ease-out motion-reduce:transition-none",
    framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
  );
  const shown = (on: boolean) => (on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0");

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className="flex w-md shrink-0 flex-col gap-3"
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
        <div className={cn(frame, shown(noteShown))}>
          <div className="flex items-center gap-5 rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
            <div className="min-w-0 flex-1">
              {title && <p className="truncate text-lg font-normal tracking-tight">{title}</p>}
              {detail && <p className="mt-1 truncate text-sm text-muted-foreground">{detail}</p>}
            </div>
            {line && (
              <svg viewBox={`0 0 ${SW} ${SH}`} className="h-10 w-24 shrink-0 overflow-visible text-primary" aria-hidden="true">
                <path
                  d={line}
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1 1"
                  className={cn(
                    "ease-out motion-reduce:transition-none",
                    traced ? "transition-all duration-1000" : "transition-none"
                  )}
                  style={{ strokeDashoffset: traced ? 0 : 1 }}
                />
                {end && (
                  <circle
                    cx={end.x}
                    cy={end.y}
                    r={2.5}
                    className={cn(
                      "fill-current transition-opacity duration-300 ease-out motion-reduce:transition-none",
                      phase === "rest" ? "opacity-100" : "opacity-0"
                    )}
                  />
                )}
              </svg>
            )}
          </div>
        </div>

        {followTitle && (
          <div className={cn(frame, shown(phase === "rest"))}>
            <div className="flex items-center gap-3 rounded-lg bg-card px-5 py-3.5 text-card-foreground shadow-xs">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
              <p className="flex-1 truncate text-base text-muted-foreground">{followTitle}</p>
              {followTime && <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{followTime}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
