"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "viewed" | "paid";

interface InvoiceStage {
  label: string;
  time: string;
}

interface Card35Props {
  client?: string;
  number?: string;
  amount?: string;
  /** Three stages in order: sent, viewed, paid. */
  stages?: InvoiceStage[];
  waitingLabel?: string;
  paidLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const card35Demo: Card35Props = {
  client: "Northwind Studio",
  number: "Invoice 0142",
  amount: "$4,800.00",
  stages: [
    { label: "Sent", time: "Mon 6:12 PM" },
    { label: "Viewed", time: "Tue 9:40 AM" },
    { label: "Paid", time: "Thu 2:05 PM" },
  ],
  waitingLabel: "Waiting on payment",
  paidLabel: "Paid and recorded",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "viewed", viewed: "paid", paid: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.6, viewed: 1.8, paid: 0.8 };
const REACHED: Record<Phase, number> = { rest: 3, reset: 1, viewed: 2, paid: 3 };

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

export function Card35({
  client,
  number,
  amount,
  stages = [],
  waitingLabel,
  paidLabel,
  framed = true,
  stepMs = 900,
  className,
}: Card35Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const reached = REACHED[phase];
  const paid = reached >= 3;
  const span = Math.max(stages.length - 1, 1);

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
          <div className="flex items-baseline justify-between gap-4">
            <p className="truncate text-lg tracking-tight">{client}</p>
            <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{number}</p>
          </div>
          <p className="mt-3 text-5xl tracking-tight tabular-nums">{amount}</p>

          <div className="relative mt-8">
            {/* The line fills toward each stage as it is reached. */}
            <div className="absolute inset-x-2.5 top-2.5 h-px bg-border" aria-hidden="true">
              <div
                className="h-full origin-left bg-primary transition-transform duration-1000 ease-out motion-reduce:transition-none"
                style={{ transform: `scaleX(${Math.max(reached - 1, 0) / span})` }}
              />
            </div>
            <ol className="relative flex justify-between">
              {stages.map((stage, index) => {
                const isReached = index < reached;
                const align = index === 0 ? "items-start text-left" : index === stages.length - 1 ? "items-end text-right" : "items-center text-center";
                return (
                  <li key={index} className={cn("flex flex-1 flex-col", align)}>
                    <span className="relative grid size-5 place-items-center" aria-hidden="true">
                      <span className="col-start-1 row-start-1 size-5 rounded-full border border-border bg-card" />
                      <span
                        className={cn(
                          "col-start-1 row-start-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
                          isReached ? "scale-100 opacity-100 delay-500" : "scale-50 opacity-0"
                        )}
                      >
                        <Check className="size-3" />
                      </span>
                    </span>
                    <span className={cn("mt-3 text-sm transition-colors duration-500", isReached ? "text-foreground" : "text-muted-foreground")}>
                      {stage.label}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 text-sm tabular-nums text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                        isReached ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {stage.time}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-6 grid border-t border-border pt-4 text-sm">
            <p
              className={cn(
                "col-start-1 row-start-1 flex items-center gap-2 text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                paid ? "opacity-0 delay-700" : "opacity-100"
              )}
            >
              <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
              {waitingLabel}
            </p>
            <p
              className={cn(
                "col-start-1 row-start-1 flex items-center gap-2 transition-all duration-500 ease-out motion-reduce:transition-none",
                paid ? "translate-y-0 opacity-100 delay-700" : "translate-y-1 opacity-0"
              )}
            >
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {paidLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
