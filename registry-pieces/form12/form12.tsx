"use client";

import { cn } from "@/lib/utils";

type Strength = "weak" | "fair" | "strong" | "excellent";

interface Form12Props {
  label?: string;
  value?: string;
  strength?: Strength;
  hint?: string;
  className?: string;
}

const strengthConfig: Record<
  Strength,
  { filled: number; label: string; text: string; bar: string }
> = {
  weak: {
    filled: 1,
    label: "Weak",
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
  },
  fair: {
    filled: 2,
    label: "Fair",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  strong: {
    filled: 3,
    label: "Strong",
    text: "text-sky-600 dark:text-sky-400",
    bar: "bg-sky-500",
  },
  excellent: {
    filled: 4,
    label: "Excellent",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
};

export const form12Demo: Form12Props = {
  label: "Choose a password",
  value: "••••••••••••",
  strength: "strong",
  hint: "Use 12+ characters, mixed case, and a number or symbol.",
};

export function Form12({
  label,
  value = "",
  strength = "fair",
  hint,
  className,
}: Form12Props) {
  const config = strengthConfig[strength];

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
        <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <span className="block truncate font-mono text-sm tracking-wider text-card-foreground">
            {value}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex flex-1 items-center gap-1"
            aria-hidden="true"
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  idx < config.filled ? config.bar : "bg-muted"
                )}
              />
            ))}
          </div>
          <span
            className={cn("text-xs font-semibold", config.text)}
          >
            {config.label}
          </span>
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
