"use client";

import { Route } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  distance: string;
  type: "start" | "turn" | "end";
}

interface Travel30Props {
  heading?: string;
  total?: string;
  steps?: Step[];
  className?: string;
}

export const travel30Demo: Travel30Props = {
  heading: "Drive · 42 min",
  total: "58 km · Tolls €3.20",
  steps: [
    {
      label: "Start · Hotel Alma Soho",
      distance: "0 km",
      type: "start",
    },
    {
      label: "Merge onto A1 North",
      distance: "4 km",
      type: "turn",
    },
    {
      label: "Exit 24 · Alcochete",
      distance: "36 km",
      type: "turn",
    },
    {
      label: "Arrive · Casa da Vinha",
      distance: "58 km",
      type: "end",
    },
  ],
};

export function Travel30({
  heading,
  total,
  steps = [],
  className,
}: Travel30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-sky-500/15 text-sky-500">
            <Route className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {heading && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {heading}
              </span>
            )}
            {total && (
              <span className="truncate text-xs text-muted-foreground">
                {total}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          {steps.map((s, idx) => (
            <div key={idx} className="relative flex items-start gap-3 pb-3 last:pb-0">
              {idx < steps.length - 1 && (
                <span
                  className="absolute bottom-0 left-2.5 top-6 w-px bg-border"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "mt-0.5 size-5 shrink-0 rounded-full border-2",
                  s.type === "start" &&
                    "border-emerald-500 bg-emerald-500",
                  s.type === "turn" && "border-sky-500 bg-card",
                  s.type === "end" && "border-rose-500 bg-rose-500"
                )}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-card-foreground">
                  {s.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {s.distance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
