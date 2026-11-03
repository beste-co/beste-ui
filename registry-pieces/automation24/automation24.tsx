"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface RunStep {
  label: string;
  detail: string;
}

interface Automation24Props {
  title?: string;
  waitingLabel?: string;
  runningLabel?: string;
  doneLabel?: string;
  steps?: RunStep[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const automation24Demo: Automation24Props = {
  title: "Reorder run",
  waitingLabel: "Waiting for a trigger",
  runningLabel: "Running",
  doneLabel: "Done in 2.4s",
  steps: [
    { label: "Stock checked", detail: "18 units left in Bay 4" },
    { label: "Purchase order sent", detail: "200 units from Northwind" },
    { label: "Warehouse told", detail: "Posted in #floor" },
  ],
  framed: true,
  stepMs: 800,
};

/* With 3 steps one lap is 8.8 steps, matching automation23: the run starts the moment its switch turns on. */
const WAIT = 2.8;
const STEP = 0.9;
const LAP_REST = 6;

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

/* Step 0 waits, steps 1 to n run each row in turn, and step n + 1 holds the finished run. */
export function Automation24({
  title,
  waitingLabel,
  runningLabel,
  doneLabel,
  steps = [],
  framed = true,
  stepMs = 800,
  className,
}: Automation24Props) {
  const done = steps.length + 1;
  const [step, setStep] = useState(done);
  const firstLap = useRef(true);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const finished = step >= done;
    const units =
      step === 0
        ? WAIT
        : finished
          ? firstLap.current
            ? LAP_REST
            : Math.max(LAP_REST - steps.length * STEP, 2)
          : STEP;
    const id = setTimeout(() => {
      if (finished) firstLap.current = false;
      setStep(finished ? 0 : step + 1);
    }, units * stepMs);
    return () => clearTimeout(id);
  }, [step, done, steps.length, stepMs]);

  const status = step === 0 ? "waiting" : step >= done ? "done" : "running";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes automation24-spin { to { transform: rotate(360deg); } }
.automation24-spin { animation: automation24-spin 900ms linear infinite; }
@media (prefers-reduced-motion: reduce) { .automation24-spin { animation: none; } }
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
          <p className="truncate text-lg tracking-tight">{title}</p>
          <span className="relative mt-0.5 grid text-sm">
            <span
              className={cn(
                "col-start-1 row-start-1 text-muted-foreground transition-opacity duration-300",
                status === "waiting" ? "opacity-100" : "opacity-0"
              )}
            >
              {waitingLabel}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 text-primary transition-opacity duration-300",
                status === "running" ? "opacity-100" : "opacity-0"
              )}
            >
              {runningLabel}
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1 tabular-nums text-emerald-700 transition-opacity duration-300 dark:text-emerald-400",
                status === "done" ? "opacity-100" : "opacity-0"
              )}
            >
              {doneLabel}
            </span>
          </span>

          <div className="mt-5 border-t border-border pt-2">
            {steps.map((item, index) => {
              const rowDone = step > index + 1;
              const active = step === index + 1;
              return (
                <div
                  key={index}
                  className={cn(
                    "flex h-14 items-center gap-4 transition-opacity duration-500 motion-reduce:transition-none",
                    rowDone || active ? "opacity-100" : "opacity-40"
                  )}
                >
                  <span className="relative grid size-5 shrink-0 place-items-center" aria-hidden="true">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 size-5 rounded-full border border-border transition-opacity duration-300",
                        rowDone || active ? "opacity-0" : "opacity-100"
                      )}
                    />
                    <span
                      className={cn(
                        "automation24-spin col-start-1 row-start-1 size-5 rounded-full border-2 border-muted border-t-primary transition-opacity duration-300",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "col-start-1 row-start-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white transition-all duration-300 motion-reduce:transition-none",
                        rowDone ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )}
                    >
                      <Check className="size-3" />
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{item.label}</p>
                    <p className="truncate text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
