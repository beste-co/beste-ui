"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  done?: boolean;
}

interface Progress15Props {
  title?: string;
  steps?: Step[];
  className?: string;
}

export const progress15Demo: Progress15Props = {
  title: "Clinic setup",
  steps: [
    { label: "Create your workspace", done: true },
    { label: "Import member records", done: true },
    { label: "Connect billing account", done: true },
    { label: "Invite your team", done: false },
    { label: "Publish booking page", done: false },
  ],
};

export function Progress15({
  title = "Setup",
  steps = [],
  className,
}: Progress15Props) {
  const done = steps.filter((step) => step.done).length;
  const total = steps.length || 1;
  const percent = Math.round((done / total) * 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-base font-semibold text-card-foreground">{title}</p>
          <span className="text-sm text-muted-foreground">
            {done}/{steps.length}
          </span>
        </div>
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full",
                  step.done
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-transparent"
                )}
                aria-hidden="true"
              >
                {step.done && <Check className="size-3" />}
              </span>
              <span
                className={cn(
                  "text-sm",
                  step.done
                    ? "text-muted-foreground line-through"
                    : "text-card-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
