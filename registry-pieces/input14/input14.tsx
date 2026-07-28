"use client";

import { cn } from "@/lib/utils";

interface Input14Props {
  value?: string;
  placeholder?: string;
  className?: string;
}

export const input14Demo: Input14Props = {
  value: "Ready when you are",
  placeholder: "Ask anything",
};

export function Input14({
  value,
  placeholder,
  className,
}: Input14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center rounded-xl border border-border bg-card px-5 py-4 shadow-md">
        <span
          className={cn(
            "flex-1 truncate text-xl font-medium",
            value ? "text-card-foreground" : "text-muted-foreground"
          )}
        >
          {value || placeholder}
          <span
            className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-primary align-middle"
            aria-hidden="true"
          />
        </span>
      </div>
    </div>
  );
}
