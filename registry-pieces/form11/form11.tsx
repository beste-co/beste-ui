"use client";

import { cn } from "@/lib/utils";

interface Form11Props {
  label?: string;
  digits?: string[];
  activeIndex?: number;
  hint?: string;
  className?: string;
}

export const form11Demo: Form11Props = {
  label: "Enter the 6-digit code",
  digits: ["4", "7", "1", "9", "", ""],
  activeIndex: 4,
  hint: "We sent it to m•••@beste.co just now.",
};

export function Form11({
  label,
  digits = ["", "", "", "", "", ""],
  activeIndex = 0,
  hint,
  className,
}: Form11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-2">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1.5">
          {digits.map((digit, idx) => (
            <div
              key={idx}
              className={cn(
                "flex size-10 items-center justify-center rounded-md border bg-card font-mono text-lg font-semibold shadow-sm",
                idx === activeIndex
                  ? "border-2 border-primary text-card-foreground ring-2 ring-primary/20"
                  : digit
                    ? "border-border text-card-foreground"
                    : "border-border text-muted-foreground"
              )}
            >
              {digit || ""}
              {idx === activeIndex && !digit && (
                <span
                  className="inline-block h-5 w-0.5 animate-pulse bg-primary"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
