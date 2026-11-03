"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "suggest" | "approach" | "press" | "sent";

interface Chat43Props {
  client?: { name: string; avatar?: { src: string; alt: string } };
  time?: string;
  message?: string;
  suggestionLabel?: string;
  slots?: string[];
  /** The slot the cursor picks. */
  chosenIndex?: number;
  reply?: string;
  sentLabel?: string;
  cursorLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const chat43Demo: Chat43Props = {
  client: {
    name: "Nina Simone",
    avatar: {
      src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "Woman with short hair against a blue sky",
    },
  },
  time: "8:12 AM",
  message: "Could I move my Tuesday class to Friday this week?",
  suggestionLabel: "Open on Friday",
  slots: ["7:30 AM", "12:15 PM", "6:00 PM"],
  chosenIndex: 2,
  reply: "Done. You're in the 6:00 PM flow on Friday.",
  sentLabel: "Calendar updated",
  framed: true,
  stepMs: 800,
};

const NEXT: Record<Phase, Phase> = {
  rest: "reset",
  reset: "suggest",
  suggest: "approach",
  approach: "press",
  press: "sent",
  sent: "rest",
};
const HOLD: Record<Phase, number> = { rest: 4, reset: 1, suggest: 1.4, approach: 1.2, press: 0.4, sent: 1 };

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

export function Chat43({
  client,
  time,
  message,
  suggestionLabel,
  slots = [],
  chosenIndex = 0,
  reply,
  sentLabel,
  cursorLabel,
  framed = true,
  stepMs = 800,
  className,
}: Chat43Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const suggested = phase !== "reset";
  const picked = phase === "press" || phase === "sent" || phase === "rest";
  const sent = phase === "sent" || phase === "rest";
  const onSlot = phase === "approach" || phase === "press";

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
          {client && (
            <div className="flex items-center gap-3">
              {client.avatar ? (
                <img src={client.avatar.src} alt={client.avatar.alt} className="size-10 shrink-0 rounded-md object-cover" />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-base" aria-hidden="true">
                  {client.name.charAt(0)}
                </span>
              )}
              <p className="min-w-0 flex-1 truncate text-lg tracking-tight">{client.name}</p>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{time}</span>
            </div>
          )}

          <p className="mt-5 max-w-xs rounded-lg bg-muted px-4 py-3 text-base">{message}</p>

          <div
            className={cn(
              "mt-5 transition-all duration-500 ease-out motion-reduce:transition-none",
              suggested ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            )}
          >
            <p className="text-sm text-muted-foreground">{suggestionLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((slot, index) => {
                const isChosen = index === chosenIndex;
                return (
                  <div key={index} className="relative">
                    <span
                      className={cn(
                        "inline-flex h-9 items-center rounded-md border px-3 text-sm tabular-nums transition-all duration-300 motion-reduce:transition-none",
                        isChosen && picked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground",
                        isChosen && phase === "press" && "scale-95"
                      )}
                    >
                      {slot}
                    </span>
                    {isChosen && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 z-10 transition-transform duration-700 ease-out motion-reduce:transition-none"
                        style={{ transform: onSlot ? "translate(0.5rem, 0.25rem)" : "translate(-2.5rem, 3.25rem)" }}
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* The reply keeps its space so the card never changes height. */}
          <div
            className={cn(
              "mt-5 flex flex-col items-end gap-2 transition-all duration-500 ease-out motion-reduce:transition-none",
              sent ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
          >
            <p className="max-w-xs rounded-lg bg-primary px-4 py-3 text-base text-primary-foreground">{reply}</p>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              {sentLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
