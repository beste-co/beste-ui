"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Health22Props {
  symptom?: string;
  severity?: "mild" | "moderate" | "severe";
  startedAt?: string;
  notes?: string;
  className?: string;
}

const sevConfig = {
  mild: {
    label: "Mild",
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  moderate: {
    label: "Moderate",
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  severe: {
    label: "Severe",
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  },
};

export const health22Demo: Health22Props = {
  symptom: "Headache · behind the eyes",
  severity: "moderate",
  startedAt: "Started Wed 08:20",
  notes: "Throbbing. Worsens after screen time. No aura. Taken paracetamol 500 mg.",
};

export function Health22({
  symptom,
  severity = "mild",
  startedAt,
  notes,
  className,
}: Health22Props) {
  const s = sevConfig[severity];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="size-3.5 text-amber-500"
              aria-hidden="true"
            />
            {symptom && (
              <span className="text-sm font-semibold text-card-foreground">
                {symptom}
              </span>
            )}
          </div>
          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", s.pill)}>
            {s.label}
          </span>
        </div>
        {startedAt && (
          <span className="text-xs text-muted-foreground">{startedAt}</span>
        )}
        {notes && (
          <p className="rounded-md bg-muted p-2 text-sm leading-snug text-card-foreground">
            {notes}
          </p>
        )}
      </div>
    </div>
  );
}
