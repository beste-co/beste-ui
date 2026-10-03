"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai29Props {
  epoch?: number;
  totalEpochs?: number;
  step?: number;
  totalSteps?: number;
  loss?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const ai29Demo: Ai29Props = {
  epoch: 7,
  totalEpochs: 10,
  step: 1280,
  totalSteps: 2000,
  loss: 0.0421,
  tone: "primary",
  bordered: false,
};

export function Ai29({
  epoch = 1,
  totalEpochs = 10,
  step = 0,
  totalSteps = 1000,
  loss,
  tone = "primary",
  bordered = false,
  className,
}: Ai29Props) {
  const pct = Math.min(100, (step / totalSteps) * 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-medium text-card-foreground">
              Epoch
            </span>
            <span className="text-xs tabular-nums text-card-foreground">
              {epoch}/{totalEpochs}
            </span>
          </div>
          {typeof loss === "number" && (
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-muted-foreground">loss</span>
              <span className="text-xs tabular-nums font-semibold text-card-foreground">
                {loss.toFixed(4)}
              </span>
            </div>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              barClasses[tone]
            )}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          step {step.toLocaleString()}/{totalSteps.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
