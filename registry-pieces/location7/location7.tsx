"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Location7Props {
  name?: string;
  address?: string;
  status?: string;
  bordered?: boolean;
  className?: string;
}

export const location7Demo: Location7Props = {
  name: "Brightwell · Camden",
  address: "18 Parkway, London NW1",
  status: "Open · closes 6pm",
  bordered: false,
};

export function Location7({
  name = "Location",
  address,
  status,
  bordered = false,
  className,
}: Location7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md bg-card p-4 shadow-xl", bordered && "border border-border")}>
        <div className="flex items-start gap-3">
          <MapPin className="size-6 shrink-0 text-foreground" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-card-foreground">
              {name}
            </p>
            {address && (
              <p className="truncate text-sm text-muted-foreground">{address}</p>
            )}
            {status && (
              <p className="mt-1 flex items-center gap-1.5 text-sm">
                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                <span className="text-card-foreground">{status}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
