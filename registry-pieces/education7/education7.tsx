"use client";

import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "done" | "current" | "locked";

interface Step {
  title: string;
  status: StepStatus;
}

interface Education7Props {
  title?: string;
  steps?: Step[];
  bordered?: boolean;
  className?: string;
}

export const education7Demo: Education7Props = {
  steps: [
    { title: "Foundations", status: "done" },
    { title: "Patterns & hooks", status: "done" },
    { title: "Performance tuning", status: "current" },
    { title: "Shipping at scale", status: "locked" },
  ],
  bordered: false,
};

export function Education7({
  title,
  steps = [],
  bordered = false,
  className,
}: Education7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {title && (
          <span className="text-xs font-semibold text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div key={idx} className="relative flex items-center gap-2">
                <div className="relative flex flex-col items-center self-stretch">
                  {step.status === "done" ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                  ) : step.status === "current" ? (
                    <span className="flex size-6 items-center justify-center rounded-full border-2 border-primary bg-card text-primary">
                      <span
                        className="size-2 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                    </span>
                  ) : (
                    <span className="flex size-6 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                      <Lock className="size-3" aria-hidden="true" />
                    </span>
                  )}
                  {!isLast && (
                    <span
                      className={cn(
                        "w-px flex-1",
                        step.status === "done"
                          ? "bg-emerald-500"
                          : "bg-border"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className={cn("flex-1", !isLast && "pb-2")}>
                  <span
                    className={cn(
                      "text-sm",
                      step.status === "locked"
                        ? "text-muted-foreground"
                        : step.status === "current"
                          ? "font-semibold text-card-foreground"
                          : "font-medium text-card-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
