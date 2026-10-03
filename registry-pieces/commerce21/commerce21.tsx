"use client";

import { cn } from "@/lib/utils";

interface Commerce21Highlight {
  label: string;
  value: string;
}

interface Commerce21Props {
  title?: string;
  highlights?: Commerce21Highlight[];
  bordered?: boolean;
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
  bordered: false,
};

export function Commerce21({
  title = "Product details",
  highlights = [],
  bordered = false,
  className,
}: Commerce21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <span className="text-xs font-semibold text-muted-foreground">
          {title}
        </span>
        <ul className="flex flex-col gap-1.5">
          {highlights.map((h) => (
            <li
              key={h.label}
              className="flex items-baseline gap-2 text-xs"
            >
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
