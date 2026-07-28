"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "success" | "muted";

interface Chart1Props {
  label?: string;
  value?: string;
  data?: number[];
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  success: "bg-emerald-500",
  muted: "bg-muted-foreground",
};

export const chart1Demo: Chart1Props = {
  label: "Sessions · this week",
  value: "8,214",
  data: [42, 68, 54, 81, 36, 72, 90],
  tone: "primary",
};

export function Chart1({
  label,
  value,
  data = [],
  tone = "primary",
  className,
}: Chart1Props) {
  const max = data.length > 0 ? Math.max(...data, 1) : 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-52 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
          <span className="text-sm font-semibold tabular-nums text-card-foreground">
            {value}
          </span>
        </div>
        <div
          className="flex h-10 items-end gap-1"
          aria-hidden="true"
        >
          {data.map((d, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-sm transition-all",
                toneClasses[tone]
              )}
              style={{ height: `${Math.max(6, (d / max) * 100)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
