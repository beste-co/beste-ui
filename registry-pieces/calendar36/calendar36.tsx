"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "place" | "note";

interface Block {
  /** Column index in `days`. */
  day: number;
  /** Hours on a 24 hour clock, as in 14 or 14.5. */
  from: number;
  to: number;
}

interface Calendar36Props {
  title?: string;
  days?: { label: string; date: string }[];
  /** First and last hour of the visible day. */
  startHour?: number;
  endHour?: number;
  /** Times that are already taken, by either person. */
  busy?: Block[];
  /** The interview, placed in the one slot both people have free. */
  event?: Block & { title: string; time: string };
  note?: string;
  /** Fixed card height in px, so cards set side by side match; content sits inside it. */
  height?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const calendar36Demo: Calendar36Props = {
  title: "Interview with Joni Mitchell",
  days: [
    { label: "Mon", date: "9" },
    { label: "Tue", date: "10" },
    { label: "Wed", date: "11" },
    { label: "Thu", date: "12" },
    { label: "Fri", date: "13" },
  ],
  startHour: 9,
  endHour: 17,
  busy: [
    { day: 0, from: 9, to: 12 },
    { day: 0, from: 13, to: 17 },
    { day: 1, from: 10, to: 15 },
    { day: 2, from: 9, to: 11 },
    { day: 2, from: 12, to: 17 },
    { day: 3, from: 9, to: 12.5 },
    { day: 3, from: 15.5, to: 17 },
    { day: 4, from: 9, to: 16 },
  ],
  event: { day: 3, from: 13, to: 15, title: "Joni", time: "1:00 PM" },
  note: "Reminder goes out Wednesday evening",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "clear", clear: "place", place: "note", note: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, clear: 1.4, place: 1.2, note: 0.6 };

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

export function Calendar36({
  title,
  days = [],
  startHour = 9,
  endHour = 17,
  busy = [],
  event,
  note,
  height,
  framed = true,
  stepMs = 900,
  className,
}: Calendar36Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    if (entrance.still) return;
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs, entrance.still]);

  const span = Math.max(1, endHour - startHour);
  const place = (block: Block) => ({
    top: `${((block.from - startHour) / span) * 100}%`,
    height: `${((block.to - block.from) / span) * 100}%`,
  });
  const placed = phase !== "clear";
  const noted = phase === "note" || phase === "rest";

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
        <div
          className="flex flex-col rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs"
          style={height ? { height } : undefined}
        >
          {title && <p className="truncate text-base">{title}</p>}

          <div
            className="mt-4 grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-2"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
          >
            {days.map((day, index) => {
              const isEvent = event?.day === index && placed;
              return (
                <div key={index} className="flex items-baseline gap-1.5 px-1">
                  <span className="text-sm text-muted-foreground">{day.label}</span>
                  <span
                    className={cn(
                      "text-sm tabular-nums transition-colors duration-500",
                      isEvent ? "text-primary" : "text-foreground"
                    )}
                  >
                    {day.date}
                  </span>
                </div>
              );
            })}
            {days.map((_, index) => (
              <div key={index} className="relative min-h-36 overflow-hidden rounded-md border border-border bg-background">
                {busy
                  .filter((block) => block.day === index)
                  .map((block, blockIndex) => (
                    <span
                      key={blockIndex}
                      aria-hidden="true"
                      className="absolute inset-x-1 rounded-sm bg-muted"
                      style={place(block)}
                    />
                  ))}
                {event?.day === index && (
                  <div
                    className={cn(
                      "absolute inset-x-1 flex origin-top flex-col justify-center overflow-hidden rounded-sm bg-primary px-1.5 text-primary-foreground transition-all duration-700 ease-out motion-reduce:transition-none",
                      placed ? "scale-y-100 opacity-100" : "scale-y-50 opacity-0"
                    )}
                    style={place(event)}
                  >
                    <p className="truncate text-sm">{event.title}</p>
                    <p className="truncate text-sm tabular-nums opacity-80">{event.time}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {note && (
            <p
              className={cn(
                "pt-4 text-sm text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                noted ? "opacity-100" : "opacity-0"
              )}
            >
              {note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
