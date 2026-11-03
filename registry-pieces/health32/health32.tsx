"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "chosen";

interface Plan {
  name: string;
  detail: string;
  price: string;
}

interface Health32Props {
  title?: string;
  subtitle?: string;
  plans?: Plan[];
  /** The plan the cursor chooses. */
  chooseIndex?: number;
  pendingLabel?: string;
  activeLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const health32Demo: Health32Props = {
  title: "Health plan for 2027",
  subtitle: "Paid in full by Lumen",
  plans: [
    { name: "Core", detail: "Doctor visits and prescriptions", price: "$0 a month" },
    { name: "Plus", detail: "Core with dental and vision", price: "$0 a month" },
    { name: "Family", detail: "Plus for a partner and children", price: "$24 a month" },
  ],
  chooseIndex: 1,
  pendingLabel: "Choose a plan before Dec 15",
  activeLabel: "Plus starts on Jan 1",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "approach", approach: "press", press: "chosen", chosen: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.4, approach: 1.2, press: 0.4, chosen: 1 };

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

export function Health32({
  title,
  subtitle,
  plans = [],
  chooseIndex = 0,
  pendingLabel,
  activeLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Health32Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const chosen = phase === "chosen" || phase === "rest";
  const onRow = phase === "approach" || phase === "press";

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

          <div className="mt-4 flex flex-col gap-2">
            {plans.map((plan, index) => {
              const isChoice = index === chooseIndex;
              const selected = isChoice && chosen;
              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex h-16 items-center gap-4 rounded-md border px-4 transition-all duration-500 ease-out motion-reduce:transition-none",
                    selected ? "border-primary bg-primary/5" : "border-border",
                    isChoice && phase === "press" && "bg-muted"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                      selected ? "border-primary" : "border-border"
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none",
                        selected ? "scale-100" : "scale-0"
                      )}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{plan.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{plan.detail}</p>
                  </div>
                  <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{plan.price}</p>

                  {isChoice && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-24 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                      style={{ transform: onRow ? "translate(0.5rem, 0.25rem)" : "translate(8rem, 6rem)" }}
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

          <div className="mt-4 border-t border-border pt-4">
            <span className="relative grid w-full">
              <span
                className={cn(
                  "col-start-1 row-start-1 truncate text-sm text-muted-foreground transition-opacity duration-500",
                  chosen ? "opacity-0" : "opacity-100"
                )}
              >
                {pendingLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 flex items-center gap-2 text-sm text-emerald-700 transition-all duration-500 ease-out dark:text-emerald-400 motion-reduce:transition-none",
                  chosen ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              >
                <Check className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{activeLabel}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
