"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "done" | "running" | "pending";

interface StepItem {
  label: string;
  status: StepStatus;
}

interface Terminal6Props {
  steps?: StepItem[];
  className?: string;
}

export const terminal6Demo: Terminal6Props = {
  steps: [
    { label: "Compiling modules", status: "done" },
    { label: "Bundling assets", status: "done" },
    { label: "Optimizing output", status: "running" },
    { label: "Publishing build", status: "pending" },
  ],
};

const labelClasses: Record<StepStatus, string> = {
  done: "text-zinc-400",
  running: "text-zinc-50",
  pending: "text-zinc-600",
};

export function Terminal6({ steps = [], className }: Terminal6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs shadow-sm">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            {step.status === "done" && (
              <Check
                className="size-3.5 shrink-0 text-emerald-400"
                aria-hidden="true"
              />
            )}
            {step.status === "running" && (
              <Loader2
                className="size-3.5 shrink-0 animate-spin text-zinc-300"
                aria-hidden="true"
              />
            )}
            {step.status === "pending" && (
              <Circle
                className="size-3.5 shrink-0 text-zinc-700"
                aria-hidden="true"
              />
            )}
            <span className={cn("truncate", labelClasses[step.status])}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
