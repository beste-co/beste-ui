"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form19Props {
  label?: string;
  flag?: string;
  dialCode?: string;
  value?: string;
  hint?: string;
  className?: string;
}

export const form19Demo: Form19Props = {
  label: "Mobile number",
  flag: "🇹🇷",
  dialCode: "+90",
  value: "532 000 12 34",
  hint: "We'll text a login code if you enable 2FA.",
};

export function Form19({
  label,
  flag = "🌐",
  dialCode = "+1",
  value,
  hint,
  className,
}: Form19Props) {
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
        <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 border-r border-border bg-muted px-2.5 text-sm text-card-foreground hover:bg-muted-foreground/10"
          >
            <span className="text-base leading-none" aria-hidden="true">
              {flag}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {dialCode}
            </span>
            <ChevronDown
              className="size-3 text-muted-foreground"
              aria-hidden="true"
            />
          </button>
          <span className="flex-1 truncate px-3 py-2 font-mono text-sm text-card-foreground">
            {value}
          </span>
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
