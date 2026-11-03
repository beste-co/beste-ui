"use client";

import { Star } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "leave" | "arrive" | "stars";

interface Socialproof29Props {
  avatar?: { src: string; alt: string };
  name?: string;
  detail?: string;
  quote?: string;
  /** Number of stars that fill in, out of 5. */
  rating?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const socialproof29Demo: Socialproof29Props = {
  avatar: {
    src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
    alt: "Woman holding a coffee cup",
  },
  name: "Joni Mitchell",
  detail: "Verified buyer",
  quote: "The linen shirt arrived in 2 days and fits like it was made for me.",
  rating: 5,
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = {
  rest: "leave",
  leave: "arrive",
  arrive: "stars",
  stars: "rest",
};

/* How long each phase lasts, in steps. */
const HOLD: Record<Phase, number> = {
  rest: 3.5,
  leave: 0.9,
  arrive: 1,
  stars: 1.2,
};

const STARS = [0, 1, 2, 3, 4];

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

export function Socialproof29({
  avatar,
  name,
  detail,
  quote,
  rating = 5,
  framed = true,
  stepMs = 900,
  className,
}: Socialproof29Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const shown = phase !== "leave";
  const filled = phase === "stars" || phase === "rest";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        className={cn(
          "shrink-0 transition-all duration-700 ease-out motion-reduce:transition-none",
          shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
      >
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
              {avatar && <img src={avatar.src} alt={avatar.alt} className="size-11 shrink-0 rounded-md object-cover" />}
              <div className="min-w-0 flex-1">
                {name && <p className="truncate text-base">{name}</p>}
                {detail && <p className="truncate text-sm text-muted-foreground">{detail}</p>}
              </div>
            </div>

            <div className="mt-4 flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
              {STARS.map((index) => {
                const on = filled && index < rating;
                return (
                  <Star
                    key={index}
                    aria-hidden="true"
                    className={cn(
                      "size-4 transition-colors duration-300 ease-out motion-reduce:transition-none",
                      on ? "fill-amber-400 text-amber-400" : "fill-muted text-border"
                    )}
                    style={{ transitionDelay: on && phase === "stars" ? `${index * 140}ms` : undefined }}
                  />
                );
              })}
            </div>

            {quote && <p className="mt-3 text-base leading-relaxed">{quote}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
