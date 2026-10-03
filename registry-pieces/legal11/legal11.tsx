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
  bordered?: boolean;
  className?: string;
}

export const legal11Demo: Legal11Props = {
  title: "Terms of service",
  clauses: [
    { label: "I agree to the updated terms", accepted: true },
    { label: "I consent to data processing", accepted: true },
    { label: "I want product announcements" },
  ],
  bordered: false,
};

export function Legal11({
  title,
  version,
  clauses = [],
  agreementStatus,
  bordered = false,
  className,
}: Legal11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <ScrollText className="size-5 shrink-0 text-indigo-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {version && (
              <span className="truncate text-xs text-muted-foreground">
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
