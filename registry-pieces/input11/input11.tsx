"use client";

import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input11Props {
  length?: number;
  className?: string;
}

export const input11Demo: Input11Props = {
  length: 16,
};

export function Input11({
  length = 8,
  className,
}: Input11Props) {
  const dots = "•".repeat(Math.max(0, length));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center rounded-md border border-border bg-card px-3 py-2 shadow-sm">
        <span className="flex-1 truncate font-mono text-base tracking-widest text-card-foreground">
          {dots}
        </span>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
          aria-label="Show password"
        >
          <Eye className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
