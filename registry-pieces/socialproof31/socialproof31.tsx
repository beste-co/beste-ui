"use client";

import { Star } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "reset" | "arrive";

interface Review {
  name: string;
  avatar?: { src: string; alt: string };
  text: string;
  /** Whole stars out of 5. */
  stars: number;
}

interface Socialproof31Props {
  title?: string;
  /** Average after the new review lands; `previousRating` shows before it. */
  rating?: number;
  previousRating?: number;
  count?: number;
  countLabel?: string;
  incoming?: Review;
  /** Reviews already on the list; the new one pushes the last one out. */
  reviews?: Review[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const socialproof31Demo: Socialproof31Props = {
  title: "Reviews this season",
  rating: 4.9,
  previousRating: 4.8,
  count: 132,
  countLabel: "reviews",
  incoming: { name: "Etta James", text: "Kind teachers and a class that fits before work.", stars: 5 },
  reviews: [
    { name: "Sam Cooke", text: "Booking a mat takes 10 seconds.", stars: 5 },
    { name: "Carly Simon", text: "The reformer room is calm and bright.", stars: 4 },
  ],
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "clear", clear: "reset", reset: "arrive", arrive: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, clear: 0.5, reset: 1, arrive: 1.2 };

/* The card is drawn at a fixed width and scaled down to fit small slots, so its proportions never change. */
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

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} role="img" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn("size-3.5", index < value ? "fill-foreground text-foreground" : "text-foreground/20")}
        />
      ))}
    </span>
  );
}

function ReviewRow({ review }: { review: Review }) {
  return (
    <div className="flex h-20 items-center gap-3 border-t border-border">
      {review.avatar ? (
        <img src={review.avatar.src} alt={review.avatar.alt} className="size-9 shrink-0 rounded-md object-cover" />
      ) : (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-sm" aria-hidden="true">
          {review.name.charAt(0)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-base">{review.name}</p>
          <Stars value={review.stars} className="shrink-0" />
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{review.text}</p>
      </div>
    </div>
  );
}

export function Socialproof31({
  title,
  rating = 0,
  previousRating,
  count = 0,
  countLabel,
  incoming,
  reviews = [],
  framed = true,
  stepMs = 900,
  className,
}: Socialproof31Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const arrived = phase === "arrive" || phase === "rest";
  /* The list fades out before it rewinds, so the jump back is never seen. */
  const rewound = phase === "reset";
  const before = previousRating ?? rating;
  const shownCount = arrived || !incoming ? count : count - 1;
  const visibleRows = Math.max(reviews.length, 1);

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
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-end justify-between gap-4 pb-5">
            <span className="grid text-5xl tracking-tight tabular-nums">
              <span
                className={cn(
                  "col-start-1 row-start-1 transition-all duration-500 ease-out motion-reduce:transition-none",
                  arrived ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                )}
              >
                {before.toFixed(1)}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 transition-all delay-300 duration-500 ease-out motion-reduce:transition-none",
                  arrived ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                )}
              >
                {rating.toFixed(1)}
              </span>
            </span>
            <span className="mb-1.5 flex flex-col items-end gap-1">
              <Stars value={Math.round(rating)} />
              <span className="text-sm tabular-nums text-muted-foreground">
                {shownCount} {countLabel}
              </span>
            </span>
          </div>

          {/* A fixed window: the new review slides in on top and the oldest slides out below. */}
          <div className="relative overflow-hidden" style={{ height: `${visibleRows * 5}rem` }}>
            <div
              className="transition-[transform,opacity] ease-out motion-reduce:transition-none"
              style={{
                transform: incoming && rewound ? "translateY(-5rem)" : "translateY(0)",
                opacity: phase === "clear" ? 0 : 1,
                transitionDuration: phase === "arrive" ? "800ms, 400ms" : phase === "reset" ? "0ms, 400ms" : "400ms, 400ms",
              }}
            >
              {incoming && (
                <div
                  className={cn(
                    "transition-opacity duration-700 motion-reduce:transition-none",
                    arrived ? "opacity-100" : "opacity-0"
                  )}
                >
                  <ReviewRow review={incoming} />
                </div>
              )}
              {reviews.map((review, index) => (
                <ReviewRow key={index} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
