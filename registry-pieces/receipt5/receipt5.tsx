"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ReceiptLine {
  label: string;
  detail: string;
  amount: number;
}

interface Receipt5Props {
  title?: string;
  subtitle?: string;
  lines?: ReceiptLine[];
  currency?: string;
  totalLabel?: string;
  /** Shown once every line has landed. */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const receipt5Demo: Receipt5Props = {
  title: "Lisbon offsite",
  subtitle: "6 travelers, 3 nights",
  lines: [
    { label: "Flights", detail: "Nonstop, row 14", amount: 2472 },
    { label: "Hotel", detail: "Casa Lumen, 6 rooms", amount: 3150 },
    { label: "Train to Sintra", detail: "Return, 6 seats", amount: 96 },
    { label: "Team dinner", detail: "Friday, 7:30 PM", amount: 540 },
  ],
  currency: "$",
  totalLabel: "Trip total",
  note: "Added to the June invoice for Northwind",
  framed: true,
  stepMs: 900,
};

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

/* Step 0 clears the slip, steps 1 to n land one line each, and the last step adds the note and holds. */
export function Receipt5({
  title,
  subtitle,
  lines = [],
  currency = "$",
  totalLabel,
  note,
  framed = true,
  stepMs = 900,
  className,
}: Receipt5Props) {
  const last = lines.length + 1;
  const [step, setStep] = useState(last);
  const target = lines.slice(0, Math.min(step, lines.length)).reduce((sum, line) => sum + line.amount, 0);
  const [shownTotal, setShownTotal] = useState(target);
  const fromRef = useRef(target);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay = step === last ? stepMs * 6 : step === 0 ? stepMs * 1.4 : stepMs;
    const id = setTimeout(() => setStep(step >= last ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, last, stepMs]);

  /* The total eases toward the sum of the lines that have landed so far. */
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const duration = target < from ? 300 : stepMs * 0.7;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.round(from + (target - from) * (1 - (1 - t) ** 3));
      fromRef.current = value;
      setShownTotal(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, stepMs]);

  const done = step === last;

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
          <p className="text-lg tracking-tight">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-4 border-t border-border pt-2">
            {lines.map((line, index) => {
              const shown = index < step;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex h-14 items-center gap-4 transition-all duration-500 ease-out motion-reduce:transition-none",
                    shown ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{line.label}</p>
                    <p className="truncate text-sm text-muted-foreground">{line.detail}</p>
                  </div>
                  <p className="shrink-0 text-base tabular-nums">{format(currency, line.amount)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex items-end justify-between gap-4 border-t border-dashed border-border pt-4">
            <p className="text-sm text-muted-foreground">{totalLabel}</p>
            <p className="text-3xl tracking-tight tabular-nums">{format(currency, shownTotal)}</p>
          </div>

          <p
            className={cn(
              "mt-4 flex items-center gap-2 text-sm text-emerald-700 transition-all duration-500 ease-out dark:text-emerald-400 motion-reduce:transition-none",
              done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            )}
          >
            <Check className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{note}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
