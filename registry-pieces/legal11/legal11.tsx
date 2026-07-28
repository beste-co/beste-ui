"use client";

import { Check, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Clause {
  label: string;
  accepted?: boolean;
}

interface Legal11Props {
  title?: string;
  version?: string;
  clauses?: Clause[];
  agreementStatus?: string;
  className?: string;
}

export const legal11Demo: Legal11Props = {
  title: "Terms of service",
  version: "v4.2 · Apr 2026",
  clauses: [
    { label: "I agree to the updated terms", accepted: true },
    { label: "I consent to data processing", accepted: true },
    { label: "I want product announcements" },
  ],
  agreementStatus: "Signed on Apr 23, 2026",
};

export function Legal11({
  title,
  version,
  clauses = [],
  agreementStatus,
  className,
}: Legal11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-500">
            <ScrollText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {version && (
              <span className="truncate font-mono text-xs text-muted-foreground">
                {version}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {clauses.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-md bg-muted/60 p-2 text-xs"
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded",
                  c.accepted
                    ? "bg-emerald-500 text-white"
                    : "border border-border bg-card"
                )}
                aria-hidden="true"
              >
                {c.accepted && <Check className="size-3" aria-hidden="true" />}
              </span>
              <span className="text-card-foreground">{c.label}</span>
            </div>
          ))}
        </div>
        {agreementStatus && (
          <span className="border-t border-border pt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {agreementStatus}
          </span>
        )}
      </div>
    </div>
  );
}
