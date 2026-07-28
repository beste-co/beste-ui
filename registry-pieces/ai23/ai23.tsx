"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ai23Step {
  label: string;
  status: "done" | "active" | "pending";
}

interface Ai23Props {
  steps?: Ai23Step[];
  className?: string;
}

export const ai23Demo: Ai23Props = {
  steps: [
    { label: "Parse user intent", status: "done" },
    { label: "Search knowledge base", status: "done" },
    { label: "Draft response", status: "active" },
    { label: "Format citations", status: "pending" },
  ],
};

export function Ai23({ steps = [], className }: Ai23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5 rounded-md border border-border bg-card p-3 shadow-sm">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full",
                s.status === "done" &&
                  "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                s.status === "active" &&
                  "bg-violet-500/15 text-violet-600 dark:text-violet-400",
                s.status === "pending" && "bg-muted text-muted-foreground"
              )}
              aria-hidden="true"
            >
              {s.status === "done" && <Check className="size-3" />}
              {s.status === "active" && (
                <Loader2 className="size-3 animate-spin" />
              )}
              {s.status === "pending" && (
                <span className="size-1 rounded-full bg-muted-foreground" />
              )}
            </span>
            <span
              className={cn(
                "truncate text-xs",
                s.status === "pending"
                  ? "text-muted-foreground"
                  : "text-card-foreground",
                s.status === "active" && "font-medium"
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
