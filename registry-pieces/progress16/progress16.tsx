"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Progress16Props {
  title?: string;
  steps?: string[];
  activeIndex?: number;
  caption?: string;
  className?: string;
}

export const progress16Demo: Progress16Props = {
  title: "Migration",
  steps: ["Export", "Map fields", "Review", "Go live"],
  activeIndex: 2,
  caption: "Review finishes today, go live is scheduled for Friday.",
};

export function Progress16({
  title,
  steps = [],
  activeIndex = 0,
  caption,
  className,
}: Progress16Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 rounded-md border border-border bg-card p-5 shadow-xl">
        {title && <p className="text-base font-semibold text-card-foreground">{title}</p>}

        <div className="mt-4 flex items-start">
          {steps.map((step, index) => {
            const done = index < activeIndex;
            const active = index === activeIndex;

            return (
              <div key={index} className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <span
                    className={cn(
                      "h-px flex-1",
                      index === 0 ? "bg-transparent" : done || active ? "bg-primary" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                      done && "bg-primary text-primary-foreground",
                      active && "border-2 border-primary bg-card text-primary",
                      !done && !active && "border border-border bg-card text-muted-foreground"
                    )}
                  >
                    {done ? <Check className="size-3" aria-hidden="true" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "h-px flex-1",
                      index === steps.length - 1 ? "bg-transparent" : done ? "bg-primary" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className={cn(
                    "mt-2 w-full truncate px-1 text-center text-xs",
                    active ? "font-medium text-card-foreground" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {caption && (
          <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
