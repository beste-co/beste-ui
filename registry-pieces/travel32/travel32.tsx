"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "pick" | "approach" | "press" | "booked";

interface Flight {
  times: string;
  detail: string;
  price: string;
}

interface Travel32Props {
  trip?: string;
  dates?: string;
  flights?: Flight[];
  /** The fare that fits the travel policy. It gets picked and booked. */
  pickIndex?: number;
  policyLabel?: string;
  bookLabel?: string;
  bookedLabel?: string;
  confirmation?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const travel32Demo: Travel32Props = {
  trip: "Team offsite in Lisbon",
  dates: "Jun 12 to Jun 15, 6 travelers",
  flights: [
    { times: "6:40 AM to 10:15 AM", detail: "1 stop in Madrid", price: "$388" },
    { times: "8:05 AM to 11:40 AM", detail: "Nonstop", price: "$412" },
    { times: "12:30 PM to 4:05 PM", detail: "Nonstop, flexible fare", price: "$694" },
  ],
  pickIndex: 1,
  policyLabel: "Best nonstop fare under the $600 limit",
  bookLabel: "Book",
  bookedLabel: "Booked",
  confirmation: "6 seats held together in row 14",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "pick",
  pick: "approach",
  approach: "press",
  press: "booked",
  booked: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4, reset: 1.2, pick: 1.4, approach: 1.2, press: 0.4, booked: 1 };

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

export function Travel32({
  trip,
  dates,
  flights = [],
  pickIndex = 0,
  policyLabel,
  bookLabel,
  bookedLabel,
  confirmation,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Travel32Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const picked = phase !== "reset";
  const booked = phase === "booked" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";

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
          <p className="text-lg tracking-tight">{trip}</p>
          <p className="text-sm text-muted-foreground">{dates}</p>

          <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
            {flights.map((flight, index) => {
              const isPick = index === pickIndex;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex h-14 items-center gap-4 rounded-md px-3 transition-all duration-500 ease-out motion-reduce:transition-none",
                    picked && isPick ? "bg-primary/10" : "bg-transparent",
                    picked && !isPick ? "opacity-40" : "opacity-100"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-full transition-colors duration-500",
                      picked && isPick ? "bg-primary" : "bg-muted"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base tabular-nums">{flight.times}</p>
                    <p className="truncate text-sm text-muted-foreground">{flight.detail}</p>
                  </div>
                  <p className="shrink-0 text-base tabular-nums">{flight.price}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
            <span className="relative grid min-w-0 flex-1">
              <span
                className={cn(
                  "col-start-1 row-start-1 truncate text-sm text-muted-foreground transition-opacity duration-500",
                  picked && !booked ? "opacity-100" : "opacity-0"
                )}
              >
                {policyLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 truncate text-sm text-foreground transition-opacity duration-500",
                  booked ? "opacity-100" : "opacity-0"
                )}
              >
                {confirmation}
              </span>
            </span>
            <div className="relative shrink-0">
              <span className="grid">
                <span
                  className={cn(
                    "col-start-1 row-start-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm text-primary-foreground transition-all duration-300",
                    booked ? "opacity-0" : picked ? "opacity-100" : "opacity-40",
                    phase === "press" && "scale-95 bg-primary/85"
                  )}
                >
                  {bookLabel}
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-emerald-500/10 px-4 text-sm text-emerald-700 transition-all duration-500 ease-out dark:text-emerald-400 motion-reduce:transition-none",
                    booked ? "scale-100 opacity-100" : "scale-90 opacity-0"
                  )}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  {bookedLabel}
                </span>
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-6rem, -4.5rem)" }}
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
        </div>
      </div>
    </div>
  );
}
