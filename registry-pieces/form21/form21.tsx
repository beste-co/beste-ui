"use client";

import { cn } from "@/lib/utils";

interface Form21Props {
  label?: string;
  description?: string;
  on?: boolean;
  bordered?: boolean;
  className?: string;
}

export const form21Demo: Form21Props = {
  label: "Two-factor authentication",
  description: "Require a verification code at sign-in.",
  on: true,
  bordered: false,
};

export function Form21({
  label,
  description,
  on = false,
  bordered = false,
  className,
}: Form21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex min-w-0 flex-1 flex-col">
          {label && (
            <span className="text-sm font-semibold text-card-foreground">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
        <div
          className={cn(
            "relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors",
            on ? "bg-emerald-500" : "bg-muted"
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              "size-5 rounded-full bg-card shadow-sm transition-transform",
              on && "translate-x-5"
            )}
          />
        </div>
      </div>
    </div>
  );
}
