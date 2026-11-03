"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Socialproof34Props {
  person?: { name: string; company: string; avatar: { src: string; alt: string } };
  quote?: string;
  /** Part of the quote that gets a soft highlight once the card is in view. */
  highlight?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  className?: string;
}

export const socialproof34Demo: Socialproof34Props = {
  person: {
    name: "Patti Smith",
    company: "Head of operations, Halcyon Hotels",
    avatar: {
      src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with short hair under a blue sky",
    },
  },
  quote: "Guests used to queue at the desk. Now most of them walk straight up to their room.",
  highlight: "walk straight up to their room",
  framed: true,
};

const MARK = "color-mix(in oklab, var(--primary) 18%, transparent)";

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

export function Socialproof34({ person, quote, highlight, framed = true, className }: Socialproof34Props) {
  const { outer, inner, scale, entrance } = useFitScale();
  const at = quote && highlight ? quote.indexOf(highlight) : -1;

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
        <div className="rounded-lg bg-card p-6 text-card-foreground shadow-xs">
          {quote && (
            <p className="text-xl leading-snug tracking-tight">
              {at < 0 || !highlight ? (
                quote
              ) : (
                <>
                  {quote.slice(0, at)}
                  <mark
                    className="rounded-sm bg-transparent bg-no-repeat text-inherit [box-decoration-break:clone]"
                    style={{
                      backgroundImage: `linear-gradient(${MARK}, ${MARK})`,
                      backgroundSize: entrance.shown || entrance.still ? "100% 100%" : "0% 100%",
                      transition: entrance.still ? "none" : "background-size 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                      transitionDelay: `${entrance.delay + 900}ms`,
                    }}
                  >
                    {highlight}
                  </mark>
                  {quote.slice(at + highlight.length)}
                </>
              )}
            </p>
          )}

          {person && (
            <div className={cn("flex items-center gap-3", quote && "mt-8")}>
              <img
                src={person.avatar.src}
                alt={person.avatar.alt}
                className="size-10 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-base">{person.name}</p>
                <p className="truncate text-sm text-muted-foreground">{person.company}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
