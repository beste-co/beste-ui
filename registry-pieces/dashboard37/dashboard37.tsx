"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "fade" | "reset" | "arrive" | "count";

interface Charge {
  merchant: string;
  meta: string;
  amount: number;
}

interface Dashboard37Props {
  card?: { name: string; last4: string };
  spentLabel?: string;
  limitLabel?: string;
  currency?: string;
  limit?: number;
  /** Spent this month before the newest charge lands. */
  spentBefore?: number;
  /** Newest first. The first charge is the one that arrives in the loop. */
  charges?: Charge[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const dashboard37Demo: Dashboard37Props = {
  card: { name: "Design team", last4: "4821" },
  spentLabel: "Spent this month",
  limitLabel: "Limit",
  currency: "$",
  limit: 2000,
  spentBefore: 1180,
  charges: [
    { merchant: "Halcyon Type", meta: "Font license, Bill Withers", amount: 240 },
    { merchant: "Northwind Cloud", meta: "Hosting, Carole King", amount: 86 },
    { merchant: "Lumen Rail", meta: "Train to Lyon, Norah Jones", amount: 132 },
    { merchant: "Acme Paper", meta: "Print proofs, Bill Withers", amount: 58 },
  ],
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "fade", fade: "reset", reset: "arrive", arrive: "count", count: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, fade: 0.5, reset: 0.9, arrive: 1, count: 1.8 };

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

export function Dashboard37({
  card,
  spentLabel,
  limitLabel,
  currency = "$",
  limit = 0,
  spentBefore = 0,
  charges = [],
  framed = true,
  stepMs = 900,
  className,
}: Dashboard37Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const newest = charges[0]?.amount ?? 0;
  const spentAfter = spentBefore + newest;
  const [shownSpent, setShownSpent] = useState(spentAfter);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  /* The total counts up from the old figure while the meter grows, eased so both land together. */
  useEffect(() => {
    if (phase === "fade") {
      setShownSpent(spentBefore);
      return;
    }
    if (phase !== "count") return;
    const duration = stepMs * 1.4;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShownSpent(Math.round(spentBefore + newest * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, spentBefore, newest, stepMs]);

  const money = (value: number) => `${currency}${value.toLocaleString("en-US")}`;
  const arrived = phase !== "reset";
  const counted = phase === "count" || phase === "rest";
  const fill = limit > 0 ? Math.min(((counted ? spentAfter : spentBefore) / limit) * 100, 100) : 0;

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
          <div className="flex items-center gap-5">
            {card && (
              <div className="relative flex h-24 w-40 shrink-0 flex-col justify-between rounded-lg bg-primary p-3 text-primary-foreground shadow-sm">
                <span aria-hidden="true" className="absolute right-3 top-3 h-4 w-6 rounded-sm bg-primary-foreground/25" />
                <span className="truncate pr-8 text-sm">{card.name}</span>
                <span className="text-sm tabular-nums opacity-80">
                  <span aria-hidden="true">•••• </span>
                  {card.last4}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{spentLabel}</p>
              <p className="mt-1 text-3xl tracking-tight tabular-nums">{money(shownSpent)}</p>
              <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                {limitLabel} {money(limit)}
              </p>
            </div>
          </div>

          <div aria-hidden="true" className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-primary transition-[width] ease-out motion-reduce:transition-none"
              style={{ width: `${fill}%`, transitionDuration: counted ? "1300ms" : "400ms" }}
            />
          </div>

          {/* A three row window; the list sits one row up until the newest charge slides in from the top. */}
          <div
            className={cn(
              "mt-5 h-42 overflow-hidden border-t border-border transition-opacity duration-500 motion-reduce:transition-none",
              phase === "fade" ? "opacity-0" : "opacity-100"
            )}
          >
            <ul
              className="ease-out motion-reduce:transition-none"
              style={{
                transform: arrived ? "translateY(0)" : "translateY(-3.5rem)",
                transition: arrived ? "transform 800ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              }}
            >
              {charges.map((charge, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex h-14 items-center justify-between gap-4 border-b border-border transition-opacity duration-700 motion-reduce:transition-none",
                    index === 0 && !arrived ? "opacity-0" : "opacity-100"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-base">{charge.merchant}</p>
                    <p className="truncate text-sm text-muted-foreground">{charge.meta}</p>
                  </div>
                  <span className="shrink-0 text-base tabular-nums">{money(charge.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
