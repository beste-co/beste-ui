"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce21Highlight {
  label: string;
  value: string;
}

interface Commerce21Props {
  title?: string;
  highlights?: Commerce21Highlight[];
  className?: string;
}

export const commerce21Demo: Commerce21Props = {
  title: "Product details",
  highlights: [
    { label: "Material", value: "100% organic cotton" },
    { label: "Care", value: "Machine wash cold, hang dry" },
    { label: "Made in", value: "Porto, Portugal" },
    { label: "Certified", value: "OEKO-TEX Standard 100" },
  ],
};

export function Commerce21({
  title = "Product details",
  highlights = [],
  className,
}: Commerce21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
        <ul className="flex flex-col gap-1.5">
          {highlights.map((h) => (
            <li
              key={h.label}
              className="flex items-baseline gap-2 text-xs"
            >
              <span
                className="flex size-4 shrink-0 translate-y-px items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              >
                <Check className="size-2.5" strokeWidth={3} />
              </span>
              <span className="w-16 shrink-0 text-muted-foreground">
                {h.label}
              </span>
              <span className="flex-1 text-card-foreground">{h.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
