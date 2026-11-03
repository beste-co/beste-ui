"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "hide" | "reset" | "approach" | "press" | "move";

interface WeekEvent {
  title: string;
  /** Column index in `days`. */
  day: number;
  /** Where the event starts, from 0 (top of the day) to 1. */
  start: number;
  /** How much of the day it fills, from 0 to 1. */
  length: number;
}

interface Calendar39Props {
  title?: string;
  days?: string[];
  events?: WeekEvent[];
  /** The meeting that starts on the quiet day and is moved off it. */
  moving?: WeekEvent & { to: number; toStart: number };
  notice?: string;
  moveLabel?: string;
  movedLabel?: string;
  /** Shown in the quiet day's column once it is empty. */
  quietLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const calendar39Demo: Calendar39Props = {
  title: "Next week",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  events: [
    { title: "Team check in", day: 0, start: 0.08, length: 0.26 },
    { title: "Design review", day: 1, start: 0.52, length: 0.3 },
    { title: "1:1 with Bill", day: 2, start: 0.2, length: 0.26 },
  ],
  moving: { title: "Roadmap sync", day: 4, start: 0.3, length: 0.3, to: 3, toStart: 0.12 },
  notice: "Fridays stay free of meetings",
  moveLabel: "Move to Thursday",
  movedLabel: "Moved",
  quietLabel: "Focus day",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "hide", hide: "reset", reset: "approach", approach: "press", press: "move", move: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, hide: 0.6, reset: 1.4, approach: 1.2, press: 0.4, move: 1 };

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

export function Calendar39({
  title,
  days = [],
  events = [],
  moving,
  notice,
  moveLabel,
  movedLabel,
  quietLabel,
  cursorLabel,
  framed = true,
  stepMs = 900,
  className,
}: Calendar39Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const columns = Math.max(days.length, 1);
  const moved = phase === "move" || phase === "rest" || phase === "hide";
  const onButton = phase === "approach" || phase === "press";
  const place = (day: number, start: number, length: number) => ({
    left: `${(day / columns) * 100}%`,
    width: `${100 / columns}%`,
    top: `${start * 100}%`,
    height: `${length * 100}%`,
  });

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
          {title && <p className="text-lg tracking-tight">{title}</p>}

          <div className="mt-4 flex items-center gap-4 rounded-md bg-muted px-3 py-2.5">
            <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{notice}</p>
            <div className="relative grid shrink-0 justify-items-end">
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm text-primary-foreground transition-all duration-300 motion-reduce:transition-none",
                  phase === "press" && "scale-95 bg-primary/85",
                  moved ? "scale-95 opacity-0" : "opacity-100"
                )}
              >
                {moveLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-8 items-center gap-1.5 text-sm text-muted-foreground transition-opacity duration-300 motion-reduce:transition-none",
                  moved ? "opacity-100" : "opacity-0"
                )}
              >
                <Check className="size-4 text-primary" aria-hidden="true" />
                {movedLabel}
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-2.5rem, 4.5rem)" }}
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

          <div className="mt-5 grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {days.map((day, index) => (
              <span key={index} className="pb-2 text-center text-sm text-muted-foreground">
                {day}
              </span>
            ))}
          </div>
          <div className="relative h-48 border-t border-border">
            <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {days.map((_, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className={cn("border-border", index > 0 && "border-l")}
                />
              ))}
            </div>

            {moving && quietLabel && (
              <span
                className={cn(
                  "absolute inset-y-0 flex items-center justify-center text-sm text-muted-foreground transition-opacity duration-700 motion-reduce:transition-none",
                  moved ? "opacity-100" : "opacity-0"
                )}
                style={{ left: `${(moving.day / columns) * 100}%`, width: `${100 / columns}%` }}
              >
                {quietLabel}
              </span>
            )}

            {events.map((event, index) => (
              <div key={index} className="absolute p-1" style={place(event.day, event.start, event.length)}>
                <div className="size-full overflow-hidden rounded-md bg-muted px-2 py-1.5 text-sm leading-tight">
                  <span className="line-clamp-2">{event.title}</span>
                </div>
              </div>
            ))}

            {moving && (
              <div
                className="absolute p-1"
                style={{
                  ...(moved ? place(moving.to, moving.toStart, moving.length) : place(moving.day, moving.start, moving.length)),
                  opacity: phase === "hide" ? 0 : 1,
                  /* Jump back to the quiet day while hidden, then glide over only when moved. */
                  transition: entrance.still
                    ? "none"
                    : phase === "reset"
                      ? "opacity 500ms ease-out"
                      : "left 800ms cubic-bezier(0.16, 1, 0.3, 1), top 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease-out",
                }}
              >
                <div className="size-full overflow-hidden rounded-md bg-primary px-2 py-1.5 text-sm leading-tight text-primary-foreground shadow-sm">
                  <span className="line-clamp-2">{moving.title}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
