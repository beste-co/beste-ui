"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "clear" | "wait" | "arrive";

interface Field {
  label: string;
  value: string;
}

interface Activity {
  title: string;
  time: string;
}

interface Dashboard39Props {
  contact?: { name: string; company: string; avatar: { src: string; alt: string } };
  fields?: Field[];
  /** The field that updates when the new activity lands, shown last in the row. */
  lastTouch?: { label: string; before: string; after: string };
  activityLabel?: string;
  /** The touch that arrives at the top of the timeline on every loop. */
  incoming?: Activity;
  activities?: Activity[];
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const dashboard39Demo: Dashboard39Props = {
  contact: {
    name: "Nina Simone",
    company: "Head of operations at Northwind",
    avatar: {
      src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with short hair under a blue sky",
    },
  },
  fields: [
    { label: "Stage", value: "Proposal" },
    { label: "Deal value", value: "$12,400" },
  ],
  lastTouch: { label: "Last touch", before: "6 days ago", after: "Just now" },
  activityLabel: "Recent activity",
  incoming: { title: "Opened your proposal", time: "Now" },
  activities: [
    { title: "Call with Otis about pricing", time: "Oct 24" },
    { title: "Sent the onboarding plan", time: "Oct 21" },
  ],
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = { rest: "clear", clear: "wait", wait: "arrive", arrive: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, clear: 0.9, wait: 0.8, arrive: 1.2 };

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

export function Dashboard39({
  contact,
  fields = [],
  lastTouch,
  activityLabel,
  incoming,
  activities = [],
  framed = true,
  stepMs = 800,
  className,
}: Dashboard39Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const landed = phase === "arrive" || phase === "rest";

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
          {contact && (
            <div className="flex items-center gap-3">
              <img src={contact.avatar.src} alt={contact.avatar.alt} className="size-10 shrink-0 rounded-md object-cover" />
              <div className="min-w-0">
                <p className="truncate text-lg tracking-tight">{contact.name}</p>
                <p className="truncate text-sm text-muted-foreground">{contact.company}</p>
              </div>
            </div>
          )}

          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-4">
            {fields.slice(0, lastTouch ? 2 : 3).map((field, index) => (
              <div key={index} className="min-w-0">
                <p className="truncate text-sm text-muted-foreground">{field.label}</p>
                <p className="mt-0.5 truncate text-base tabular-nums">{field.value}</p>
              </div>
            ))}
            {lastTouch && (
              <div className="min-w-0">
                <p className="truncate text-sm text-muted-foreground">{lastTouch.label}</p>
                <p className="relative mt-0.5 grid text-base">
                  <span
                    className={cn(
                      "col-start-1 row-start-1 truncate transition-opacity duration-500 motion-reduce:transition-none",
                      landed ? "opacity-0" : "opacity-100"
                    )}
                  >
                    {lastTouch.before}
                  </span>
                  <span
                    className={cn(
                      "col-start-1 row-start-1 truncate text-primary transition-opacity delay-300 duration-500 motion-reduce:transition-none",
                      landed ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {lastTouch.after}
                  </span>
                </p>
              </div>
            )}
          </div>

          <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">{activityLabel}</p>
          <div className="mt-1">
            {incoming && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-700 ease-out motion-reduce:transition-none",
                  landed ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 items-center gap-3 transition-transform duration-700 ease-out motion-reduce:transition-none",
                    landed ? "translate-y-0" : "-translate-y-2"
                  )}
                >
                  <span aria-hidden="true" className="relative flex size-2 shrink-0">
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full bg-primary",
                        phase === "arrive" && "dashboard39-ping"
                      )}
                    />
                    <span className="relative size-2 rounded-full bg-primary" />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-base">{incoming.title}</p>
                  <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{incoming.time}</p>
                </div>
              </div>
            )}
            {activities.map((activity, index) => (
              <div key={index} className="flex h-12 items-center gap-3">
                <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-muted-foreground/30" />
                <p className="min-w-0 flex-1 truncate text-base text-muted-foreground">{activity.title}</p>
                <p className="shrink-0 text-sm tabular-nums text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
@keyframes dashboard39-ping { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(3); opacity: 0; } }
.dashboard39-ping { animation: dashboard39-ping 1200ms ease-out 400ms both; }
@media (prefers-reduced-motion: reduce) { .dashboard39-ping { animation: none; opacity: 0; } }
`}</style>
    </div>
  );
}
