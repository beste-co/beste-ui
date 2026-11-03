"use client";

import { CalendarPlus } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "add" | "done";

interface Contact {
  name: string;
  detail: string;
  avatar: { src: string; alt: string };
  /** When the check-in is booked, as in "Tue 9:30"; rows with one get it on the calendar in turn. */
  followUp?: string;
}

interface Ai56Props {
  title?: string;
  contacts?: Contact[];
  summary?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const ai56Demo: Ai56Props = {
  title: "Customers to check in with",
  contacts: [
    {
      name: "Otis Redding",
      detail: "Replied yesterday",
      avatar: {
        src: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Smiling man in a floral shirt",
      },
    },
    {
      name: "Nina Simone",
      detail: "No reply in 6 days",
      followUp: "Tue 9:30",
      avatar: {
        src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman with short hair under a blue sky",
      },
    },
    {
      name: "Carole King",
      detail: "Meeting on Thursday",
      avatar: {
        src: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Laughing woman in a white top",
      },
    },
    {
      name: "Etta James",
      detail: "Trial ends in 3 days",
      followUp: "Tue 10:00",
      avatar: {
        src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
        alt: "Woman holding a coffee cup",
      },
    },
  ],
  summary: "2 check-ins added to Tuesday morning",
  framed: true,
  stepMs: 800,
};

/* Steps between one check-in landing and the next. */
const PER_SLOT = 0.9;

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "add", add: "done", done: "rest" };

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

export function Ai56({
  title,
  contacts = [],
  summary,
  framed = true,
  stepMs = 800,
  className,
}: Ai56Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();
  const booked = contacts.filter((contact) => contact.followUp).length;
  const addMs = booked * PER_SLOT * stepMs;

  useEffect(() => {
    const hold: Record<Phase, number> = { rest: 5 * stepMs, reset: 0.9 * stepMs, add: addMs + 600, done: 0.8 * stepMs };
    const id = setTimeout(() => setPhase(NEXT[phase]), hold[phase]);
    return () => clearTimeout(id);
  }, [phase, stepMs, addMs]);

  const adding = phase === "add";
  const finished = phase === "done" || phase === "rest";

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
          <p className="text-lg tracking-tight">{title}</p>

          <div className="mt-3">
            {contacts.map((contact, index) => {
              const order = contacts.slice(0, index).filter((c) => c.followUp).length;
              return (
                <div key={index} className="flex h-14 items-center gap-3 border-b border-border last:border-b-0">
                  <img src={contact.avatar.src} alt={contact.avatar.alt} className="size-8 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{contact.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{contact.detail}</p>
                  </div>
                  {contact.followUp && (
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-sm tabular-nums transition-all duration-500 ease-out motion-reduce:transition-none",
                        phase !== "reset" ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                      )}
                      style={{ transitionDelay: adding ? `${(order + 0.5) * PER_SLOT * stepMs}ms` : "0ms" }}
                    >
                      <CalendarPlus className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      {contact.followUp}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {summary && (
            <p
              className={cn(
                "mt-3 border-t border-border pt-4 text-sm text-muted-foreground transition-opacity duration-500 motion-reduce:transition-none",
                finished ? "opacity-100" : "opacity-0"
              )}
            >
              {summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
