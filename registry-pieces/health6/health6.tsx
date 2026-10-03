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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
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
  tone: "primary",
  bordered: false,
};

export function Health6({
  filled = 0,
  total = 8,
  mlPerCup = 250,
  label = "Water",
  tone = "primary",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Droplet
            className={cn("size-5 shrink-0 fill-current", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-muted-foreground">
              {label}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {totalMl} / {goalMl} ml
            </span>
          </div>
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
