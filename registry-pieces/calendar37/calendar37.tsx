"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press";

interface Slot {
  time: string;
  /** Taken slots stay visible but cannot be picked. */
  open?: boolean;
}

interface Calendar37Props {
  provider?: { name: string; role: string; avatar: { src: string; alt: string } };
  dayLabel?: string;
  slots?: Slot[];
  /** The open slot the cursor picks. */
  pickIndex?: number;
  promptLabel?: string;
  bookedLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const calendar37Demo: Calendar37Props = {
  provider: {
    name: "Ella Fitzgerald",
    role: "Physiotherapist at Halcyon Clinic",
    avatar: {
      src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with short hair under a blue sky",
    },
  },
  dayLabel: "Thursday, March 12",
  slots: [
    { time: "9:00 AM", open: false },
    { time: "9:30 AM", open: true },
    { time: "11:00 AM", open: true },
    { time: "1:30 PM", open: false },
    { time: "3:00 PM", open: true },
    { time: "4:30 PM", open: true },
  ],
  pickIndex: 2,
  promptLabel: "Pick a time that suits you",
  bookedLabel: "Booked for 11:00 AM, reminder on Wednesday",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "approach", approach: "press", press: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, reset: 1.2, approach: 1.4, press: 0.4 };

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

export function Calendar37({
  provider,
  dayLabel,
  slots = [],
  pickIndex = 0,
  promptLabel,
  bookedLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Calendar37Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const booked = phase === "rest";
  const onSlot = phase === "approach" || phase === "press";

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
          {provider && (
            <div className="flex items-center gap-3">
              <img
                src={provider.avatar.src}
                alt={provider.avatar.alt}
                className="size-10 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-lg tracking-tight">{provider.name}</p>
                <p className="truncate text-sm text-muted-foreground">{provider.role}</p>
              </div>
            </div>
          )}

          <p className="mt-5 border-t border-border pt-4 text-base">{dayLabel}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {slots.map((slot, index) => {
              const open = slot.open !== false;
              const isPick = index === pickIndex;
              const picked = isPick && booked;
              return (
                <div key={index} className="relative">
                  <span
                    className={cn(
                      "flex h-10 items-center justify-center rounded-md border text-sm tabular-nums transition-all duration-300 motion-reduce:transition-none",
                      !open && "border-transparent bg-muted text-muted-foreground line-through",
                      open && !picked && "border-border bg-card",
                      picked && "border-primary bg-primary text-primary-foreground",
                      isPick && phase === "press" && "scale-95 bg-muted"
                    )}
                  >
                    {slot.time}
                  </span>
                  {isPick && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                      style={{ transform: onSlot ? "translate(0.5rem, 0.25rem)" : "translate(-2.5rem, 3.25rem)" }}
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
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative mt-5 grid h-11 items-end border-t border-border text-sm">
            <span
              className={cn(
                "col-start-1 row-start-1 text-muted-foreground transition-opacity duration-300",
                booked ? "opacity-0" : "opacity-100"
              )}
            >
              {promptLabel}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 inline-flex items-center gap-2 text-emerald-700 transition-all duration-500 ease-out dark:text-emerald-400 motion-reduce:transition-none",
                booked ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
            >
              <Check className="size-4 shrink-0" aria-hidden="true" />
              {bookedLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
