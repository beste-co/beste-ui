"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  state: "done" | "current" | "pending";
}

interface Nav24Props {
  steps?: Step[];
  className?: string;
}

export const nav24Demo: Nav24Props = {
  steps: [
    { label: "Account", state: "done" },
    { label: "Team", state: "done" },
    { label: "Billing", state: "current" },
    { label: "Done", state: "pending" },
  ],
};

export function Nav24({ steps = [], className }: Nav24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-between">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-1 items-center gap-2 text-xs"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                step.state === "done" &&
                  "border-emerald-500 bg-emerald-500 text-white",
                step.state === "current" &&
                  "border-primary bg-primary text-primary-foreground",
                step.state === "pending" &&
                  "border-border bg-card text-muted-foreground"
              )}
            >
              {step.state === "done" ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : step.state === "current" ? (
                <Circle className="size-2 fill-current" aria-hidden="true" />
              ) : (
                <span className="font-mono">{idx + 1}</span>
              )}
            </span>
            <span
              className={cn(
                "truncate font-medium",
                step.state === "current"
                  ? "text-card-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <span
                className={cn(
                  "h-px flex-1",
                  step.state === "done" ? "bg-emerald-500" : "bg-border"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
