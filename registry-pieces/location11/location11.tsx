"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "first" | "second";

interface Teammate {
  name: string;
  city: string;
  hours: string;
  avatar: { src: string; alt: string };
}

interface Location11Props {
  title?: string;
  /** Listed in the order the work passes between them, usually east to west. */
  people?: Teammate[];
  workingLabel?: string;
  doneLabel?: string;
  waitingLabel?: string;
  footnote?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const location11Demo: Location11Props = {
  title: "Thursday, one project",
  people: [
    {
      name: "Nina Simone",
      city: "Lisbon",
      hours: "9:00 to 17:00",
      avatar: {
        src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman with short hair under a blue sky",
      },
    },
    {
      name: "Otis Redding",
      city: "Toronto",
      hours: "10:00 to 18:00",
      avatar: {
        src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Smiling man in a floral shirt",
      },
    },
    {
      name: "Carole King",
      city: "Melbourne",
      hours: "8:30 to 16:30",
      avatar: {
        src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Laughing woman in a white top",
      },
    },
  ],
  workingLabel: "Working now",
  doneLabel: "Notes left",
  waitingLabel: "Picks up next",
  footnote: "Handed over in writing, no call needed",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "clear", clear: "first", first: "second", second: "rest" };
const HOLD: Record<Phase, number> = { rest: 4.5, clear: 0.9, first: 2.2, second: 2.2 };
const ACTIVE: Record<Phase, number> = { rest: 2, clear: -1, first: 0, second: 1 };

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

export function Location11({
  title,
  people = [],
  workingLabel,
  doneLabel,
  waitingLabel,
  footnote,
  framed = true,
  stepMs = 900,
  className,
}: Location11Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  /* The day moves down the list: each person works, leaves notes and the next one picks up. */
  const active = phase === "rest" ? Math.max(people.length - 1, 0) : Math.min(ACTIVE[phase], people.length - 1);

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes location11-pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.6); opacity: 0; } }
.location11-pulse { animation: location11-pulse 1600ms ease-out infinite; }
@media (prefers-reduced-motion: reduce) { .location11-pulse { animation: none; opacity: 0; } }
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
          {title && <p className="text-lg tracking-tight">{title}</p>}

          <ul className="mt-4 flex flex-col gap-1">
            {people.map((person, index) => {
              const working = index === active;
              const done = index < active;
              return (
                <li
                  key={index}
                  className={cn(
                    "-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-700 motion-reduce:transition-none",
                    working ? "bg-muted" : "bg-transparent"
                  )}
                >
                  <img
                    src={person.avatar.src}
                    alt={person.avatar.alt}
                    className={cn(
                      "size-10 shrink-0 rounded-md object-cover transition-opacity duration-700 motion-reduce:transition-none",
                      working ? "opacity-100" : "opacity-60"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{person.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {person.city}, <span className="tabular-nums">{person.hours}</span>
                    </p>
                  </div>
                  <span className="relative grid w-32 shrink-0 justify-items-end text-sm">
                    <span
                      className={cn(
                        "col-start-1 row-start-1 inline-flex items-center gap-2 text-foreground transition-opacity duration-500 motion-reduce:transition-none",
                        working ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <span className="relative flex size-2" aria-hidden="true">
                        <span className="location11-pulse absolute inset-0 rounded-full bg-primary" />
                        <span className="relative size-2 rounded-full bg-primary" />
                      </span>
                      {workingLabel}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1 inline-flex items-center gap-1.5 text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                        done ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      {doneLabel}
                    </span>
                    <span
                      className={cn(
                        "col-start-1 row-start-1 text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                        !working && !done ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {waitingLabel}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          {footnote && <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">{footnote}</p>}
        </div>
      </div>
    </div>
  );
}
