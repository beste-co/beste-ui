"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai51Props {
  title?: string;
  steps?: string[];
  answer?: string;
  stepMs?: number;
  bordered?: boolean;
  className?: string;
}

export const ai51Demo: Ai51Props = {
  title: "Reasoning",
  steps: [
    "Identify the customer segment behind the refund spike",
    "Check whether the pricing change overlaps the spike",
    "Weigh a targeted email against a pricing rollback",
  ],
  answer: "Send a clarifying email to annual plan customers first; roll back only if refunds stay high next week.",
  bordered: false,
};

export function Ai51({
  title = "Reasoning",
  steps = [],
  answer = "",
  stepMs = 650,
  bordered = false,
  className,
}: Ai51Props) {
  const [visible, setVisible] = useState(0);
  const total = steps.length + 1;

  useEffect(() => {
    if (visible >= total) return;
    const id = setTimeout(() => setVisible((v) => v + 1), stepMs);
    return () => clearTimeout(id);
  }, [visible, total, stepMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes ai51-in { from { opacity: 0; transform: translateY(0.375rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-2xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <span className="text-sm font-medium text-card-foreground">{title}</span>

        <ol className="flex flex-col">
          {steps.map((step, i) => {
            const shown = i < visible;
            return (
              <li key={i} className="relative flex gap-3 pb-4">
                <span
                  className={cn(
                    "absolute top-6 bottom-0 left-3 w-px origin-top -translate-x-1/2 bg-border transition-transform duration-500 ease-out motion-reduce:transition-none",
                    shown ? "scale-y-100" : "scale-y-0"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn("flex items-start gap-3", !shown && "invisible")}
                  style={shown ? { animation: "ai51-in 400ms ease-out" } : undefined}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-medium tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-snug text-card-foreground">
                    {step}
                  </span>
                </span>
              </li>
            );
          })}
          <li
            className={cn("flex items-start gap-3", visible <= steps.length && "invisible")}
            style={visible > steps.length ? { animation: "ai51-in 400ms ease-out" } : undefined}
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
              aria-hidden="true"
            >
              <Check className="size-3.5" />
            </span>
            <span className="min-w-0 pt-0.5 text-sm leading-snug text-card-foreground">{answer}</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
