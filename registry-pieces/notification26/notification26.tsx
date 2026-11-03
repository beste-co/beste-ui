"use client";

import { Check, Flag } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "seeing";

interface Person {
  name: string;
  avatar: { src: string; alt: string };
}

interface Notification26Props {
  title?: string;
  meta?: string;
  time?: string;
  /** Shown before the count, as in "Seen by 2 of 4". */
  seenLabel?: string;
  ofLabel?: string;
  allSeenLabel?: string;
  /** Everyone the decision went to, in the order they open it. */
  people?: Person[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const notification26Demo: Notification26Props = {
  title: "Annual plans get 2 months free",
  meta: "Decision logged by Norah Jones",
  time: "Now",
  seenLabel: "Seen by",
  ofLabel: "of",
  allSeenLabel: "Everyone has seen it",
  people: [
    {
      name: "Bill Withers",
      avatar: {
        src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Smiling man in a floral shirt",
      },
    },
    {
      name: "Carole King",
      avatar: {
        src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Laughing woman in a white top",
      },
    },
    {
      name: "Sade Adu",
      avatar: {
        src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman with short hair under a blue sky",
      },
    },
  ],
  framed: true,
  stepMs: 900,
};

const HOLD: Record<Phase, number> = { rest: 4.5, reset: 1.2, seeing: 0.8 };

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

export function Notification26({
  title,
  meta,
  time,
  seenLabel,
  ofLabel,
  allSeenLabel,
  people = [],
  framed = true,
  stepMs = 900,
  className,
}: Notification26Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  /* How many people have opened it; ticks up one at a time during "seeing". */
  const [seen, setSeen] = useState(people.length);
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => {
      if (phase === "rest") {
        setSeen(0);
        setPhase("reset");
      } else if (phase === "reset") {
        setPhase(people.length > 0 ? "seeing" : "rest");
      } else if (seen < people.length) {
        setSeen(seen + 1);
      } else {
        setPhase("rest");
      }
    }, HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, seen, people.length, stepMs]);

  const everyone = people.length > 0 && seen >= people.length;

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
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Flag className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-lg leading-snug tracking-tight">{title}</p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{meta}</p>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">{time}</span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5">
            <div className="flex -space-x-1.5">
              {people.map((person, index) => {
                const opened = index < seen;
                return (
                  <img
                    key={index}
                    src={person.avatar.src}
                    alt={person.avatar.alt}
                    title={person.name}
                    className={cn(
                      "size-9 rounded-md object-cover ring-2 ring-card transition-all duration-500 ease-out motion-reduce:transition-none",
                      opened ? "translate-y-0 grayscale-0" : "translate-y-0.5 grayscale"
                    )}
                  />
                );
              })}
            </div>
            <span className="relative grid text-right text-sm">
              <span
                className={cn(
                  "col-start-1 row-start-1 tabular-nums text-muted-foreground transition-opacity duration-300",
                  everyone ? "opacity-0" : "opacity-100"
                )}
              >
                {seenLabel} {seen} {ofLabel} {people.length}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex items-center justify-end gap-1.5 text-emerald-700 transition-opacity duration-300 dark:text-emerald-400",
                  everyone ? "opacity-100" : "opacity-0"
                )}
              >
                <Check className="size-3.5" aria-hidden="true" />
                {allSeenLabel}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
