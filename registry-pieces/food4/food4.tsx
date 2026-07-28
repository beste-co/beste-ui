"use client";

import { Bike, ChefHat, Home, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "received" | "preparing" | "riding" | "delivered";

interface Food4Props {
  phase?: Phase;
  eta?: string;
  courier?: string;
  trackingLabel?: string;
  etaPrefix?: string;
  receivedLabel?: string;
  preparingLabel?: string;
  ridingLabel?: string;
  deliveredLabel?: string;
  className?: string;
}

const stepIcons: Record<Phase, typeof Home> = {
  received: ShoppingBag,
  preparing: ChefHat,
  riding: Bike,
  delivered: Home,
};

const phaseOrder: Phase[] = ["received", "preparing", "riding", "delivered"];

export const food4Demo: Food4Props = {
  phase: "riding",
  eta: "15–20 min",
  courier: "Emre · Scooter · 4.9★",
  trackingLabel: "Order tracking",
  etaPrefix: "ETA",
  receivedLabel: "Order",
  preparingLabel: "Kitchen",
  ridingLabel: "On the way",
  deliveredLabel: "Delivered",
};

export function Food4({
  phase = "received",
  eta,
  courier,
  trackingLabel = "Order tracking",
  etaPrefix = "ETA",
  receivedLabel = "Order",
  preparingLabel = "Kitchen",
  ridingLabel = "On the way",
  deliveredLabel = "Delivered",
  className,
}: Food4Props) {
  const stepLabels: Record<Phase, string> = {
    received: receivedLabel,
    preparing: preparingLabel,
    riding: ridingLabel,
    delivered: deliveredLabel,
  };
  const currentIdx = phaseOrder.indexOf(phase);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {trackingLabel}
          </span>
          {eta && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              {etaPrefix} {eta}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          {phaseOrder.map((key, idx) => {
            const Icon = stepIcons[key];
            const reached = idx <= currentIdx;
            const active = idx === currentIdx;
            return (
              <div
                key={key}
                className="relative flex flex-1 flex-col items-center gap-1"
              >
                {idx < phaseOrder.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-1/2 top-4 h-px w-full",
                      reached ? "bg-primary" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "relative flex size-8 items-center justify-center rounded-full border-2",
                    reached
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                    active && "ring-4 ring-primary/20"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "text-xs",
                    reached
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {stepLabels[key]}
                </span>
              </div>
            );
          })}
        </div>
        {courier && (
          <span className="border-t border-border pt-2 text-xs text-muted-foreground">
            {courier}
          </span>
        )}
      </div>
    </div>
  );
}
