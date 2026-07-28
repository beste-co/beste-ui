"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal3Props {
  signature?: string;
  printedName?: string;
  date?: string;
  role?: string;
  eyebrowLabel?: string;
  signedLabel?: string;
  className?: string;
}

export const legal3Demo: Legal3Props = {
  signature: "Beste Sözen",
  printedName: "Beste Sözen",
  role: "Principal, Beste Design Studio",
  date: "Signed Apr 21, 2026",
  eyebrowLabel: "Signature",
  signedLabel: "Signed",
};

export function Legal3({
  signature,
  printedName,
  role,
  date,
  eyebrowLabel = "Signature",
  signedLabel = "Signed",
  className,
}: Legal3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5 rounded-lg border border-emerald-500/40 bg-card p-4 shadow-sm ring-1 ring-emerald-500/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {eyebrowLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Check className="size-3" aria-hidden="true" />
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
            <span className="font-mono text-muted-foreground">{date}</span>
          )}
        </div>
      </div>
    </div>
  );
}
