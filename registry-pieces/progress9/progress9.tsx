"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Progress9Props {
  title?: string;
  description?: string;
  className?: string;
}

export const progress9Demo: Progress9Props = {
  title: "All set",
  description: "Your payment has cleared",
};

export function Progress9({
  title = "Complete",
  description,
  className,
}: Progress9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="relative flex size-14 items-center justify-center">
          <span
            className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-20"
            aria-hidden="true"
          />
          <span className="relative flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <Check
              className="size-7"
              strokeWidth={3}
              aria-hidden="true"
            />
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-card-foreground">
            {title}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
