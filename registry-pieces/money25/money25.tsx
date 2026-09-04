"use client";

import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Money25Props {
  label?: string;
  amount?: number;
  income?: number;
  spending?: number;
  durationMs?: number;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

export const money25Demo: Money25Props = {
  label: "Available balance",
  amount: 12480.5,
  income: 6240,
  spending: 1835.2,
  tone: "sky",
};

function money(value: number, fractionDigits = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function ease(x: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
}

export function Money25({
  label = "Balance",
  amount = 0,
  income = 0,
  spending = 0,
  durationMs = 1200,
  tone = "sky",
  className,
}: Money25Props) {
  const [elapsed, setElapsed] = useState(0);

  const statDelay = durationMs * 0.45;
  const statMs = durationMs * 0.9;
  const total = statDelay + 220 + statMs;

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      setElapsed(t);
      if (t < total) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [total]);

  const progress = ease(elapsed / durationMs);
  const done = elapsed >= durationMs;
  const whole = Math.floor(amount * progress);
  const cents = Math.round((amount - Math.floor(amount)) * 100);

  const stats = [
    { label: "Income", value: income, up: true, delay: statDelay },
    { label: "Spending", value: spending, up: false, delay: statDelay + 220 },
  ];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              tileClasses[tone]
            )}
            aria-hidden="true"
          >
            <Wallet className="size-4" />
          </span>
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>

        <div className="flex items-baseline text-card-foreground">
          <span className="sr-only">${money(amount, 2)}</span>
          <span
            className={cn(
              "mr-0.5 text-xl font-medium text-muted-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
              done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-40"
            )}
            aria-hidden="true"
          >
            $
          </span>
          <span
            className="text-4xl font-semibold tracking-tight tabular-nums"
            aria-hidden="true"
          >
            {money(whole)}
          </span>
          <span
            className={cn(
              "ml-0.5 text-xl font-medium tabular-nums text-muted-foreground transition-all duration-500 ease-out motion-reduce:transition-none",
              done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-40"
            )}
            aria-hidden="true"
          >
            .{String(cents).padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          {stats.map((item) => {
            const ratio = ease((elapsed - item.delay) / statMs);
            const started = elapsed >= item.delay;
            return (
              <div
                key={item.label}
                className={cn(
                  "flex flex-col gap-0.5 transition-all duration-300 ease-out motion-reduce:transition-none",
                  started ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                )}
              >
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  {item.up ? (
                    <ArrowDownLeft
                      className="size-3 text-emerald-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowUpRight
                      className="size-3 text-rose-500"
                      aria-hidden="true"
                    />
                  )}
                  {item.label}
                </span>
                <span className="text-sm font-medium tabular-nums text-card-foreground">
                  ${money(item.value * ratio, 2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
