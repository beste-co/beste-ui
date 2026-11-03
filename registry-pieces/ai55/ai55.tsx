"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "drafting" | "done";

interface Ai55Props {
  /** Where the decision comes from, such as a channel and message count. */
  source?: string;
  actionLabel?: string;
  doneLabel?: string;
  decision?: string;
  owner?: { name: string; avatar: { src: string; alt: string } };
  due?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const ai55Demo: Ai55Props = {
  source: "From #pricing-page, 3 messages",
  actionLabel: "Draft decision",
  doneLabel: "Logged",
  decision: "Annual plans get 2 months free, live with the new pricing page.",
  owner: {
    name: "Norah Jones",
    avatar: {
      src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman holding a coffee cup",
    },
  },
  due: "Ships May 14",
  framed: true,
  stepMs: 850,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "approach",
  approach: "press",
  press: "drafting",
  drafting: "done",
  done: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1, approach: 1.2, press: 0.4, drafting: 1.8, done: 0.8 };

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

export function Ai55({
  source,
  actionLabel,
  doneLabel,
  decision,
  owner,
  due,
  cursorLabel,
  framed = true,
  stepMs = 850,
  className,
}: Ai55Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const drafting = phase === "drafting";
  const written = phase === "done" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes ai55-shimmer { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
.ai55-shimmer { animation: ai55-shimmer 1100ms ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ai55-shimmer { animation: none; } }
`}</style>
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
          <div className="flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm text-muted-foreground">{source}</p>
            <div className="relative shrink-0">
              <span
                className={cn(
                  "grid h-9 items-center justify-items-center rounded-md px-4 text-sm transition-all duration-300 motion-reduce:transition-none",
                  written ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                  phase === "press" && "scale-95 bg-primary/85"
                )}
              >
                <span
                  className={cn("col-start-1 row-start-1 transition-opacity duration-300", written ? "opacity-0" : "opacity-100")}
                >
                  {actionLabel}
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 inline-flex items-center gap-1.5 transition-opacity duration-300",
                    written ? "opacity-100" : "opacity-0"
                  )}
                >
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  {doneLabel}
                </span>
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

          {/* Placeholder lines and the written decision share one cell, so the card never changes height. */}
          <div className="mt-5 grid border-t border-border pt-5">
            <div
              aria-hidden="true"
              className={cn(
                "col-start-1 row-start-1 space-y-3 pt-1 transition-opacity duration-500 motion-reduce:transition-none",
                written ? "opacity-0" : "opacity-100"
              )}
            >
              <span className={cn("block h-3 w-11/12 rounded-full bg-muted", drafting && "ai55-shimmer")} />
              <span
                className={cn("block h-3 w-3/4 rounded-full bg-muted", drafting && "ai55-shimmer")}
                style={{ animationDelay: "150ms" }}
              />
              <span
                className={cn("block h-3 w-1/2 rounded-full bg-muted", drafting && "ai55-shimmer")}
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <div
              className={cn(
                "col-start-1 row-start-1 transition-all duration-700 ease-out motion-reduce:transition-none",
                written ? "translate-y-0 opacity-100 blur-none" : "translate-y-1 opacity-0 blur-sm"
              )}
            >
              <p className="text-lg leading-snug tracking-tight">{decision}</p>
              <div className="mt-5 flex items-center gap-3">
                {owner && (
                  <>
                    <img src={owner.avatar.src} alt={owner.avatar.alt} className="size-8 shrink-0 rounded-md object-cover" />
                    <span className="min-w-0 flex-1 truncate text-sm">{owner.name}</span>
                  </>
                )}
                {due && (
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-sm text-primary">{due}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
