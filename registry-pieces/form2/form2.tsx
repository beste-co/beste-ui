"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form2Props {
  label?: string;
  value?: string;
  error?: string;
  className?: string;
}

export const form2Demo: Form2Props = {
  label: "Work email",
  value: "mira@acme",
  error: "Enter a valid email address, including the domain.",
};

export function Form2({
  label,
  value,
  error,
  className,
}: Form2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2 rounded-md border border-rose-500 bg-card px-3 py-2 shadow-sm ring-2 ring-rose-500/20">
          <span className="flex-1 truncate text-sm text-card-foreground">
            {value}
          </span>
          <AlertCircle
            className="size-4 shrink-0 text-rose-500"
            aria-hidden="true"
          />
        </div>
        {error && (
          <span
            className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
