"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "picked";

interface Calendar38Props {
  host?: { name: string; role: string; avatar: { src: string; alt: string } };
  title?: string;
  duration?: string;
  day?: string;
  slots?: string[];
  /** Index of the slot the cursor clicks. */
  pickIndex?: number;
  bookedLabel?: string;
  bookedNote?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const calendar38Demo: Calendar38Props = {
  host: {
    name: "Nick Drake",
    role: "Migration lead",
    avatar: {
      src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Smiling man in a floral shirt",
    },
  },
  title: "Plan your move with Nick",
  duration: "30 min video call",
  day: "Thursday, November 6",
  slots: ["10:00 AM", "1:30 PM", "4:00 PM"],
  pickIndex: 1,
  bookedLabel: "Booked for Thursday at 1:30 PM",
  bookedNote: "The invite is on its way to hello@beste.co",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "approach",
  approach: "press",
  press: "picked",
  picked: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.4, approach: 1.2, press: 0.4, picked: 1 };

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

export function Calendar38({
  host,
  title,
  duration,
  day,
  slots = [],
  pickIndex = 0,
  bookedLabel,
  bookedNote,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Calendar38Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const booked = phase === "rest";
  const onSlot = phase === "approach" || phase === "press" || phase === "picked";
  const selected = phase === "press" || phase === "picked" || phase === "rest";
  const cursorShown = phase !== "rest";

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
          <div className="flex items-center gap-3">
            {host && (
              <img src={host.avatar.src} alt={host.avatar.alt} className="size-10 shrink-0 rounded-md object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate text-lg tracking-tight">{title}</p>
              <p className="truncate text-sm text-muted-foreground">
                {host ? `${host.name}, ${host.role}` : null}
                {host && duration ? " · " : null}
                {duration}
              </p>
            </div>
          </div>

          {/* Slot picker and confirmation share one cell, so the card never changes height. */}
          <div className="mt-5 grid border-t border-border pt-5">
            <div
              aria-hidden={booked}
              className={cn(
                "col-start-1 row-start-1 transition-all duration-500 ease-out motion-reduce:transition-none",
                booked ? "pointer-events-none -translate-y-1 opacity-0" : "translate-y-0 opacity-100"
              )}
            >
              <p className="text-sm text-muted-foreground">{day}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {slots.map((slot, index) => {
                  const isPick = index === pickIndex;
                  return (
                    <div key={index} className="relative">
                      <span
                        className={cn(
                          "flex h-10 items-center justify-center rounded-md border text-sm tabular-nums transition-all duration-300 motion-reduce:transition-none",
                          isPick && selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground",
                          isPick && phase === "press" && "scale-95"
                        )}
                      >
                        {slot}
                      </span>
                      {isPick && (
                        <div
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute left-1/2 top-1/2 z-10 transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none",
                            cursorShown ? "opacity-100" : "opacity-0"
                          )}
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
            </div>

            <div
              aria-hidden={!booked}
              className={cn(
                "col-start-1 row-start-1 flex items-center gap-3 transition-all duration-700 ease-out motion-reduce:transition-none",
                booked ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
              )}
            >
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              >
                <Check className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-base">{bookedLabel}</p>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{bookedNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
