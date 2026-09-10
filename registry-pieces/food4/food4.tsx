"use client";

import { Bike, ChefHat, Home, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const stepIcons: Record<Phase, typeof Home> = {
  received: ShoppingBag,
  preparing: ChefHat,
  riding: Bike,
  delivered: Home,
};

const phaseOrder: Phase[] = ["received", "preparing", "riding", "delivered"];


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const food4Demo: Food4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Food4Props) {
  const stepLabels: Record<Phase, string> = {
    received: receivedLabel,
    preparing: preparingLabel,
    riding: ridingLabel,
    delivered: deliveredLabel,
  };
  const currentIdx = phaseOrder.indexOf(phase);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
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
                      : "border-current/15 bg-current/10 text-current/60",
                    active && "ring-4 ring-primary/20"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "text-xs",
                    reached
                      ? "font-semibold"
                      : "text-current/60"
                  )}
                >
                  {stepLabels[key]}
                </span>
              </div>
            );
          })}
        </div>
        {courier && (
          <span className="border-t border-current/15 pt-2 text-xs text-current/60">
            {courier}
          </span>
        )}
      </div>
    </div>
  );
}
