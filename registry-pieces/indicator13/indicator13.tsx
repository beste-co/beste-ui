"use client";

import { cn } from "@/lib/utils";

type Tone = "emerald" | "amber" | "rose";

interface StatusRow {
  label: string;
  status: string;
  tone?: Tone;
}

interface Indicator13Props {
  title?: string;
  items?: StatusRow[];
  className?: string;
}

const dotStyles: Record<Tone, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const indicator13Demo: Indicator13Props = {
  title: "System status",
  items: [
    { label: "Scheduling", status: "Operational", tone: "emerald" },
    { label: "Billing sync", status: "Operational", tone: "emerald" },
    { label: "Records export", status: "Degraded", tone: "amber" },
  ],
};

export function Indicator13({
  title,
  items = [],
  className,
}: Indicator13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 rounded-md border border-border bg-card p-4 shadow-xl">
        {title && (
          <p className="mb-3 text-sm font-semibold text-card-foreground">
            {title}
          </p>
        )}
        <div className="flex flex-col gap-2.5">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <span className="truncate text-sm text-muted-foreground">
                {item.label}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-card-foreground">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    dotStyles[item.tone ?? "emerald"]
                  )}
                  aria-hidden="true"
                />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
