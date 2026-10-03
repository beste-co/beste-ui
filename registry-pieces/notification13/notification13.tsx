"use client";

import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

type ShipStatus = "ordered" | "shipped" | "out-for-delivery" | "delivered";

interface Notification13Props {
  status?: ShipStatus;
  carrier?: string;
  tracking?: string;
  eta?: string;
  bordered?: boolean;
  className?: string;
}

const steps: ShipStatus[] = [
  "ordered",
  "shipped",
  "out-for-delivery",
  "delivered",
];

const statusLabel: Record<ShipStatus, string> = {
  ordered: "Order placed",
  shipped: "Shipped",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
};

export const notification13Demo: Notification13Props = {
  status: "out-for-delivery",
  eta: "Arrives today before 18:00",
  bordered: false,
};

export function Notification13({
  status = "shipped",
  carrier,
  tracking,
  eta,
  bordered = false,
  className,
}: Notification13Props) {
  const currentIdx = steps.indexOf(status);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <div className="flex items-start gap-3">
          <Package
            className="mt-0.5 size-5 shrink-0 text-emerald-700 dark:text-emerald-400"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              {statusLabel[status]}
            </span>
            {eta && (
              <span className="truncate text-xs text-muted-foreground">
                {eta}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1" aria-hidden="true">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1 flex-1 rounded-full",
                idx <= currentIdx ? "bg-emerald-500" : "bg-muted"
              )}
            />
          ))}
        </div>
        {(carrier || tracking) && (
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            {carrier && <span>{carrier}</span>}
            {tracking && (
              <span className="truncate">{tracking}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
