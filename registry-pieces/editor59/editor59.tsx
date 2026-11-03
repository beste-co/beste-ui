"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "idle" | "approach" | "press" | "jump";

interface Chapter {
  title: string;
  excerpt: string;
}

interface Editor59Props {
  title?: string;
  chapters?: Chapter[];
  /** Chapter open when the loop starts. */
  startIndex?: number;
  /** Chapter the cursor clicks in the outline. */
  targetIndex?: number;
  chapterLabel?: string;
  ofLabel?: string;
  status?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const editor59Demo: Editor59Props = {
  title: "Field notes, full draft",
  chapters: [
    { title: "1. The harbor at dawn", excerpt: "The boats leave before the gulls wake, and the water is the color of slate." },
    { title: "2. Rope and tar", excerpt: "Every knot on the quay has a name, and most of them belong to someone's father." },
    { title: "3. The fish market", excerpt: "By 7 the tables are empty and the stone floor smells of salt and lemons." },
    { title: "4. Low tide", excerpt: "Twice a day the bay pulls back and shows what it has been keeping." },
    { title: "5. Salt and timber", excerpt: "The boatyard has built the same hull for 90 years and sees no reason to stop." },
    { title: "6. Winter at the lighthouse", excerpt: "The keeper writes the weather in a ledger that goes back to 1911." },
    { title: "7. Storm season", excerpt: "In November the whole town sleeps with one ear on the wind." },
    { title: "8. Leaving the coast", excerpt: "The last bus inland waits by the chapel until the driver finishes his coffee." },
  ],
  startIndex: 0,
  targetIndex: 5,
  chapterLabel: "Chapter",
  ofLabel: "of",
  status: "One click from the outline",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "idle",
  idle: "approach",
  approach: "press",
  press: "jump",
  jump: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 0.8, idle: 1, approach: 1.2, press: 0.4, jump: 1 };

/* Fixed line widths for the body text under each chapter opening. */
const LINES = [96, 91, 98, 84, 93, 58];

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

export function Editor59({
  title,
  chapters = [],
  startIndex = 0,
  targetIndex = 0,
  chapterLabel,
  ofLabel,
  status,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Editor59Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const arrived = phase === "jump" || phase === "rest";
  const active = arrived ? targetIndex : startIndex;
  const onTarget = phase === "approach" || phase === "press";

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
          <p className="truncate text-lg tracking-tight">{title}</p>

          <div className="mt-5 flex h-72 gap-4">
            <ul className="flex w-40 shrink-0 flex-col gap-0.5">
              {chapters.map((chapter, index) => (
                <li key={index} className="relative">
                  <span
                    className={cn(
                      "flex h-8 items-center truncate rounded-md px-2.5 text-sm transition-colors duration-300 motion-reduce:transition-none",
                      index === active ? "bg-muted text-foreground" : "text-muted-foreground",
                      index === targetIndex && phase === "press" && "bg-muted/70"
                    )}
                  >
                    <span className="truncate">{chapter.title}</span>
                  </span>
                  {index === targetIndex && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                      style={{ transform: onTarget ? "translate(0.5rem, 0.1rem)" : "translate(5rem, 4.5rem)" }}
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
                </li>
              ))}
            </ul>

            {/* Every chapter opening is stacked in one cell, so the jump is a crossfade with no layout shift. */}
            <div className="grid min-w-0 flex-1 overflow-hidden rounded-md border border-border bg-background">
              {chapters.map((chapter, index) => {
                const shown = index === active;
                return (
                  <div
                    key={index}
                    aria-hidden={!shown}
                    className={cn(
                      "col-start-1 row-start-1 px-4 py-5 transition-all duration-500 ease-out motion-reduce:transition-none",
                      shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    )}
                  >
                    <p className="text-base tracking-tight">{chapter.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{chapter.excerpt}</p>
                    <div aria-hidden="true" className="mt-5 flex flex-col gap-2">
                      {LINES.map((width, line) => (
                        <span key={line} className="h-1.5 rounded-full bg-foreground/10" style={{ width: `${width}%` }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {(status || chapterLabel) && (
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="truncate text-sm text-muted-foreground">{status}</p>
              {chapterLabel && (
                <p className="shrink-0 text-sm tabular-nums">
                  {chapterLabel} {active + 1} {ofLabel} {chapters.length}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
