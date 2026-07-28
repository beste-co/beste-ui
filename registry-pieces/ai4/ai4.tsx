"use client";

import { cn } from "@/lib/utils";

interface Ai4Props {
  className?: string;
}

export const ai4Demo: Ai4Props = {};

export function Ai4({ className }: Ai4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-3 py-2.5 shadow-sm"
        role="status"
        aria-label="Assistant is typing"
      >
        <span
          className="size-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-0.3s]"
          aria-hidden="true"
        />
        <span
          className="size-1.5 rounded-full bg-muted-foreground/70 animate-bounce [animation-delay:-0.15s]"
          aria-hidden="true"
        />
        <span
          className="size-1.5 rounded-full bg-muted-foreground/70 animate-bounce"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
