"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Location7Props {
  name?: string;
  address?: string;
  status?: string;
  className?: string;
}

export const location7Demo: Location7Props = {
  name: "Brightwell · Camden",
  address: "18 Parkway, London NW1",
  status: "Open · closes 6pm",
};

export function Location7({
  name = "Location",
  address,
  status,
  className,
}: Location7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground"
            aria-hidden="true"
          >
            <MapPin className="size-5" />
          </span>
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
