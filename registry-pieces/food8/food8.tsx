"use client";

import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "rose"
  | "amber"
  | "emerald"
  | "sky"
  | "violet";

interface Food8Props {
  step?: string;
  instruction?: string;
  stepIndex?: number;
  totalSteps?: number;
  minutes?: number;
  seconds?: number;
  tone?: Tone;
  className?: string;
}

const pillClasses: Record<Tone, string> = {
  neutral: "bg-muted text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  rose: "bg-rose-500 text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

const iconClasses: Record<Tone, string> = {
  neutral: "text-card-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  rose: "text-rose-500",
  amber: "text-amber-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

export const food8Demo: Food8Props = {
  step: "Simmer the sauce",
  instruction:
    "Keep at a gentle simmer, stirring every two minutes so the garlic doesn't scorch.",
  stepIndex: 4,
  totalSteps: 7,
  minutes: 7,
  seconds: 42,
  tone: "rose",
};

export function Food8({
  step,
  instruction,
  stepIndex = 1,
  totalSteps = 1,
  minutes = 0,
  seconds = 0,
  tone = "rose",
  className,
}: Food8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              pillClasses[tone]
            )}
          >
            Step {stepIndex} / {totalSteps}
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-card-foreground">
            <Timer
              className={cn("size-3.5", iconClasses[tone])}
              aria-hidden="true"
            />
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </span>
        </div>
        {step && (
          <span className="text-sm font-semibold text-card-foreground">
            {step}
          </span>
        )}
        {instruction && (
          <p className="text-xs leading-snug text-muted-foreground">
            {instruction}
          </p>
        )}
        <div
          className="h-1 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${(stepIndex / Math.max(1, totalSteps)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
