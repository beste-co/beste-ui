"use client";

import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Phase = "rest" | "reset" | "rise";

interface ServiceUptime {
  name: string;
  uptime: string;
  /** Day indexes, oldest first, drawn as amber bars. */
  degraded?: number[];
}

interface Browser40Props {
  url?: string;
  heading?: string;
  services?: ServiceUptime[];
  /** Number of daily bars per service. */
  days?: number;
  startLabel?: string;
  endLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient. */
  framed?: boolean;
  stepMs?: number;
  className?: string;
}

export const browser40Demo: Browser40Props = {
  url: "status.northwind.com",
  heading: "All systems operational",
  services: [
    { name: "Website", uptime: "100%", degraded: [] },
    { name: "Checkout API", uptime: "99.96%", degraded: [21] },
    { name: "Webhooks", uptime: "99.99%", degraded: [8] },
  ],
  days: 30,
  startLabel: "30 days ago",
  endLabel: "Today",
  framed: true,
  stepMs: 900,
};

const NEXT: Record<Phase, Phase> = { rest: "reset", reset: "rise", rise: "rest" };
const HOLD: Record<Phase, number> = { rest: 5, reset: 0.9, rise: 2.4 };

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
export function Browser40({
  url,
  heading,
  services = [],
  days = 30,
  startLabel,
  endLabel,
  framed = true,
  stepMs = 900,
  className,
}: Browser40Props) {
  const [phase, setPhase] = useState<Phase>("rest");
  const { outer, inner, scale, entrance } = useFitScale();

  useEffect(() => {
    const id = setTimeout(() => setPhase(NEXT[phase]), HOLD[phase] * stepMs);
    return () => clearTimeout(id);
  }, [phase, stepMs]);

  const up = phase !== "reset";
  const settled = phase === "rest";

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
        <div className="overflow-hidden rounded-lg bg-card text-card-foreground shadow-xs">
          <div className="flex items-center gap-3 border-b border-border bg-muted px-3 py-2">
            <span className="flex gap-1" aria-hidden="true">
              <span className="size-2 rounded-full bg-foreground/15" />
              <span className="size-2 rounded-full bg-foreground/15" />
              <span className="size-2 rounded-full bg-foreground/15" />
            </span>
            <span className="flex-1 truncate rounded-md bg-card px-3 py-0.5 text-center text-sm text-muted-foreground">
              {url}
            </span>
          </div>

          <div className="px-5 py-5">
            <div className="flex items-center gap-3">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
                aria-hidden="true"
              >
                <Check className="size-3.5" />
              </span>
              <p className="text-lg tracking-tight">{heading}</p>
            </div>

            <ul className="mt-5 flex flex-col gap-5 border-t border-border pt-5">
              {services.map((service, row) => (
                <li key={row}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="truncate text-base">{service.name}</span>
                    <span
                      className={cn(
                        "text-sm tabular-nums text-muted-foreground transition-opacity duration-500",
                        settled ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {service.uptime}
                    </span>
                  </div>
                  <div className="mt-2 flex h-6 items-end gap-0.5" aria-hidden="true">
                    {Array.from({ length: days }, (_, day) => (
                      <span
                        key={day}
                        className={cn(
                          "h-full flex-1 origin-bottom rounded-xs transition-transform ease-out motion-reduce:transition-none",
                          service.degraded?.includes(day) ? "bg-amber-400" : "bg-emerald-500/70"
                        )}
                        style={{
                          transform: `scaleY(${up ? 1 : 0.15})`,
                          transitionDuration: up ? "600ms" : "300ms",
                          transitionDelay: up ? `${row * 120 + day * 22}ms` : "0ms",
                        }}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between text-sm text-muted-foreground">
              <span>{startLabel}</span>
              <span>{endLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
