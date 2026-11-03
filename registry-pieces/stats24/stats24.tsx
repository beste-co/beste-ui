"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Spend {
  label: string;
  amount: number;
}

interface Stats24Props {
  label?: string;
  budget?: number;
  currency?: string;
  /** Shown after the remaining figure, as in "left of $1,200". */
  leftLabel?: string;
  spends?: Spend[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const stats24Demo: Stats24Props = {
  label: "Wellbeing budget",
  budget: 1200,
  currency: "$",
  leftLabel: "left of $1,200 this year",
  spends: [
    { label: "Climbing gym", amount: 360 },
    { label: "Therapy sessions", amount: 240 },
    { label: "Running shoes", amount: 140 },
  ],
  framed: true,
  stepMs: 1000,
};

const TONES = ["bg-primary", "bg-primary/60", "bg-primary/30"];

const format = (currency: string, value: number) => `${currency}${value.toLocaleString("en-US")}`;

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

/* Step 0 refills the budget, then each step spends one item; the last step holds. */
export function Stats24({
  label,
  budget = 0,
  currency = "$",
  leftLabel,
  spends = [],
  framed = true,
  stepMs = 1000,
  className,
}: Stats24Props) {
  const last = spends.length;
  const [step, setStep] = useState(last);
  const spent = spends.slice(0, step).reduce((sum, spend) => sum + spend.amount, 0);
  const target = Math.max(budget - spent, 0);
  const [shownLeft, setShownLeft] = useState(target);
  const fromRef = useRef(target);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay = step === last ? stepMs * 5 : step === 0 ? stepMs * 1.4 : stepMs * 1.2;
    const id = setTimeout(() => setStep(step >= last ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, last, stepMs]);

  /* The remaining figure eases down with each spend and back up when the budget refills. */
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const duration = stepMs * 0.8;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.round(from + (target - from) * (1 - (1 - t) ** 3));
      fromRef.current = value;
      setShownLeft(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, stepMs]);

  const total = Math.max(budget, 1);

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
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-baseline gap-3">
            <p className="text-5xl tracking-tight tabular-nums">{format(currency, shownLeft)}</p>
            <p className="text-sm text-muted-foreground">{leftLabel}</p>
          </div>

          <div className="mt-6 flex h-2.5 gap-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            {spends.map((spend, index) => (
              <span
                key={index}
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out motion-reduce:transition-none",
                  TONES[index % TONES.length]
                )}
                style={{ width: index < step ? `${(spend.amount / total) * 100}%` : "0%" }}
              />
            ))}
          </div>

          <div className="mt-5 border-t border-border pt-2">
            {spends.map((spend, index) => {
              const shown = index < step;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex h-11 items-center gap-3 transition-all duration-500 ease-out motion-reduce:transition-none",
                    shown ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-2 shrink-0 rounded-full", TONES[index % TONES.length])}
                  />
                  <p className="min-w-0 flex-1 truncate text-base">{spend.label}</p>
                  <p className="shrink-0 text-base tabular-nums text-muted-foreground">
                    {format(currency, spend.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
