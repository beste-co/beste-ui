"use client";

import { cn } from "@/lib/utils";

interface Stats10Props {
  value?: string;
  label?: string;
  className?: string;
}

export const stats10Demo: Stats10Props = {
  value: "1,284",
  label: "Online now",
};

export function Stats10({
  value = "0",
  label,
  className,
}: Stats10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <span className="relative flex size-2.5 items-center justify-center">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60"
            aria-hidden="true"
          />
          <span
            className="relative size-2.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
        </span>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums leading-none text-card-foreground">
            {value}
          </span>
          {label && (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
