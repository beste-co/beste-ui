"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toggle {
  label: string;
  description?: string;
  on: boolean;
}

interface Legal12Props {
  title?: string;
  toggles?: Toggle[];
  bordered?: boolean;
  className?: string;
}

export const legal12Demo: Legal12Props = {
  title: "Privacy preferences",
  toggles: [
    {
      label: "Essential cookies",
      on: true,
    },
    {
      label: "Analytics",
      on: true,
    },
    {
      label: "Personalized ads",
      on: false,
    },
  ],
  bordered: false,
};

export function Legal12({
  title,
  toggles = [],
  bordered = false,
  className,
}: Legal12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          {title && (
            <span className="text-sm font-semibold text-card-foreground">
              {title}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {toggles.map((t, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-2"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-semibold text-card-foreground">
                  {t.label}
                </span>
                {t.description && (
                  <span className="truncate text-xs text-muted-foreground">
                    {t.description}
                  </span>
                )}
              </div>
              <div
                className={cn(
                  "relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
                  t.on ? "bg-emerald-500" : "bg-muted"
                )}
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "size-4 rounded-full bg-card shadow-sm transition-transform",
                    t.on && "translate-x-4"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
