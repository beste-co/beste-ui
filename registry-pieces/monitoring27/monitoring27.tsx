"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "alert" | "approach" | "press" | "ack" | "resolve";

type EventTone = "down" | "investigating" | "resolved";

interface IncidentEvent {
  label: string;
  time: string;
  tone: EventTone;
}

interface Monitoring27Props {
  service?: string;
  downLabel?: string;
  investigatingLabel?: string;
  resolvedLabel?: string;
  /** Three events, revealed as the alert lands, is acknowledged and resolves. */
  events?: IncidentEvent[];
  onCall?: { name: string; avatar: { src: string; alt: string } };
  onCallLabel?: string;
  /** Button the cursor presses; it turns into `acknowledgedLabel`. */
  acknowledgeLabel?: string;
  acknowledgedLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const monitoring27Demo: Monitoring27Props = {
  service: "Checkout API",
  downLabel: "Down",
  investigatingLabel: "Investigating",
  resolvedLabel: "Resolved",
  events: [
    { label: "Failing from 4 of 12 regions", time: "9:41 AM", tone: "down" },
    { label: "Acknowledged by Carole", time: "9:42 AM", tone: "investigating" },
    { label: "Recovered everywhere", time: "9:45 AM", tone: "resolved" },
  ],
  onCall: {
    name: "Carole King",
    avatar: {
      src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with short hair under a blue sky",
    },
  },
  onCallLabel: "On call",
  acknowledgeLabel: "Acknowledge",
  acknowledgedLabel: "Acknowledged",
  cursorLabel: "Carole",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "alert",
  alert: "approach",
  approach: "press",
  press: "ack",
  ack: "resolve",
  resolve: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4, reset: 1, alert: 1.6, approach: 1.2, press: 0.4, ack: 1.8, resolve: 1 };

/* How many timeline events are visible in each phase. */
const SHOWN: Record<Phase, number> = { rest: 3, reset: 0, alert: 1, approach: 1, press: 1, ack: 2, resolve: 3 };

const DOT: Record<EventTone, string> = {
  down: "bg-rose-500",
  investigating: "bg-amber-500",
  resolved: "bg-emerald-500",
};

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
export function Monitoring27({
  service,
  downLabel,
  investigatingLabel,
  resolvedLabel,
  events = [],
  onCall,
  onCallLabel,
  acknowledgeLabel,
  acknowledgedLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Monitoring27Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const down = phase === "alert" || phase === "approach" || phase === "press";
  const investigating = phase === "ack";
  const resolved = phase === "resolve" || phase === "rest";
  const acknowledged = investigating || resolved;
  const onButton = phase === "approach" || phase === "press";
  const shown = SHOWN[phase];

  const pills = [
    { show: down, label: downLabel, className: "bg-rose-500/10 text-rose-700 dark:text-rose-400", dot: "monitoring27-pulse bg-rose-500" },
    { show: investigating, label: investigatingLabel, className: "bg-amber-500/10 text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
    { show: resolved, label: resolvedLabel, className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  ];

  return (
    <div ref={outer} className={cn("relative flex size-full min-h-0 min-w-0 items-center justify-center p-4", className)}>
      <style>{`
@keyframes monitoring27-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.monitoring27-pulse { animation: monitoring27-pulse 1400ms ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .monitoring27-pulse { animation: none; } }
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
          <div className="flex items-center justify-between gap-4">
            <p className="truncate text-lg tracking-tight">{service}</p>
            {/* The three states share one slot, so the row never shifts. */}
            <span className="grid shrink-0 justify-items-end">
              {pills.map((pill, index) => (
                <span
                  key={index}
                  className={cn(
                    "col-start-1 row-start-1 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-sm transition-opacity duration-500",
                    pill.className,
                    pill.show ? "opacity-100" : "opacity-0"
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", pill.dot)} aria-hidden="true" />
                  {pill.label}
                </span>
              ))}
            </span>
          </div>

          <ul className="mt-5 flex flex-col gap-3.5 border-t border-border pt-5">
            {events.map((event, index) => (
              <li
                key={index}
                className={cn(
                  "flex items-center gap-3 transition-all duration-500 ease-out motion-reduce:transition-none",
                  index < shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                )}
              >
                <span className={cn("size-2 shrink-0 rounded-full", DOT[event.tone])} aria-hidden="true" />
                <span className="flex-1 truncate text-base">{event.label}</span>
                <span className="text-sm tabular-nums text-muted-foreground">{event.time}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
            {onCall && (
              <img src={onCall.avatar.src} alt={onCall.avatar.alt} className="size-10 shrink-0 rounded-md object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-base">{onCall?.name}</p>
              <p className="truncate text-sm text-muted-foreground">{onCallLabel}</p>
            </div>
            <div className="relative shrink-0">
              <span
                className={cn(
                  "grid h-9 items-center rounded-md px-4 text-sm transition-all duration-300",
                  acknowledged ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
                  phase === "reset" && "opacity-40",
                  phase === "press" && "scale-95 bg-primary/85"
                )}
              >
                <span
                  className={cn(
                    "col-start-1 row-start-1 text-center transition-opacity duration-300",
                    acknowledged ? "opacity-0" : "opacity-100"
                  )}
                >
                  {acknowledgeLabel}
                </span>
                <span
                  className={cn(
                    "col-start-1 row-start-1 text-center transition-opacity duration-300",
                    acknowledged ? "opacity-100" : "opacity-0"
                  )}
                >
                  {acknowledgedLabel}
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
      </div>
    </div>
  );
}
