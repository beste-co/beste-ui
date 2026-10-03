"use client";

import { cn } from "@/lib/utils";

interface Location3Props {
  label?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postal?: string;
  country?: string;
  bordered?: boolean;
  className?: string;
}

export const location3Demo: Location3Props = {
  label: "Headquarters",
  line1: "123 Atlantic Avenue",
  line2: "Suite 4B",
  city: "Brooklyn, NY",
  postal: "11201",
  country: "United States",
  bordered: false,
};

export function Location3({
  label,
  line1,
  line2,
  city,
  postal,
  country,
  bordered = false,
  className,
}: Location3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-1 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {label && (
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
        )}
        <div className="text-sm leading-snug text-card-foreground">
          {line1 && <div className="truncate">{line1}</div>}
          {line2 && <div className="truncate">{line2}</div>}
          {(city || postal) && (
            <div className="truncate">
              {city}
              {city && postal && " "}
              {postal}
            </div>
          )}
          {country && (
            <div className="truncate text-muted-foreground">{country}</div>
          )}
        </div>
      </div>
    </div>
  );
}
