"use client";

import { cn } from "@/lib/utils";

interface Form6Props {
  label?: string;
  value?: string;
  className?: string;
}

export const form6Demo: Form6Props = {
  label: "Email address",
  value: "mira@beste.co",
};

export function Form6({ label, value, className }: Form6Props) {
  const floated = Boolean(value);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80">
        <div className="relative rounded-md border-2 border-primary bg-card px-3 pb-2 pt-5 shadow-sm">
          {label && (
            <label
              className={cn(
                "pointer-events-none absolute left-3 text-muted-foreground transition-all",
                floated
                  ? "top-1 text-xs font-medium text-primary"
                  : "top-1/2 -translate-y-1/2 text-sm"
              )}
            >
              {label}
            </label>
          )}
          <span className="block text-sm text-card-foreground">
            {value}
            <span
              className="ml-0.5 inline-block h-4 w-px animate-pulse bg-primary align-middle"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
