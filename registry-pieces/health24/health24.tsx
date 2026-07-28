"use client";

import { AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Allergy {
  name: string;
  reaction: string;
  severity: "low" | "high";
}

interface Health24Props {
  title?: string;
  allergies?: Allergy[];
  className?: string;
}

export const health24Demo: Health24Props = {
  title: "Known allergies",
  allergies: [
    {
      name: "Penicillin",
      reaction: "Hives, rash",
      severity: "high",
    },
    {
      name: "Shellfish",
      reaction: "GI upset",
      severity: "low",
    },
    {
      name: "Pollen · grass",
      reaction: "Congestion, sneezing",
      severity: "low",
    },
  ],
};

export function Health24({
  title,
  allergies = [],
  className,
}: Health24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-rose-500 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <AlertOctagon
            className="size-4 text-rose-500"
            aria-hidden="true"
          />
          {title && (
            <span className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
              {title}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {allergies.map((a, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 py-1.5 text-sm"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold text-card-foreground">
                  {a.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {a.reaction}
                </span>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                  a.severity === "high"
                    ? "bg-rose-500 text-white"
                    : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                )}
              >
                {a.severity === "high" ? "Severe" : "Mild"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
