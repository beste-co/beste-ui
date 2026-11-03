"use client";

import { Check, Star } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "arrive" | "approach" | "press" | "added";

interface Review {
  name: string;
  avatar: { src: string; alt: string };
  /** Whole stars, 1 to 5. */
  rating: number;
  quote: string;
}

interface Socialproof33Props {
  label?: string;
  /** Average before the new review is added. */
  average?: number;
  /** Average once the new review is counted. */
  nextAverage?: number;
  /** Review count before the new one is added. */
  count?: number;
  countLabel?: string;
  decimals?: number;
  review?: Review;
  publishLabel?: string;
  publishedLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const socialproof33Demo: Socialproof33Props = {
  label: "Rating this month",
  average: 4.78,
  nextAverage: 4.79,
  count: 36,
  countLabel: "reviews",
  decimals: 2,
  review: {
    name: "Carole King",
    avatar: {
      src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with short hair under a blue sky",
    },
    rating: 5,
    quote: "Ten minutes a day, and last week I ordered dinner in Italian.",
  },
  publishLabel: "Publish",
  publishedLabel: "Published",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "clear",
  clear: "arrive",
  arrive: "approach",
  approach: "press",
  press: "added",
  added: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4.5, clear: 1.2, arrive: 1.4, approach: 1.2, press: 0.4, added: 0.8 };

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

const starSize = { sm: "size-3.5", md: "size-4" } as const;

function Stars({ rating, size }: { rating: number; size: keyof typeof starSize }) {
  return (
    <span className="relative inline-flex shrink-0" aria-hidden="true">
      <span className="flex gap-0.5 text-muted">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star key={index} className={cn("shrink-0 fill-current", starSize[size])} strokeWidth={0} />
        ))}
      </span>
      <span
        className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-700 ease-out motion-reduce:transition-none"
        style={{ width: `${(Math.min(Math.max(rating, 0), 5) / 5) * 100}%` }}
      >
        <span className="flex w-max gap-0.5 text-primary">
          {[0, 1, 2, 3, 4].map((index) => (
            <Star key={index} className={cn("shrink-0 fill-current", starSize[size])} strokeWidth={0} />
          ))}
        </span>
      </span>
    </span>
  );
}

/* Two values stacked in one cell; the old one rises out as the new one rises in. */
function Roll({ from, to, on, className }: { from: string; to: string; on: boolean; className?: string }) {
  return (
    <span className={cn("relative inline-grid overflow-hidden", className)}>
      <span
        className={cn(
          "col-start-1 row-start-1 transition-all duration-500 ease-out motion-reduce:transition-none",
          on ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        {from}
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1 transition-all duration-500 ease-out motion-reduce:transition-none",
          on ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        {to}
      </span>
    </span>
  );
}

export function Socialproof33({
  label,
  average = 0,
  nextAverage = 0,
  count = 0,
  countLabel,
  decimals = 1,
  review,
  publishLabel,
  publishedLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Socialproof33Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const counted = phase === "added" || phase === "rest";
  const showReview = phase !== "clear";
  const onButton = phase === "approach" || phase === "press";

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
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <Roll
              from={average.toFixed(decimals)}
              to={nextAverage.toFixed(decimals)}
              on={counted}
              className="text-5xl tracking-tight tabular-nums"
            />
            <div className="mb-1.5 flex flex-col items-end gap-1.5">
              <Stars rating={counted ? nextAverage : average} size="md" />
              <span className="flex gap-1 text-sm text-muted-foreground">
                <Roll from={String(count)} to={String(count + 1)} on={counted} className="tabular-nums" />
                {countLabel}
              </span>
            </div>
          </div>

          {review && (
            <div className="mt-5 border-t border-border pt-5">
              <div
                className={cn(
                  "flex items-start gap-3 transition-all duration-700 ease-out motion-reduce:transition-none",
                  showReview ? "translate-y-0 opacity-100 blur-none" : "translate-y-3 opacity-0 blur-sm"
                )}
              >
                <img
                  src={review.avatar.src}
                  alt={review.avatar.alt}
                  className="size-10 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-base">{review.name}</p>
                    <Stars rating={review.rating} size="sm" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{review.quote}</p>
                </div>
                <div className="relative shrink-0">
                  <span className="grid">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm text-primary-foreground transition-all duration-300 motion-reduce:transition-none",
                        counted ? "opacity-0" : "opacity-100",
                        phase === "press" && "scale-95 bg-primary/85"
                      )}
                    >
                      {publishLabel}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-emerald-500/10 px-3 text-sm text-emerald-700 transition-all duration-300 motion-reduce:transition-none dark:text-emerald-400",
                        counted ? "scale-100 opacity-100" : "scale-95 opacity-0"
                      )}
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      {publishedLabel}
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
          )}
        </div>
      </div>
    </div>
  );
}
