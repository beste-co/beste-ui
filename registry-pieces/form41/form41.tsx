"use client";

import { Plus } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "approach" | "press" | "result" | "leave";

interface SegmentFilter {
  label: string;
  /** People left once this filter and every one before it apply. */
  count: number;
}

interface Form41Props {
  title?: string;
  addLabel?: string;
  countLabel?: string;
  /** Everyone before any filter applies. */
  total?: number;
  filters?: SegmentFilter[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  /** Name on the cursor that presses the add button. */
  cursorLabel?: string;
  stepMs?: number;
  className?: string;
}

export const form41Demo: Form41Props = {
  title: "New segment",
  addLabel: "Add filter",
  countLabel: "people match",
  total: 12480,
  filters: [
    { label: "Plan is Pro", count: 4210 },
    { label: "Visited pricing", count: 1873 },
    { label: "Active this week", count: 1326 },
  ],
  framed: true,
  stepMs: 800,
};

/* After leave the cursor heads back for the next filter, or rests once every filter is in. */
const NEXT: Record<Phase, Phase> = {
  rest: "clear",
  clear: "approach",
  approach: "press",
  press: "result",
  result: "leave",
  leave: "approach",
};

/* How long each phase lasts, in steps. */
const HOLD: Record<Phase, number> = {
  rest: 4,
  clear: 1.4,
  approach: 1.2,
  press: 0.4,
  result: 0.9,
  leave: 0.9,
};

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

/* Eases the count toward its target so each filter visibly narrows the audience. */
function useEasedNumber(target: number, duration: number) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const next = from + (target - from) * (1 - (1 - p) ** 3);
      current.current = next;
      setValue(next);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* Step 0 is an empty segment; each press on the add button adds the next filter. */
export function Form41({
  title,
  addLabel,
  countLabel,
  total = 0,
  filters = [],
  framed = true,
  cursorLabel,
  stepMs = 800,
  className,
}: Form41Props) {
  const last = filters.length;
  const [phase, setPhase] = useState<Phase>("rest");
  const [step, setStep] = useState(last);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    if (last === 0) return;
    const id = setTimeout(() => {
      if (phase === "rest") setStep(0);
      if (phase === "press") setStep((s) => Math.min(last, s + 1));
      setPhase(phase === "leave" && step >= last ? "rest" : NEXT[phase]);
    }, HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, step, last, stepMs]);

  const onTarget = phase === "approach" || phase === "press" || phase === "result";
  const pressing = phase === "press";

  const target = step === 0 ? total : (filters[step - 1]?.count ?? total);
  const count = useEasedNumber(target, stepMs * 1.2);
  const share = total > 0 ? Math.min(100, (count / total) * 100) : 0;

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
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            {title && <p className="truncate text-lg font-normal tracking-tight">{title}</p>}
            {addLabel && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  tabIndex={-1}
                  className={cn(
                    "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-3 text-sm text-primary-foreground shadow-xs transition-all duration-200 hover:bg-primary/90 motion-reduce:transition-none",
                    pressing && "scale-95 bg-primary/85"
                  )}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  {addLabel}
                </button>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                  style={{ transform: onTarget ? "translate(0.5rem, 0.25rem)" : "translate(0, 3.25rem)" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    className={cn(
                      "size-7 fill-foreground stroke-background transition-transform duration-150",
                      pressing && "scale-90"
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

          <div className="pt-5">
            <p className="text-4xl font-normal tabular-nums tracking-tight">{Math.round(count).toLocaleString("en-US")}</p>
            {countLabel && <p className="mt-1 text-sm text-muted-foreground">{countLabel}</p>}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${share}%` }} />
            </div>
          </div>

          {filters.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <li
                  key={index}
                  className={cn(
                    "origin-left rounded-md border border-border bg-card px-3 py-1.5 text-sm shadow-xs transition-all duration-300 ease-out motion-reduce:transition-none",
                    step > index ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  )}
                >
                  {filter.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
