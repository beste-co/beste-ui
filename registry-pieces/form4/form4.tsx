"use client";

import { cn } from "@/lib/utils";

interface Form4Props {
  label?: string;
  requiredLabel?: string;
  placeholder?: string;
  value?: string;
  hint?: string;
  className?: string;
}

export const form4Demo: Form4Props = {
  label: "Full legal name",
  requiredLabel: "Required",
  placeholder: "As shown on your ID",
  value: "Oud Beste",
  hint: "We use this for invoices and tax documents.",
};

export function Form4({
  label,
  requiredLabel = "Required",
  placeholder,
  value,
  hint,
  className,
}: Form4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-medium text-card-foreground">
              {label}
              <span
                className="ml-0.5 text-rose-500"
                aria-hidden="true"
              >
                *
              </span>
            </label>
          )}
          <span className="rounded-full bg-rose-500/10 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
            {requiredLabel}
          </span>
        </div>
        <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <span
            className={cn(
              "block text-sm",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
