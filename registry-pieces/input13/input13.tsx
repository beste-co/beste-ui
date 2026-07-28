"use client";

import { cn } from "@/lib/utils";

interface Input13Props {
  value?: string;
  placeholder?: string;
  className?: string;
}

export const input13Demo: Input13Props = {
  value: "small, compact, dense",
  placeholder: "Dense field",
};

export function Input13({
  value,
  placeholder,
  className,
}: Input13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center rounded-sm border border-border bg-card px-2 py-1 shadow-sm">
        <span
          className={cn(
            "flex-1 truncate text-xs",
            value ? "text-card-foreground" : "text-muted-foreground"
          )}
        >
          {value || placeholder}
        </span>
      </div>
    </div>
  );
}
