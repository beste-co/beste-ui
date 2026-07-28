"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckItem {
  label: string;
  checked?: boolean;
  hint?: string;
}

interface Form22Props {
  legend?: string;
  items?: CheckItem[];
  className?: string;
}

export const form22Demo: Form22Props = {
  legend: "Notifications",
  items: [
    {
      label: "Comments on my posts",
      checked: true,
      hint: "In-app and email",
    },
    {
      label: "Weekly digest",
      checked: true,
      hint: "Every Monday · 08:00",
    },
    {
      label: "Product announcements",
      checked: false,
    },
  ],
};

export function Form22({
  legend,
  items = [],
  className,
}: Form22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        {legend && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {legend}
          </span>
        )}
        <div className="flex flex-col gap-1">
          {items.map((c, idx) => (
            <label
              key={idx}
              className="flex items-start gap-2.5 rounded-md px-1 py-1.5"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                  c.checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                )}
                aria-hidden="true"
              >
                {c.checked && <Check className="size-3" aria-hidden="true" />}
              </span>
              <div className="flex flex-col">
                <span className="text-sm text-card-foreground">
                  {c.label}
                </span>
                {c.hint && (
                  <span className="text-xs text-muted-foreground">
                    {c.hint}
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
