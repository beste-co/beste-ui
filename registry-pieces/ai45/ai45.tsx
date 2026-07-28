"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai45Props {
  before?: string;
  after?: string;
  className?: string;
}

export const ai45Demo: Ai45Props = {
  before: "rate limited users get a 429 response",
  after: "rate-limited users get a 429 response with a Retry-After header",
};

export function Ai45({ before, after, className }: Ai45Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {before && (
          <div className="flex items-start gap-2 rounded-md border border-border bg-rose-500/10 px-2.5 py-1.5">
            <span
              className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white"
              aria-hidden="true"
            >
              <X className="size-2.5" strokeWidth={3} />
            </span>
            <p className="text-xs leading-snug text-card-foreground line-through decoration-rose-500/50">
              {before}
            </p>
          </div>
        )}
        {after && (
          <div className="flex items-start gap-2 rounded-md border border-border bg-emerald-500/10 px-2.5 py-1.5">
            <span
              className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
              aria-hidden="true"
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <p className="text-xs leading-snug text-card-foreground">
              {after}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
