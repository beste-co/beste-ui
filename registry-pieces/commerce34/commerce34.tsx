"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Stop {
  label: string;
  time: string;
}

interface Commerce34Props {
  orderLabel?: string;
  stops?: Stop[];
  stepMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const nodeClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const lineClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const commerce34Demo: Commerce34Props = {
  orderLabel: "Order 4821",
  stops: [
    { label: "Ordered", time: "Mon 09:12" },
    { label: "Packed", time: "Mon 14:40" },
    { label: "Shipped", time: "Tue 08:05" },
    { label: "Out for delivery", time: "Wed 07:30" },
    { label: "Delivered", time: "Wed 11:52" },
  ],
  tone: "emerald",
};

export function Commerce34({
  orderLabel = "Order",
  stops = [],
  stepMs = 1300,
  holdMs = 2800,
  tone = "emerald",
  className,
}: Commerce34Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (stops.length < 2) return;
    const last = active >= stops.length - 1;
    const id = setTimeout(
      () => setActive((a) => (last ? 0 : a + 1)),
      last ? holdMs : stepMs
    );
    return () => clearTimeout(id);
  }, [active, stops.length, stepMs, holdMs]);

  const delivered = active === stops.length - 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{orderLabel}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium transition-colors duration-300",
              delivered
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {delivered ? "Delivered" : "In transit"}
          </span>
        </div>

        <ol className="flex flex-col">
          {stops.map((stop, i) => {
            const lit = i <= active;
            const isCurrent = i === active;
            const isLast = i === stops.length - 1;
            return (
              <li key={stop.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "relative flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 motion-reduce:transition-none",
                      i > 0 && "delay-300",
                      lit ? nodeClasses[tone] : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCurrent && !delivered && (
                      <span
                        className={cn(
                          "absolute inset-0 animate-ping rounded-full opacity-40 motion-reduce:animate-none",
                          lineClasses[tone]
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {lit ? (
                      <Check className="relative size-3" aria-hidden="true" />
                    ) : (
                      <span
                        className="size-1.5 rounded-full bg-muted-foreground/50"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {!isLast && (
                    <span
                      className="relative my-0.5 w-0.5 flex-1 rounded-full bg-muted"
                      aria-hidden="true"
                    >
                      <span
                        className={cn(
                          "absolute inset-0 origin-top rounded-full transition-transform duration-500 ease-out motion-reduce:transition-none",
                          lineClasses[tone],
                          i < active ? "scale-y-100" : "scale-y-0"
                        )}
                      />
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    "flex min-w-0 flex-1 items-baseline justify-between gap-2",
                    !isLast && "pb-4"
                  )}
                >
                  <span
                    className={cn(
                      "truncate text-sm transition-colors duration-300",
                      lit
                        ? "font-medium text-card-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {stop.label}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs tabular-nums text-muted-foreground transition-opacity duration-500 delay-300 motion-reduce:transition-none",
                      lit ? "opacity-100" : "opacity-0"
                    )}
                  >
                    {stop.time}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
