"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "tick";

interface SetupStep {
  label: string;
  /** Short note on the right, such as how long the step takes. */
  meta?: string;
}

interface Card34Props {
  title?: string;
  /** Use {done} and {total}, as in "{done} of {total}". */
  progressTemplate?: string;
  steps?: SetupStep[];
  pendingLabel?: string;
  doneLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const card34Demo: Card34Props = {
  title: "Your first issue",
  progressTemplate: "{done} of {total}",
  steps: [
    { label: "Import your readers", meta: "2 min" },
    { label: "Pick a layout", meta: "3 min" },
    { label: "Write a short welcome", meta: "4 min" },
    { label: "Send yourself a test", meta: "1 min" },
  ],
  pendingLabel: "About 10 minutes from start to send",
  doneLabel: "Ready to send to 2,418 readers",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "tick", tick: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.2, tick: 1 };

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

export function Card34({
  title,
  progressTemplate,
  steps = [],
  pendingLabel,
  doneLabel,
  framed = true,
  stepMs = 900,
  className,
}: Card34Props) {
  const total = steps.length;
  const [phase, setPhase] = useState<Phase>("rest");
  const [done, setDone] = useState(total);
  const { outer, inner, scale, entrance } = useFitScale();

  /* Steps tick off one at a time; the loop rests once the last one is checked. */
  useEffect(() => {
    if (phase === "tick" && done < total) {
      const id = setTimeout(() => setDone(done + 1), HOLD.tick * stepMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(
      () => {
        const next = NEXT[phase];
        if (next === "reset") setDone(0);
        setPhase(next);
      },
      HOLD[phase] * stepMs
    );
    return () => clearTimeout(id);
  }, [phase, done, total, stepMs]);

  const complete = total > 0 && done >= total;
  const progress = progressTemplate?.replace("{done}", String(done)).replace("{total}", String(total));

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
            <p className="truncate text-lg tracking-tight">{title}</p>
            {progress && <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{progress}</p>}
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div
              className="h-full origin-left rounded-full bg-primary transition-transform duration-700 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${total > 0 ? done / total : 0})` }}
            />
          </div>

          <ul className="mt-5 flex flex-col gap-1">
            {steps.map((step, index) => {
              const checked = index < done;
              const current = phase === "tick" && index === done;
              return (
                <li key={index} className="flex h-10 items-center gap-3">
                  <span className="relative grid size-5 shrink-0 place-items-center" aria-hidden="true">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 size-5 rounded-full border transition-colors duration-500 motion-reduce:transition-none",
                        current ? "border-primary" : "border-border"
                      )}
                    />
                    <span
                      className={cn(
                        "col-start-1 row-start-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
                        checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )}
                    >
                      <Check className="size-3" />
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex-1 truncate text-base transition-colors duration-500 motion-reduce:transition-none",
                      checked || current ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {step.meta && <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{step.meta}</span>}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 grid border-t border-border pt-4 text-sm">
            <p
              className={cn(
                "col-start-1 row-start-1 text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                complete ? "opacity-0" : "opacity-100"
              )}
            >
              {pendingLabel}
            </p>
            <p
              className={cn(
                "col-start-1 row-start-1 flex items-center gap-2 transition-all duration-500 ease-out motion-reduce:transition-none",
                complete ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              )}
            >
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              {doneLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
