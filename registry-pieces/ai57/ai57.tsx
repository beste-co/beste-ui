"use client";

import { Check, CircleAlert } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "flag" | "fix";

interface Ai57Props {
  title?: string;
  updatedBefore?: string;
  updatedAfter?: string;
  /** The paragraph is split around the one phrase that goes out of date. */
  textBefore?: string;
  oldPhrase?: string;
  newPhrase?: string;
  textAfter?: string;
  flagLabel?: string;
  fixedLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const ai57Demo: Ai57Props = {
  title: "Expense policy",
  updatedBefore: "Updated 14 months ago",
  updatedAfter: "Updated just now",
  textBefore: "Submit receipts in the finance app",
  oldPhrase: "within 14 days",
  newPhrase: "within 30 days",
  textAfter: "of the purchase. Your manager approves anything over $500.",
  flagLabel: "Out of date since the October policy change",
  fixedLabel: "Updated to match the October policy",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "flag", flag: "fix", fix: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, reset: 1, flag: 2, fix: 1.2 };

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

export function Ai57({
  title,
  updatedBefore,
  updatedAfter,
  textBefore,
  oldPhrase,
  newPhrase,
  textAfter,
  flagLabel,
  fixedLabel,
  framed = true,
  stepMs = 800,
  className,
}: Ai57Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const flagged = phase === "flag";
  const fixed = phase === "fix" || phase === "rest";

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
          <p className="relative mt-0.5 grid text-sm text-muted-foreground">
            <span className={cn("col-start-1 row-start-1 transition-opacity duration-500", fixed ? "opacity-0" : "opacity-100")}>
              {updatedBefore}
            </span>
            <span className={cn("col-start-1 row-start-1 transition-opacity duration-500", fixed ? "opacity-100" : "opacity-0")}>
              {updatedAfter}
            </span>
          </p>

          <p className="mt-5 border-t border-border pt-4 text-base leading-relaxed">
            {textBefore}{" "}
            <span className="relative inline-grid">
              <span
                className={cn(
                  "col-start-1 row-start-1 whitespace-nowrap transition-opacity duration-500 motion-reduce:transition-none",
                  fixed ? "opacity-0" : "opacity-100"
                )}
              >
                {oldPhrase}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 whitespace-nowrap text-primary transition-opacity delay-200 duration-500 motion-reduce:transition-none",
                  fixed ? "opacity-100" : "opacity-0"
                )}
              >
                {newPhrase}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-amber-500 transition-transform duration-700 ease-out motion-reduce:transition-none",
                  flagged ? "scale-x-100" : "scale-x-0"
                )}
              />
            </span>{" "}
            {textAfter}
          </p>

          <p className="relative mt-5 grid border-t border-border pt-4 text-sm">
            <span
              className={cn(
                "col-start-1 row-start-1 flex items-center gap-2 text-amber-700 transition-all duration-500 ease-out dark:text-amber-400 motion-reduce:transition-none",
                flagged ? "translate-y-0 opacity-100 delay-300" : "translate-y-1 opacity-0"
              )}
            >
              <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
              {flagLabel}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 flex items-center gap-2 text-emerald-700 transition-all duration-500 ease-out dark:text-emerald-400 motion-reduce:transition-none",
                fixed ? "translate-y-0 opacity-100 delay-300" : "translate-y-1 opacity-0"
              )}
            >
              <Check className="size-4 shrink-0" aria-hidden="true" />
              {fixedLabel}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
