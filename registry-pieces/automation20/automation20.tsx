"use client";

import { Braces } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation20Group {
  label: string;
  variables: string[];
}

interface Automation20Props {
  heading?: string;
  groups?: Automation20Group[];
  className?: string;
}

export const automation20Demo: Automation20Props = {
  heading: "Available variables",
  groups: [
    {
      label: "Trigger",
      variables: ["event.id", "event.type", "event.created_at"],
    },
    {
      label: "Customer",
      variables: ["customer.email", "customer.name", "customer.plan"],
    },
    {
      label: "Order",
      variables: ["order.total", "order.currency"],
    },
  ],
};

export function Automation20({
  heading = "Available variables",
  groups = [],
  className,
}: Automation20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Braces
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {groups.map((g) => (
            <div key={g.label} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{g.label}</span>
              <div className="flex flex-wrap gap-1">
                {g.variables.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center rounded-sm bg-violet-500/15 px-1.5 py-0.5 font-mono text-xs font-medium text-violet-600 dark:text-violet-400"
                  >
                    {"{{"}
                    {v}
                    {"}}"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
