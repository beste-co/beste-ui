"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

interface Progress1Props {
  steps?: Step[];
  current?: number;
  className?: string;
}

export const progress1Demo: Progress1Props = {
  steps: [
    { label: "Account" },
    { label: "Plan" },
    { label: "Payment" },
    { label: "Done" },
  ],
  current: 2,
};

export function Progress1({
  steps = [],
  current = 0,
  className,
}: Progress1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center justify-between">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={index}
              className={cn(
                "relative flex flex-col items-center gap-1",
                !isLast && "flex-1"
              )}
            >
              <div className="flex w-full items-center">
                <div
                  className={cn(
                    "z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                    isDone && "border-emerald-500 bg-emerald-500 text-white",
                    isCurrent &&
                      "border-emerald-500 bg-card text-emerald-600 dark:text-emerald-400",
                    !isDone &&
                      !isCurrent &&
                      "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isDone ? (
                    <Check className="size-3" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      isDone ? "bg-emerald-500" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={cn(
                  "absolute top-7 whitespace-nowrap text-xs font-medium",
                  isDone || isCurrent
                    ? "text-card-foreground"
                    : "text-muted-foreground",
                  index === 0 && "left-0",
                  isLast && "right-0",
                  index !== 0 &&
                    !isLast &&
                    "left-3 -translate-x-1/2"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
