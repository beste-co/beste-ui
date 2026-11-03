"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "cancel" | "fill";

interface Booking {
  time: string;
  name: string;
  service: string;
}

interface Dashboard38Props {
  title?: string;
  date?: string;
  bookings?: Booking[];
  /** The booking that cancels and is taken by the waitlist. */
  swapIndex?: number;
  waitlist?: { name: string; service: string };
  cancelledLabel?: string;
  filledLabel?: string;
  openLabel?: string;
  fullLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const dashboard38Demo: Dashboard38Props = {
  title: "Today at the studio",
  date: "Thursday, May 14",
  bookings: [
    { time: "9:00 AM", name: "Ray Charles", service: "Cut and finish" },
    { time: "10:30 AM", name: "Otis Redding", service: "Beard trim" },
    { time: "12:00 PM", name: "Bill Withers", service: "Color refresh" },
    { time: "2:00 PM", name: "Patti Smith", service: "Cut and finish" },
  ],
  swapIndex: 2,
  waitlist: { name: "Sade Adu", service: "Color refresh" },
  cancelledLabel: "Cancelled",
  filledLabel: "From waitlist",
  openLabel: "1 slot open",
  fullLabel: "Fully booked",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "cancel", cancel: "fill", fill: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.2, cancel: 1.8, fill: 0.8 };

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

export function Dashboard38({
  title,
  date,
  bookings = [],
  swapIndex = 0,
  waitlist,
  cancelledLabel,
  filledLabel,
  openLabel,
  fullLabel,
  framed = true,
  stepMs = 900,
  className,
}: Dashboard38Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const cancelled = phase === "cancel";
  const filled = phase === "fill" || phase === "rest";

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
              <p className="truncate text-lg tracking-tight">{title}</p>
              <p className="truncate text-sm text-muted-foreground">{date}</p>
            </div>
            <span className="grid shrink-0 justify-items-end text-sm">
              <span
                className={cn(
                  "col-start-1 row-start-1 rounded-md bg-muted px-2 py-0.5 transition-opacity duration-300 motion-reduce:transition-none",
                  cancelled ? "opacity-0" : "opacity-100"
                )}
              >
                {fullLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-amber-700 transition-opacity duration-300 motion-reduce:transition-none dark:text-amber-400",
                  cancelled ? "opacity-100" : "opacity-0"
                )}
              >
                {openLabel}
              </span>
            </span>
          </div>

          <ul className="mt-4">
            {bookings.map((booking, index) => {
              const swap = index === swapIndex ? waitlist : undefined;
              return (
                <li key={index} className="flex items-center gap-4 border-t border-border py-3">
                  <span className="w-20 shrink-0 text-sm tabular-nums text-muted-foreground">{booking.time}</span>
                  {swap ? (
                    <>
                      <span className="grid min-w-0 flex-1">
                        <span
                          className={cn(
                            "col-start-1 row-start-1 min-w-0 transition-all duration-500 ease-out motion-reduce:transition-none",
                            filled ? "-translate-y-1 opacity-0" : "translate-y-0 opacity-100",
                            cancelled && "text-muted-foreground line-through"
                          )}
                        >
                          <span className="block truncate text-base">{booking.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">{booking.service}</span>
                        </span>
                        <span
                          className={cn(
                            "col-start-1 row-start-1 min-w-0 transition-all duration-500 ease-out motion-reduce:transition-none",
                            filled ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                          )}
                        >
                          <span className="block truncate text-base">{swap.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">{swap.service}</span>
                        </span>
                      </span>
                      <span className="grid shrink-0 justify-items-end text-sm">
                        <span
                          className={cn(
                            "col-start-1 row-start-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-rose-700 transition-opacity duration-300 motion-reduce:transition-none dark:text-rose-400",
                            cancelled ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {cancelledLabel}
                        </span>
                        <span
                          className={cn(
                            "col-start-1 row-start-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-700 transition-opacity duration-500 motion-reduce:transition-none dark:text-emerald-400",
                            filled ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {filledLabel}
                        </span>
                      </span>
                    </>
                  ) : (
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base">{booking.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{booking.service}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
