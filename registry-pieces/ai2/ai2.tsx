"use client";

import { cn } from "@/lib/utils";

interface Ai2Props {
  text?: string;
  className?: string;
}

export const ai2Demo: Ai2Props = {
  text:
    "The smoothest cup of the morning starts with beans roasted just last",
};

export function Ai2({ text = "", className }: Ai2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="rounded-2xl rounded-bl-md bg-muted px-3 py-2 shadow-sm">
        <p className="max-w-64 text-sm leading-snug text-card-foreground">
          {text}
          <span
            className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-foreground align-middle"
            aria-hidden="true"
          />
        </p>
      </div>
    </div>
  );
}
