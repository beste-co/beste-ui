"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toggle {
  label: string;
  description: string;
  on: boolean;
}

interface Legal12Props {
  title?: string;
  toggles?: Toggle[];
  className?: string;
}

export const legal12Demo: Legal12Props = {
  title: "Privacy preferences",
  toggles: [
    {
      label: "Essential cookies",
      description: "Always on. Needed for login and billing.",
      on: true,
    },
    {
      label: "Analytics",
      description: "Anonymous product usage metrics.",
      on: true,
    },
    {
      label: "Personalized ads",
      description: "Third-party partners may see your activity.",
      on: false,
    },
  ],
};

export function Legal12({
  title,
  toggles = [],
  className,
}: Legal12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </div>
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
                <span className="truncate text-xs text-muted-foreground">
                  {t.description}
                </span>
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
