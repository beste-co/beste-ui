"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form3Props {
  label?: string;
  value?: string;
  confirmation?: string;
  className?: string;
}

export const form3Demo: Form3Props = {
  label: "Subdomain",
  value: "mira-studio",
  confirmation: "mira-studio.beste.co is available.",
};

export function Form3({
  label,
  value,
  confirmation,
  className,
}: Form3Props) {
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
        <div className="flex items-center gap-2 rounded-md border border-emerald-500 bg-card px-3 py-2 shadow-sm ring-2 ring-emerald-500/20">
          <span className="flex-1 truncate text-sm text-card-foreground">
            {value}
          </span>
          <CheckCircle2
            className="size-4 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
        </div>
        {confirmation && (
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {confirmation}
          </span>
        )}
      </div>
    </div>
  );
}
