"use client";

import { cn } from "@/lib/utils";

interface Input5Props {
  value?: string;
  placeholder?: string;
  focused?: boolean;
  className?: string;
}

export const input5Demo: Input5Props = {
  value: "Beste Sözen",
  placeholder: "Type something",
  focused: true,
};

export function Input5({
  value,
  placeholder,
  focused = false,
  className,
}: Input5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 items-center rounded-md border bg-card px-3 py-2 shadow-sm",
          focused
            ? "border-primary ring-2 ring-primary/20"
            : "border-border"
        )}
      >
        <span
          className={cn(
            "flex-1 truncate text-sm",
            value ? "text-card-foreground" : "text-muted-foreground"
          )}
        >
          {value || placeholder}
          {focused && (
            <span
              className="ml-0.5 inline-block h-4 w-px animate-pulse bg-primary align-middle"
              aria-hidden="true"
            />
          )}
        </span>
      </div>
    </div>
  );
}
