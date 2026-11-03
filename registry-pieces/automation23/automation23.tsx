"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press";

interface RuleRow {
  label: string;
  value: string;
}

interface Automation23Props {
  title?: string;
  /** The trigger first, then what happens. */
  rows?: RuleRow[];
  offLabel?: string;
  onLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const automation23Demo: Automation23Props = {
  title: "Low stock reorder",
  rows: [
    { label: "When", value: "Stock drops below 20 units" },
    { label: "Then", value: "Order 200 from Northwind" },
    { label: "And", value: "Tell the warehouse in #floor" },
  ],
  offLabel: "Paused",
  onLabel: "Live",
  framed: true,
  stepMs: 800,
};

/* One lap is 8.8 steps, the same as automation24, so the two stay in step when placed side by side. */
const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "approach", approach: "press", press: "rest" };
const HOLD: Record<Phase, number> = { rest: 6, reset: 1.2, approach: 1.2, press: 0.4 };

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

export function Automation23({
  title,
  rows = [],
  offLabel,
  onLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Automation23Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const on = phase === "rest";
  const onSwitch = phase === "approach" || phase === "press";

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
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg tracking-tight">{title}</p>
              <span className="relative mt-0.5 grid text-sm">
                <span
                  className={cn(
                    "col-start-1 row-start-1 text-muted-foreground transition-opacity duration-300",
                    on ? "opacity-0" : "opacity-100"
                  )}
                >
                  {offLabel}
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 inline-flex items-center gap-2 text-emerald-700 transition-opacity duration-300 dark:text-emerald-400",
                    on ? "opacity-100" : "opacity-0"
                  )}
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {onLabel}
                </span>
              </span>
            </div>
            <div className="relative shrink-0">
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-6 w-11 items-center rounded-full p-0.5 transition-colors duration-300 motion-reduce:transition-none",
                  on ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "size-5 rounded-full bg-card shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none",
                    on ? "translate-x-5" : "translate-x-0",
                    phase === "press" && "scale-90"
                  )}
                />
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onSwitch ? "translate(0.5rem, 0.25rem)" : "translate(-2.5rem, 3.25rem)" }}
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

          <div className="mt-5 border-t border-border pt-2">
            {rows.map((row, index) => (
              <div
                key={index}
                className={cn(
                  "flex h-14 items-center gap-4 transition-opacity duration-500 motion-reduce:transition-none",
                  on ? "opacity-100" : "opacity-60"
                )}
                style={{ transitionDelay: on ? `${index * 120}ms` : "0ms" }}
              >
                <span className="w-12 shrink-0 text-sm text-muted-foreground">{row.label}</span>
                <span className="min-w-0 flex-1 truncate text-base">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
