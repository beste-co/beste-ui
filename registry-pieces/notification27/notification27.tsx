"use client";

import { Check, Mail } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "leave" | "empty" | "arrive" | "confirm";

interface Notification27Props {
  appName?: string;
  time?: string;
  title?: string;
  body?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const notification27Demo: Notification27Props = {
  appName: "Halcyon",
  time: "now",
  title: "Welcome, your seat is saved",
  body: "Your invite will reach hello@beste.co the moment a place opens. Most teams are in within a week.",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = { rest: "leave", leave: "empty", empty: "arrive", arrive: "confirm", confirm: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, leave: 0.9, empty: 1.2, arrive: 1.4, confirm: 0.6 };

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

export function Notification27({
  appName,
  time,
  title,
  body,
  framed = true,
  stepMs = 800,
  className,
}: Notification27Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const present = phase === "arrive" || phase === "confirm" || phase === "rest";
  const confirmed = phase === "confirm" || phase === "rest";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className="w-md shrink-0"
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
        {/* The toast drops in from above, rests, then lifts away before the next one arrives. */}
        <div
          className={cn(
            "transition-all ease-out motion-reduce:transition-none",
            present ? "translate-y-0 scale-100 opacity-100 blur-none" : "-translate-y-6 scale-95 opacity-0 blur-sm",
            phase === "leave" ? "duration-700" : "duration-1000",
            framed && "rounded-2xl border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
          )}
        >
          <div className="flex items-start gap-4 rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
            <span className="relative shrink-0">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -right-1.5 -bottom-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-card transition-all duration-500 ease-out motion-reduce:transition-none",
                  confirmed ? "scale-100 opacity-100" : "scale-50 opacity-0"
                )}
              >
                <Check className="size-3" />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span className="truncate">{appName}</span>
                <span className="shrink-0">{time}</span>
              </div>
              <p className="mt-0.5 text-lg tracking-tight">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
