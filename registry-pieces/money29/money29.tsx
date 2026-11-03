"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Invoice {
  label: string;
  detail: string;
  amount: string;
}

interface Money29Props {
  paymentLabel?: string;
  paymentAmount?: string;
  listLabel?: string;
  invoices?: Invoice[];
  /** The invoice the payment settles. The scan lands on it. */
  matchIndex?: number;
  openLabel?: string;
  paidLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const money29Demo: Money29Props = {
  paymentLabel: "Transfer from Northwind Ltd",
  paymentAmount: "$4,820.00",
  listLabel: "Open invoices",
  invoices: [
    { label: "Invoice 1039", detail: "Lumen Studio", amount: "$1,200.00" },
    { label: "Invoice 1042", detail: "Northwind", amount: "$4,820.00" },
    { label: "Invoice 1045", detail: "Acme", amount: "$960.00" },
  ],
  matchIndex: 1,
  openLabel: "Open",
  paidLabel: "Paid",
  framed: true,
  stepMs: 700,
};

/* Rows are a fixed 3.5rem so the scan highlight can slide by index. */
const ROW_REM = 3.5;

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

/* Step 0 resets, steps 1 to matchIndex + 1 walk the highlight down the list,
   then one step where the match is found and a last step where it is paid and held. */
export function Money29({
  paymentLabel,
  paymentAmount,
  listLabel,
  invoices = [],
  matchIndex = 0,
  openLabel,
  paidLabel,
  framed = true,
  stepMs = 700,
  className,
}: Money29Props) {
  const found = matchIndex + 2;
  const last = matchIndex + 3;
  const [step, setStep] = useState(last);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const delay = step === last ? stepMs * 6 : step === 0 ? stepMs * 1.4 : stepMs;
    const id = setTimeout(() => setStep(step >= last ? 0 : step + 1), delay);
    return () => clearTimeout(id);
  }, [step, last, stepMs]);

  const scanning = step >= 1 && step < found;
  const isFound = step >= found;
  const isPaid = step === last;
  const at = isFound ? matchIndex : Math.max(step - 1, 0);

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
          <p className="text-sm text-muted-foreground">{paymentLabel}</p>
          <p className="mt-1 text-3xl tracking-tight tabular-nums">{paymentAmount}</p>

          <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">{listLabel}</p>

          <div className="relative mt-2">
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 top-0 h-14 rounded-md transition-all duration-500 ease-out motion-reduce:transition-none",
                scanning || isFound ? "opacity-100" : "opacity-0",
                isFound ? "bg-primary/10" : "bg-muted"
              )}
              style={{ transform: `translateY(${at * ROW_REM}rem)` }}
            />
            {invoices.map((invoice, index) => {
              const isMatch = index === matchIndex;
              const paid = isMatch && isPaid;
              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex h-14 items-center gap-4 px-3 transition-opacity duration-500 motion-reduce:transition-none",
                    isFound && !isMatch ? "opacity-40" : "opacity-100"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{invoice.label}</p>
                    <p className="truncate text-sm text-muted-foreground">{invoice.detail}</p>
                  </div>
                  <p className="shrink-0 text-base tabular-nums">{invoice.amount}</p>
                  <span className="relative grid w-16 shrink-0 justify-items-end">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 rounded-md bg-muted px-2 py-0.5 text-sm text-muted-foreground transition-opacity duration-300",
                        paid ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {openLabel}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-sm text-emerald-700 transition-all duration-500 ease-out dark:text-emerald-400 motion-reduce:transition-none",
                        paid ? "scale-100 opacity-100" : "scale-90 opacity-0"
                      )}
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      {paidLabel}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
