"use client";

import { cn } from "@/lib/utils";

interface Health22Props {
  symptom?: string;
  severity?: "mild" | "moderate" | "severe";
  startedAt?: string;
  notes?: string;
  bordered?: boolean;
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
  symptom: "Headache",
  severity: "moderate",
  notes: "Throbbing, worse after screen time.",
  bordered: false,
};

export function Health22({
  symptom,
  severity = "mild",
  startedAt,
  notes,
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-start justify-between gap-2">
          {symptom && (
            <span className="text-sm font-semibold text-card-foreground">
              {symptom}
            </span>
          )}
          <span className={cn("ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", s.pill)}>
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
