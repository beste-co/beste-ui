"use client";

import { cn } from "@/lib/utils";

interface Legal8Props {
  caseNo?: string;
  label?: string;
  redacted?: boolean;
  bordered?: boolean;
  className?: string;
}

export const legal8Demo: Legal8Props = {
  label: "Confidential witness statement",
  redacted: true,
  bordered: false,
};

export function Legal8({
  caseNo,
  label,
  redacted = true,
  bordered = false,
  className,
}: Legal8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            {caseNo && (
              <span className="text-xs font-semibold text-card-foreground">
                {caseNo}
              </span>
            )}
            {label && (
              <span className="text-xs text-muted-foreground">{label}</span>
            )}
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold",
              redacted
                ? "bg-foreground text-background"
                : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            )}
          >
            {redacted ? "Redacted" : "Unsealed"}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 text-xs leading-relaxed text-card-foreground">
          <p className="flex flex-wrap items-center gap-1">
            <span>On the evening of</span>
            <span className="h-3 w-16 rounded-sm bg-foreground" aria-hidden="true" />
            <span>, the witness observed</span>
            <span className="h-3 w-24 rounded-sm bg-foreground" aria-hidden="true" />
            <span>arriving at</span>
          </p>
          <p className="flex flex-wrap items-center gap-1">
            <span className="h-3 w-32 rounded-sm bg-foreground" aria-hidden="true" />
            <span>carrying a</span>
            <span className="h-3 w-14 rounded-sm bg-foreground" aria-hidden="true" />
            <span>wrapped in cloth.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
