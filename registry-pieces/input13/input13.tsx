"use client";

import { cn } from "@/lib/utils";

interface Input13Props {
  value?: string;
  placeholder?: string;
  bordered?: boolean;
  className?: string;
}

export const input13Demo: Input13Props = {
  value: "small, compact, dense",
  placeholder: "Dense field",
  bordered: false,
};

export function Input13({
  value,
  placeholder,
  bordered = false,
  className,
}: Input13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center rounded-sm bg-card px-2 py-1 shadow-sm", bordered && "border border-border")}>
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
