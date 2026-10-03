"use client";

import { cn } from "@/lib/utils";

interface Legal3Props {
  signature?: string;
  printedName?: string;
  date?: string;
  role?: string;
  eyebrowLabel?: string;
  signedLabel?: string;
  bordered?: boolean;
  className?: string;
}

export const legal3Demo: Legal3Props = {
  signature: "Hania Rani",
  printedName: "Hania Rani",
  date: "Apr 21, 2026",
  signedLabel: "Signed",
  bordered: false,
};

export function Legal3({
  signature,
  printedName,
  role,
  date,
  eyebrowLabel,
  signedLabel = "Signed",
  bordered = false,
  className,
}: Legal3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1.5 rounded-lg bg-card p-4 shadow-sm ring-1 ring-emerald-500/10", bordered && "border border-emerald-500/40")}>
        <div className="flex items-center justify-between">
          {eyebrowLabel && (
            <span className="text-xs font-semibold text-muted-foreground">
              {eyebrowLabel}
            </span>
          )}
          <span className="ml-auto inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {signedLabel}
          </span>
        </div>
        <div className="border-b border-border pb-2">
          <span className="font-serif text-2xl italic text-card-foreground">
            {signature}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex flex-col">
            {printedName && (
              <span className="font-medium text-card-foreground">
                {printedName}
              </span>
            )}
            {role && (
              <span className="text-muted-foreground">{role}</span>
            )}
          </div>
          {date && (
            <span className="text-muted-foreground">{date}</span>
          )}
        </div>
      </div>
    </div>
  );
}
