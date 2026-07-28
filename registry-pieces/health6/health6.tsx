"use client";

import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Health6Props {
  filled?: number;
  total?: number;
  mlPerCup?: number;
  label?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const cupFillClasses: Record<Tone, string> = {
  neutral: "border-foreground bg-foreground",
  primary: "border-primary bg-primary",
  foreground: "border-foreground bg-foreground",
  sky: "border-sky-500 bg-sky-500",
  emerald: "border-emerald-500 bg-emerald-500",
  violet: "border-violet-500 bg-violet-500",
  amber: "border-amber-500 bg-amber-500",
  rose: "border-rose-500 bg-rose-500",
};

export const health6Demo: Health6Props = {
  filled: 5,
  total: 8,
  mlPerCup: 250,
  label: "Water",
  tone: "sky",
};

export function Health6({
  filled = 0,
  total = 8,
  mlPerCup = 250,
  label = "Water",
  tone = "sky",
  className,
}: Health6Props) {
  const clamped = Math.max(0, Math.min(total, filled));
  const totalMl = clamped * mlPerCup;
  const goalMl = total * mlPerCup;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              iconClasses[tone]
            )}
          >
            <Droplet className="size-4 fill-current" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <span className="text-xs text-muted-foreground">
              {totalMl} / {goalMl} ml
            </span>
          </div>
          <span className="font-mono text-sm font-semibold text-card-foreground">
            {clamped} / {total}
          </span>
        </div>
        <div className="flex items-end gap-1" aria-hidden="true">
          {Array.from({ length: total }).map((_, idx) => {
            const isFilled = idx < clamped;
            return (
              <div
                key={idx}
                className={cn(
                  "h-8 flex-1 rounded-md border",
                  isFilled
                    ? cupFillClasses[tone]
                    : "border-border bg-muted"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
