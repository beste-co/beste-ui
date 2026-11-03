"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "wait" | "pick" | "leave" | "shift" | "arrive";

interface Ticket {
  subject: string;
  customer: string;
  /** Seconds the ticket has already waited when the piece mounts. */
  waitSeconds: number;
}

interface Monitoring25Props {
  title?: string;
  tickets?: Ticket[];
  agent?: { name: string; avatar: { src: string; alt: string } };
  /** Timers at or past this many seconds turn amber. */
  warnAfter?: number;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const monitoring25Demo: Monitoring25Props = {
  title: "Waiting for a first reply",
  tickets: [
    { subject: "Can't export last month's report", customer: "Ray Charles", waitSeconds: 252 },
    { subject: "Password reset link expired", customer: "Patti Smith", waitSeconds: 158 },
    { subject: "Change the billing email", customer: "Bill Withers", waitSeconds: 47 },
    { subject: "Add 2 seats to our plan", customer: "Aretha Franklin", waitSeconds: 4 },
  ],
  agent: {
    name: "Ella Fitzgerald",
    avatar: {
      src: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman holding a coffee cup",
    },
  },
  warnAfter: 240,
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = {
  wait: "pick",
  pick: "leave",
  leave: "shift",
  shift: "arrive",
  arrive: "wait",
};

/* How long each phase lasts, in steps. */
const HOLD: Record<Phase, number> = {
  wait: 3.2,
  pick: 1.6,
  leave: 0.8,
  shift: 1.1,
  arrive: 0.8,
};

const VISIBLE = 3;
const ROW_REM = 4;

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

function formatWait(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* Tickets rotate through fixed slots: the top one is picked up and leaves, the rest move up, and the next arrives below. */
export function Monitoring25({
  title,
  tickets = [],
  agent,
  warnAfter = 240,
  framed = true,
  stepMs = 900,
  className,
}: Monitoring25Props) {
  const count = tickets.length;
  const visible = Math.min(count, VISIBLE);
  const [phase, setPhase] = useState<Phase>("wait");
  const [offset, setOffset] = useState(0);
  const [seconds, setSeconds] = useState<number[]>(() => tickets.map((ticket) => ticket.waitSeconds));
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setInterval(() => setSeconds((prev) => prev.map((value) => value + 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (count < 2) return;
    const id = setTimeout(() => {
      const next = NEXT[phase];
      if (next === "shift") {
        const departed = offset % count;
        setSeconds((prev) => prev.map((value, index) => (index === departed ? 0 : value)));
        setOffset(offset + 1);
      }
      setPhase(next);
    }, HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, offset, count, stepMs]);

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
        <div className="rounded-lg bg-card px-5 pb-1 pt-5 text-card-foreground shadow-xs">
          {title && <p className="border-b border-border pb-4 text-lg font-normal tracking-tight">{title}</p>}
          <ul className="relative overflow-hidden" style={{ height: `${visible * ROW_REM}rem` }}>
            {tickets.map((ticket, index) => {
              const slot = (((index - offset) % count) + count) % count;
              const leaving = phase === "leave" && slot === 0;
              const hidden = slot >= visible || (phase === "shift" && slot >= visible - 1);
              const picked = slot === 0 && (phase === "pick" || phase === "leave");
              const wait = seconds[index] ?? ticket.waitSeconds;
              return (
                <li
                  key={index}
                  className={cn(
                    "absolute inset-x-0 top-0 flex h-16 items-center gap-4 border-t transition-all duration-700 ease-out motion-reduce:transition-none",
                    slot === 0 ? "border-transparent" : "border-border",
                    hidden || leaving ? "opacity-0" : "opacity-100"
                  )}
                  style={{
                    transform: `translate(${leaving ? 1.5 : 0}rem, ${slot * ROW_REM + (hidden ? 0.5 : 0)}rem)`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base">{ticket.subject}</p>
                    <p className="truncate text-sm text-muted-foreground">{ticket.customer}</p>
                  </div>
                  <div className="relative h-8 w-36 shrink-0">
                    <span
                      className={cn(
                        "absolute inset-y-0 right-0 flex items-center text-sm tabular-nums transition-opacity duration-300 motion-reduce:transition-none",
                        wait >= warnAfter ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
                        picked ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {formatWait(wait)}
                    </span>
                    {agent && (
                      <span
                        className={cn(
                          "absolute inset-y-0 right-0 flex max-w-full items-center gap-2 transition-all duration-300 ease-out motion-reduce:transition-none",
                          picked ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
                        )}
                      >
                        <img
                          src={agent.avatar.src}
                          alt={agent.avatar.alt}
                          className="size-7 shrink-0 rounded-md object-cover"
                        />
                        <span className="truncate text-sm">{agent.name}</span>
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
