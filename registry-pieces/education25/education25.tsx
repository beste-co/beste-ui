"use client";

import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface PathStep {
  label: string;
  hours: string;
}

interface Education25Props {
  pathName?: string;
  subtitle?: string;
  steps?: PathStep[];
  totalHours?: string;
  className?: string;
}

export const education25Demo: Education25Props = {
  pathName: "Backend engineer path",
  subtitle: "12-course track · beginner to senior",
  steps: [
    { label: "Node.js fundamentals", hours: "8h" },
    { label: "Data modeling with Postgres", hours: "10h" },
    { label: "APIs & authentication", hours: "14h" },
    { label: "Production operations", hours: "16h" },
  ],
  totalHours: "Total 48 hours",
};

export function Education25({
  pathName,
  subtitle,
  steps = [],
  totalHours,
  className,
}: Education25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            {pathName && (
              <span className="text-sm font-semibold text-card-foreground">
                {pathName}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">
                {subtitle}
              </span>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            <Tag className="size-3" aria-hidden="true" />
            Path
          </span>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 py-1.5 text-xs"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-bold text-card-foreground">
                {idx + 1}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {s.label}
              </span>
              <span className="font-mono text-muted-foreground">
                {s.hours}
              </span>
            </div>
          ))}
        </div>
        {totalHours && (
          <span className="text-xs font-semibold text-card-foreground">
            {totalHours}
          </span>
        )}
      </div>
    </div>
  );
}
