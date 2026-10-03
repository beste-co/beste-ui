"use client";

import { cn } from "@/lib/utils";

interface Input10Props {
  value?: string;
  placeholder?: string;
  bordered?: boolean;
  className?: string;
}

export const input10Demo: Input10Props = {
  value:
    "Thanks for the thorough write-up. The retry logic feels brittle around rate limits.",
  placeholder: "Leave feedback…",
  bordered: false,
};

export function Input10({
  value = "",
  placeholder = "Write something…",
  bordered = false,
  className,
}: Input10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex min-h-24 items-start">
          <span
            className={cn(
              "flex-1 text-sm leading-snug",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        <button
          type="button"
          aria-label="Resize"
          className="size-3 cursor-nwse-resize self-end border-b-2 border-r-2 border-muted-foreground/40"
        />
      </div>
    </div>
  );
}
