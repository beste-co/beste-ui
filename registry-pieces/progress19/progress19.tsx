"use client";

import { Check, LoaderCircle } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "done" | "reset" | "running";

interface BuildStep {
  label: string;
  duration: string;
}

interface Progress19Props {
  title?: string;
  total?: string;
  steps?: BuildStep[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const progress19Demo: Progress19Props = {
  title: "Production build",
  total: "1m 31s",
  steps: [
    { label: "Install", duration: "14s" },
    { label: "Build", duration: "42s" },
    { label: "Test", duration: "27s" },
    { label: "Deploy", duration: "8s" },
  ],
  framed: true,
  stepMs: 1000,
};

const NEXT: Record<Phase, Phase> = {
  done: "reset",
  reset: "running",
  running: "done",
};

/* How long each phase lasts, in steps. Running holds this long for every build step. */
const HOLD: Record<Phase, number> = {
  done: 3.2,
  reset: 0.9,
  running: 1,
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

const fade = "transition-all duration-500 ease-out motion-reduce:transition-none";

export function Progress19({
  title,
  total,
  steps = [],
  framed = true,
  stepMs = 1000,
  className,
}: Progress19Props) {
  const [phase, setPhase] = useState<Phase>("done");
  const [active, setActive] = useState(0);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => {
      if (phase === "running" && active + 1 < steps.length) {
        setActive(active + 1);
        return;
      }
      if (NEXT[phase] === "running") setActive(0);
      setPhase(NEXT[phase]);
    }, HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, active, steps.length, stepMs]);

  const finished = phase === "done";
  const completed = finished ? steps.length : phase === "running" ? active : 0;

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
        <div className="rounded-lg bg-card px-5 pb-5 pt-5 text-card-foreground shadow-xs">
          <div className="flex items-baseline justify-between gap-4">
            {title && <p className="truncate text-lg font-normal tracking-tight">{title}</p>}
            {total && (
              <span
                className={cn(
                  "shrink-0 text-sm tabular-nums text-muted-foreground",
                  fade,
                  finished ? "opacity-100" : "opacity-0"
                )}
              >
                {total}
              </span>
            )}
          </div>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out motion-reduce:transition-none"
              style={{ width: steps.length > 0 ? `${(completed / steps.length) * 100}%` : "0%" }}
            />
          </div>

          <ul className="mt-2 divide-y divide-border">
            {steps.map((step, index) => {
              const done = index < completed;
              const running = phase === "running" && index === active;
              return (
                <li key={index} className="flex items-center gap-3 py-3">
                  <span className="relative grid size-5 shrink-0 place-items-center" aria-hidden="true">
                    <span
                      className={cn(
                        "absolute size-4 rounded-full border border-dashed border-muted-foreground/40",
                        fade,
                        done || running ? "opacity-0" : "opacity-100"
                      )}
                    />
                    <LoaderCircle
                      className={cn(
                        "absolute size-4 text-primary motion-safe:animate-spin",
                        fade,
                        running ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "absolute grid size-5 place-items-center rounded-full bg-emerald-500 text-white",
                        fade,
                        done ? "scale-100 opacity-100" : "scale-75 opacity-0"
                      )}
                    >
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex-1 truncate text-base transition-colors duration-500 motion-reduce:transition-none",
                      done || running ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "w-12 shrink-0 text-right text-sm tabular-nums text-muted-foreground",
                      fade,
                      done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                    )}
                  >
                    {step.duration}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
