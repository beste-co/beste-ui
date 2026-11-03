"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "hide" | "back" | "approach" | "grab" | "carry" | "drop";

interface Column {
  label: string;
  total: string;
  /** The total once the moving deal has landed, when it changes. */
  totalAfter?: string;
}

interface Deal {
  name: string;
  value: string;
  /** Index of the column the deal sits in. */
  column: number;
}

interface Dashboard40Props {
  columns?: Column[];
  deals?: Deal[];
  /** The deal the cursor carries from one column to the next. */
  moving?: { name: string; value: string };
  fromColumn?: number;
  toColumn?: number;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const dashboard40Demo: Dashboard40Props = {
  columns: [
    { label: "Lead", total: "$9,800" },
    { label: "Proposal", total: "$24,600", totalAfter: "$12,200" },
    { label: "Won", total: "$18,000", totalAfter: "$30,400" },
  ],
  deals: [
    { name: "Lumen Studio", value: "$4,200", column: 0 },
    { name: "Acme Health", value: "$5,600", column: 0 },
    { name: "Halcyon Labs", value: "$12,200", column: 1 },
    { name: "Northwind", value: "$18,000", column: 2 },
  ],
  moving: { name: "Juniper & Co", value: "$12,400" },
  fromColumn: 1,
  toColumn: 2,
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "hide",
  hide: "back",
  back: "approach",
  approach: "grab",
  grab: "carry",
  carry: "drop",
  drop: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, hide: 0.9, back: 1, approach: 1.2, grab: 0.5, carry: 1.4, drop: 0.6 };

/* Cards are a fixed 4rem plus a 0.5rem gap, so the slot that opens for the moving deal matches it exactly. */
const SLOT = { height: "4rem", gap: "0.5rem" };

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

export function Dashboard40({
  columns = [],
  deals = [],
  moving,
  fromColumn = 0,
  toColumn = 1,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Dashboard40Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const count = Math.max(columns.length, 1);
  const atStart = phase === "back" || phase === "approach" || phase === "grab";
  const column = atStart ? fromColumn : toColumn;
  const held = phase === "grab" || phase === "carry";
  const onCard = phase === "approach" || held || phase === "drop";
  const landed = phase === "drop" || phase === "rest" || phase === "hide";

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
        <div className="rounded-lg bg-card px-5 py-5 text-card-foreground shadow-xs">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
            {columns.map((col, index) => (
              <div key={index} className="flex min-w-0 items-baseline justify-between gap-2 px-1">
                <p className="truncate text-sm text-muted-foreground">{col.label}</p>
                <p className="relative grid shrink-0 justify-items-end text-sm tabular-nums">
                  <span
                    className={cn(
                      "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none",
                      col.totalAfter && landed ? "opacity-0" : "opacity-100"
                    )}
                  >
                    {col.total}
                  </span>
                  {col.totalAfter && (
                    <span
                      className={cn(
                        "col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none",
                        landed ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {col.totalAfter}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mt-3">
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
              {columns.map((_, index) => {
                const open = moving && index === column && (index === fromColumn || index === toColumn);
                return (
                  <div key={index} className="h-44 overflow-hidden rounded-md bg-muted p-2">
                    <div
                      aria-hidden="true"
                      className="transition-all duration-700 ease-out motion-reduce:transition-none"
                      style={{ height: open ? SLOT.height : "0rem", marginBottom: open ? SLOT.gap : "0rem" }}
                    />
                    {deals
                      .filter((deal) => deal.column === index)
                      .map((deal, dealIndex) => (
                        <div
                          key={dealIndex}
                          className="flex h-16 flex-col justify-center rounded-md border border-border bg-card px-3"
                          style={{ marginBottom: SLOT.gap }}
                        >
                          <p className="truncate text-sm">{deal.name}</p>
                          <p className="truncate text-sm tabular-nums text-muted-foreground">{deal.value}</p>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>

            {/* The moving deal rides above the columns; it jumps back to its start only while hidden. */}
            {moving && (
              <div
                className="pointer-events-none absolute left-0 top-0 p-2 ease-in-out motion-reduce:transition-none"
                style={{
                  width: `calc((100% - ${(count - 1) * 0.75}rem) / ${count})`,
                  transform: `translateX(calc(${column} * (100% + 0.75rem)))`,
                  transitionProperty: "transform",
                  transitionDuration: phase === "back" ? "0ms" : "1100ms",
                }}
              >
                <div
                  className={cn(
                    "flex h-16 flex-col justify-center rounded-md border bg-card px-3 transition-all duration-300 ease-out motion-reduce:transition-none",
                    phase === "hide" ? "opacity-0" : "opacity-100",
                    held ? "-translate-y-0.5 scale-105 border-primary/40 shadow-lg" : "border-border shadow-none"
                  )}
                >
                  <p className="truncate text-sm">{moving.name}</p>
                  <p className="truncate text-sm tabular-nums text-muted-foreground">{moving.value}</p>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-all duration-700 ease-out motion-reduce:transition-none"
                  style={{
                    transform: onCard ? "translate(0.5rem, 0.25rem)" : "translate(-2.5rem, 3.25rem)",
                    opacity: phase === "hide" || phase === "back" ? 0 : 1,
                    transitionDuration: phase === "back" ? "0ms" : undefined,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className={cn(
                      "size-7 fill-foreground stroke-background transition-transform duration-150",
                      held && "scale-90"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
