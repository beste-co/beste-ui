"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "approach" | "press" | "play";

interface Media28Props {
  cover?: { src: string; alt: string };
  show?: string;
  title?: string;
  duration?: string;
  pausedLabel?: string;
  playingLabel?: string;
  /** Where the episode sits before and after the loop plays, from 0 to 1. */
  from?: number;
  to?: number;
  bars?: number;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const media28Demo: Media28Props = {
  cover: {
    src: "https://images.unsplash.com/photo-1763491905755-185326526e9e?q=80&w=1600&auto=format&fit=crop",
    alt: "Painting of a river bank with poplars",
  },
  show: "Slow Rivers",
  title: "The town that kept its mill",
  duration: "38 min",
  pausedLabel: "Paused",
  playingLabel: "Playing",
  from: 0.22,
  to: 0.48,
  bars: 48,
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "approach", approach: "press", press: "play", play: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.2, approach: 1.2, press: 0.4, play: 0.6 };

/* A fixed, speech-like envelope, so server and client draw the same waveform. */
const level = (index: number) => 0.28 + 0.72 * Math.abs(Math.sin(index * 1.37) * Math.cos(index * 0.41 + 0.6));

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

export function Media28({
  cover,
  show,
  title,
  duration,
  pausedLabel,
  playingLabel,
  from = 0.22,
  to = 0.48,
  bars = 48,
  cursorLabel,
  framed = true,
  stepMs = 900,
  className,
}: Media28Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const playing = phase === "play" || phase === "rest";
  const onButton = phase === "approach" || phase === "press";
  const heard = playing ? to : from;
  /* While playing the fill creeps forward across the whole hold; on reset it eases back. */
  const fillTransition = entrance.still
    ? "none"
    : playing
      ? `clip-path ${(HOLD.play + HOLD.rest) * stepMs}ms linear`
      : "clip-path 700ms cubic-bezier(0.16, 1, 0.3, 1)";
  const levels = Array.from({ length: Math.max(bars, 1) }, (_, index) => level(index));

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
          <div className="flex items-center gap-4">
            {cover && <img src={cover.src} alt={cover.alt} className="size-16 shrink-0 rounded-md object-cover" />}
            <div className="min-w-0">
              <p className="truncate text-sm text-muted-foreground">{show}</p>
              <p className="mt-0.5 truncate text-lg tracking-tight">{title}</p>
            </div>
          </div>

          <div className="relative mt-6 h-14" aria-hidden="true">
            <div className="absolute inset-0 flex items-center gap-0.5">
              {levels.map((value, index) => (
                <span key={index} className="flex-1 rounded-full bg-muted" style={{ height: `${value * 100}%` }} />
              ))}
            </div>
            <div
              className="absolute inset-0 flex items-center gap-0.5"
              style={{ clipPath: `inset(0 ${(1 - heard) * 100}% 0 0)`, transition: fillTransition }}
            >
              {levels.map((value, index) => (
                <span key={index} className="flex-1 rounded-full bg-primary" style={{ height: `${value * 100}%` }} />
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="relative shrink-0">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-150",
                  phase === "press" && "scale-90"
                )}
              >
                <Play
                  className={cn(
                    "col-start-1 row-start-1 size-4 fill-current transition-all duration-300",
                    playing ? "scale-50 opacity-0" : "scale-100 opacity-100"
                  )}
                  aria-hidden="true"
                />
                <Pause
                  className={cn(
                    "col-start-1 row-start-1 size-4 fill-current transition-all duration-300",
                    playing ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  )}
                  aria-hidden="true"
                />
              </span>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                style={{ transform: onButton ? "translate(0.25rem, 0.25rem)" : "translate(3.5rem, 2.5rem)" }}
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
            <span className="relative grid flex-1 text-base">
              <span className={cn("col-start-1 row-start-1 transition-opacity duration-300", playing ? "opacity-0" : "opacity-100 text-muted-foreground")}>
                {pausedLabel}
              </span>
              <span className={cn("col-start-1 row-start-1 transition-opacity duration-300", playing ? "opacity-100" : "opacity-0")}>
                {playingLabel}
              </span>
            </span>
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
