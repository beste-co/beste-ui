"use client";

import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChordStep {
  keys: string[];
  label?: string;
}

interface Keyboard5Props {
  steps?: ChordStep[];
  hint?: string;
  className?: string;
}

export const keyboard5Demo: Keyboard5Props = {
  steps: [
    { keys: ["G"], label: "Leader" },
    { keys: ["P"], label: "Go to project" },
  ],
  hint: "Press in sequence",
};

export function Keyboard5({
  steps = [],
  hint,
  className,
}: Keyboard5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => (
            <Fragment key={idx}>
              {idx > 0 && (
                <ArrowRight
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  {step.keys.map((key, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border border-b-2 bg-muted px-2 font-mono text-sm font-semibold text-card-foreground"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
                {step.label && (
                  <span className="text-xs text-muted-foreground">
                    {step.label}
                  </span>
                )}
              </div>
            </Fragment>
          ))}
        </div>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
