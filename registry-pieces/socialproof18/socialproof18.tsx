"use client";

import { cn } from "@/lib/utils";

interface Socialproof18Props {
  count?: string;
  noun?: string;
  action?: string;
  className?: string;
}

export const socialproof18Demo: Socialproof18Props = {
  count: "40,000+",
  noun: "weekly subscribers",
  action: "Subscribe",
};

export function Socialproof18({
  count = "0",
  noun = "subscribers",
  action = "Subscribe",
  className,
}: Socialproof18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-3 text-center">
        <span className="text-sm text-muted-foreground">
          Join{" "}
          <span className="font-semibold tabular-nums text-card-foreground">
            {count}
          </span>{" "}
          {noun}
        </span>
        <button
          type="button"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          {action}
        </button>
      </div>
    </div>
  );
}
