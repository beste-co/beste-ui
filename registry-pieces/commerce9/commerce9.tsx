"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce9Props {
  orderId?: string;
  total?: string;
  eta?: string;
  email?: string;
  bordered?: boolean;
  className?: string;
}

export const commerce9Demo: Commerce9Props = {
  total: "$284.00",
  eta: "Arrives Apr 26 to 28",
  bordered: false,
};

export function Commerce9({
  orderId,
  total = "—",
  eta,
  email,
  bordered = false,
  className,
}: Commerce9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Check
            className="size-5 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Order confirmed
            </span>
            {orderId && (
              <span className="text-xs text-muted-foreground">{orderId}</span>
            )}
          </div>
          <span className="ml-auto shrink-0 text-base font-semibold tabular-nums text-card-foreground">
            {total}
          </span>
        </div>
        {(eta || email) && (
          <div className="flex flex-col gap-1 border-t border-border pt-2 text-xs">
            {eta && (
              <span className="text-card-foreground">{eta}</span>
            )}
            {email && (
              <span className="text-muted-foreground">
                Receipt sent to{" "}
                <span className="text-card-foreground">{email}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
