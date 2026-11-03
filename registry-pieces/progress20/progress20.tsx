"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "run" | "ready" | "approach" | "press" | "live";

interface PipelineStep {
  label: string;
  /** Shown at the end of the row once the step finishes. */
  duration: string;
}

interface Progress20Props {
  author?: { name: string; avatar: { src: string; alt: string } };
  title?: string;
  branch?: string;
  steps?: PipelineStep[];
  buildingLabel?: string;
  readyLabel?: string;
  liveLabel?: string;
  /** Button the cursor presses; it turns into `promotedLabel`. */
  promoteLabel?: string;
  promotedLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const progress20Demo: Progress20Props = {
  author: {
    name: "Nick Drake",
    avatar: {
      src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Smiling man in a floral shirt",
    },
  },
  title: "Faster image loading on product pages",
  branch: "main",
  steps: [
    { label: "Install", duration: "6s" },
    { label: "Build", duration: "24s" },
    { label: "Run checks", duration: "11s" },
  ],
  buildingLabel: "Building",
  readyLabel: "Ready to promote",
  liveLabel: "Live at acme.dev",
  promoteLabel: "Promote",
  promotedLabel: "Live",
  framed: true,
  stepMs: 800,
};

/* Each pipeline step takes this many steps while running. */
const STEP_HOLD = 1.2;

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "run",
  run: "ready",
  ready: "approach",
  approach: "press",
  press: "live",
  live: "rest",
};
/* `run` is sized from the number of pipeline steps instead. */
const HOLD: Record<Phase, number> = { rest: 4, reset: 1, run: 0, ready: 0.8, approach: 1.2, press: 0.4, live: 1 };

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

export function Progress20({
  author,
  title,
  branch,
  steps = [],
  buildingLabel,
  readyLabel,
  liveLabel,
  promoteLabel,
  promotedLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Progress20Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const [done, setDone] = useState(steps.length);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const hold = phase === "run" ? (steps.length + 0.4) * STEP_HOLD : HOLD[phase];
    const id = setTimeout(() => setPhase(NEXT[phase]), hold * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs, steps.length]);

  /* Steps finish one after another while the pipeline runs. */
  useEffect(() => {
    if (phase === "reset") {
      setDone(0);
      return;
    }
    if (phase !== "run") {
      setDone(steps.length);
      return;
    }
    const id = setInterval(() => setDone((count) => Math.min(count + 1, steps.length)), STEP_HOLD * stepMs);
    return () => clearInterval(id);
  }, [phase, stepMs, steps.length]);

  const building = phase === "reset" || phase === "run";
  const live = phase === "live" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes progress20-spin { to { transform: rotate(360deg); } }
.progress20-spin { animation: progress20-spin 900ms linear infinite; }
@media (prefers-reduced-motion: reduce) { .progress20-spin { animation: none; } }
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
          <div className="flex items-center gap-3">
            {author && (
              <img src={author.avatar.src} alt={author.avatar.alt} className="size-10 shrink-0 rounded-md object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate text-lg tracking-tight">{title}</p>
              <p className="truncate text-sm text-muted-foreground">{branch}</p>
            </div>
          </div>

          <ul className="mt-5 flex flex-col gap-3.5 border-t border-border pt-5">
            {steps.map((step, index) => {
              const finished = index < done;
              const active = !finished && index === done && phase === "run";
              return (
                <li key={index} className="flex items-center gap-3">
                  <span className="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 size-4 rounded-full border-2 border-muted transition-opacity duration-300",
                        !finished && !active ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "progress20-spin col-start-1 row-start-1 size-4 rounded-full border-2 border-muted border-t-primary transition-opacity duration-300",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "col-start-1 row-start-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white transition-all duration-300",
                        finished ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )}
                    >
                      <Check className="size-2.5" />
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-base transition-colors duration-300",
                      finished || active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "text-sm tabular-nums text-muted-foreground transition-opacity duration-300",
                      finished ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {step.duration}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex h-10 items-center gap-3 border-t border-border pt-5">
            <span
              aria-hidden="true"
              className={cn(
                "size-2 shrink-0 rounded-full transition-colors duration-500",
                building ? "bg-muted-foreground/40" : live ? "bg-emerald-500" : "bg-primary"
              )}
            />
            <span className="relative grid flex-1">
              <span className={cn("col-start-1 row-start-1 text-base transition-opacity duration-300", building ? "opacity-100" : "opacity-0")}>
                {buildingLabel}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 text-base transition-opacity duration-300",
                  !building && !live ? "opacity-100" : "opacity-0"
                )}
              >
                {readyLabel}
              </span>
              <span className={cn("col-start-1 row-start-1 text-base transition-opacity duration-300", live ? "opacity-100" : "opacity-0")}>
                {liveLabel}
              </span>
            </span>
            <div className="relative shrink-0">
              <span
                className={cn(
                  "grid h-9 items-center rounded-md px-4 text-sm transition-all duration-300",
                  live
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-primary text-primary-foreground",
                  building && "opacity-40",
                  phase === "press" && "scale-95 bg-primary/85"
                )}
              >
                <span className={cn("col-start-1 row-start-1 text-center transition-opacity duration-300", live ? "opacity-0" : "opacity-100")}>
                  {promoteLabel}
                </span>
                <span className={cn("col-start-1 row-start-1 text-center transition-opacity duration-300", live ? "opacity-100" : "opacity-0")}>
                  {promotedLabel}
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
        </div>
      </div>
    </div>
  );
}
