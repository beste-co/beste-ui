"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "sent" | "opened";

interface InvoiceStep {
  label: string;
  time: string;
}

interface Money30Props {
  client?: string;
  number?: string;
  amount?: string;
  due?: string;
  sendLabel?: string;
  sentLabel?: string;
  /** Sent, opened and paid, lit one after another once Send is pressed. */
  steps?: InvoiceStep[];
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const money30Demo: Money30Props = {
  client: "Lumen Studio",
  number: "Invoice 2048",
  amount: "$3,600.00",
  due: "Due April 30",
  sendLabel: "Send",
  sentLabel: "Sent",
  steps: [
    { label: "Sent", time: "9:41 AM" },
    { label: "Opened", time: "10:05 AM" },
    { label: "Paid", time: "2:12 PM" },
  ],
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "approach",
  approach: "press",
  press: "sent",
  sent: "opened",
  opened: "rest",
};
const HOLD: Record<Phase, number> = { rest: 5, reset: 1.2, approach: 1.2, press: 0.4, sent: 1.2, opened: 1.4 };
const LIT: Record<Phase, number> = { rest: 3, reset: 0, approach: 0, press: 0, sent: 1, opened: 2 };

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

export function Money30({
  client,
  number,
  amount,
  due,
  sendLabel,
  sentLabel,
  steps = [],
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Money30Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const draft = phase === "reset" || phase === "approach" || phase === "press";
  const onButton = phase === "approach" || phase === "press";
  const lit = LIT[phase];
  const last = steps.length - 1;

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "w-lg shrink-0",
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
        <div className="rounded-lg bg-card px-6 py-6 text-card-foreground shadow-xs">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg tracking-tight">{client}</p>
              <p className="truncate text-sm text-muted-foreground">{number}</p>
            </div>
            <div className="relative grid shrink-0 justify-items-end">
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm text-primary-foreground transition-all duration-300 motion-reduce:transition-none",
                  draft ? "opacity-100" : "pointer-events-none scale-95 opacity-0",
                  phase === "press" && "scale-95 bg-primary/85"
                )}
              >
                {sendLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex h-9 items-center gap-1.5 rounded-md bg-muted px-4 text-sm text-muted-foreground transition-opacity duration-300",
                  draft ? "opacity-0" : "opacity-100"
                )}
              >
                <Check className="size-3.5" aria-hidden="true" />
                {sentLabel}
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.5rem, 0.25rem)" : "translate(-2.5rem, 3.25rem)" }}
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

          <p className="mt-8 text-5xl tracking-tight tabular-nums">{amount}</p>
          <p className="mt-2 text-sm text-muted-foreground">{due}</p>

          {steps.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-3">
              {steps.map((item, index) => {
                const on = index < lit;
                const paid = index === last;
                /* Filling follows the phases; emptying runs right to left, one step at a time. */
                const off = on ? undefined : { transitionDelay: `${(last - index) * 150}ms`, transitionDuration: "500ms" };
                return (
                  <div key={index}>
                    <span aria-hidden="true" className="block h-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn(
                          "block h-full origin-left rounded-full transition-transform duration-700 ease-out motion-reduce:transition-none",
                          paid ? "bg-emerald-500" : "bg-primary"
                        )}
                        style={{ transform: `scaleX(${on ? 1 : 0})`, ...off }}
                      />
                    </span>
                    <div
                      className={cn(
                        "mt-3 transition-all delay-200 duration-500 ease-out motion-reduce:transition-none",
                        on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-40"
                      )}
                      style={off}
                    >
                      <p className={cn("text-base", paid && on && "text-emerald-700 dark:text-emerald-400")}>{item.label}</p>
                      <p className="text-sm tabular-nums text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
