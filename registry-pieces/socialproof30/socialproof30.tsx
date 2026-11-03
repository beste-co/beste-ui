"use client";

import { BadgeCheck, Star } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "fill";

interface Socialproof30Props {
  author?: { name: string; role: string; avatar: { src: string; alt: string } };
  /** Whole stars out of 5. */
  rating?: number;
  quote?: string;
  date?: string;
  verifiedLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const socialproof30Demo: Socialproof30Props = {
  author: {
    name: "Joni Mitchell",
    role: "Marketing lead at Halcyon",
    avatar: {
      src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with long dark hair holding a coffee cup",
    },
  },
  rating: 5,
  quote:
    "We rebuilt our whole site over two afternoons. The pages look like a studio made them, and anyone on the team can edit the copy without asking me first.",
  date: "March 2026",
  verifiedLabel: "Verified customer",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "fill", fill: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, reset: 0.8, fill: 1.6 };

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

export function Socialproof30({
  author,
  rating = 5,
  quote,
  date,
  verifiedLabel,
  framed = true,
  stepMs = 800,
  className,
}: Socialproof30Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const lit = phase !== "reset";
  const verified = phase === "rest";

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <div
        ref={inner}
        className={cn(
          "w-lg shrink-0",
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
        <figure className="rounded-lg bg-card px-6 py-6 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between gap-4">
            {author && (
              <figcaption className="flex min-w-0 items-center gap-3">
                <img src={author.avatar.src} alt={author.avatar.alt} className="size-12 shrink-0 rounded-md object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-lg tracking-tight">{author.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">{author.role}</span>
                </span>
              </figcaption>
            )}
            <span className="flex shrink-0 gap-0.5" role="img" aria-label={`${rating} out of 5`}>
              {Array.from({ length: 5 }, (_, index) => {
                const on = index < rating && lit;
                return (
                  <Star
                    key={index}
                    aria-hidden="true"
                    className={cn(
                      "size-4 transition-all duration-500 ease-out motion-reduce:transition-none",
                      on ? "scale-100 fill-foreground text-foreground" : "scale-90 fill-transparent text-foreground/20"
                    )}
                    style={{ transitionDelay: lit ? `${index * 140}ms` : "0ms" }}
                  />
                );
              })}
            </span>
          </div>

          <blockquote className="mt-6 text-lg leading-relaxed">{quote}</blockquote>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">{date}</span>
            {verifiedLabel && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-emerald-700 transition-all duration-500 ease-out motion-reduce:transition-none dark:text-emerald-400",
                  verified ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              >
                <BadgeCheck className="size-4" aria-hidden="true" />
                {verifiedLabel}
              </span>
            )}
          </div>
        </figure>
      </div>
    </div>
  );
}
