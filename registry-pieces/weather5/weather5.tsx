"use client";

import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: string;
  detail?: string;
}

interface Weather5Props {
  metrics?: Metric[];
  className?: string;
}

export const weather5Demo: Weather5Props = {
  metrics: [
    { label: "Humidity", value: "64%" },
    { label: "Wind", value: "12 km/h", detail: "NE" },
    { label: "Pressure", value: "1018 hPa" },
    { label: "UV Index", value: "6", detail: "High" },
  ],
};

export function Weather5({ metrics = [], className }: Weather5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-64 grid-cols-2 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {metrics.map((m, i) => {
          const isLeft = i % 2 === 0;
          const isTop = i < 2;
          return (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-0.5 p-3",
                isLeft && "border-r border-border",
                isTop && "border-b border-border"
              )}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {m.label}
              </span>
              <span className="text-base font-bold tabular-nums text-card-foreground">
                {m.value}
              </span>
              {m.detail && (
                <span className="text-xs text-muted-foreground">
                  {m.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
