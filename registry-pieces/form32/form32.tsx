"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form32Props {
  label?: string;
  value?: string;
  masked?: boolean;
  visible?: boolean;
  copied?: boolean;
  bordered?: boolean;
  className?: string;
}

function maskValue(value: string) {
  if (value.length <= 8) return "•".repeat(value.length);
  return `${value.slice(0, 3)}${"•".repeat(value.length - 7)}${value.slice(-4)}`;
}

export const form32Demo: Form32Props = {
  label: "API key",
  value: "sk_test_EXAMPLE_NOT_A_REAL_KEY_0000",
  masked: true,
  visible: false,
  copied: true,
  bordered: false,
};

export function Form32({
  label,
  value = "",
  masked = false,
  visible = true,
  copied = false,
  bordered = false,
  className,
}: Form32Props) {
  const display = masked && !visible ? maskValue(value) : value;

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
        <div className={cn("flex items-center gap-2 rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
          <span className="flex-1 truncate text-sm text-card-foreground">
            {display}
          </span>
          {masked && (
            <button
              type="button"
              className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
              aria-label={visible ? "Hide value" : "Reveal value"}
            >
              {visible ? (
                <EyeOff className="size-3.5" aria-hidden="true" />
              ) : (
                <Eye className="size-3.5" aria-hidden="true" />
              )}
            </button>
          )}
          <button
            type="button"
            className={cn(
              "inline-flex shrink-0 items-center rounded-md px-2 py-1 text-xs font-semibold transition-colors",
              copied
                ? "bg-emerald-500 text-white"
                : "bg-foreground text-background hover:opacity-90"
            )}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
