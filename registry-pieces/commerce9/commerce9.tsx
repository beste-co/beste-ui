"use client";

import { Check, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce9Props {
  orderId?: string;
  total?: string;
  eta?: string;
  email?: string;
  className?: string;
}

export const commerce9Demo: Commerce9Props = {
  orderId: "#SO-8241",
  total: "$284.00",
  eta: "Arrives Apr 26 – Apr 28",
  email: "hello@beste.co",
};

export function Commerce9({
  orderId = "#000000",
  total = "—",
  eta,
  email,
  className,
}: Commerce9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
            aria-hidden="true"
          >
            <Check className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              Order confirmed
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {orderId}
            </span>
          </div>
          <span className="ml-auto shrink-0 font-mono text-base font-semibold tabular-nums text-card-foreground">
            {total}
          </span>
        </div>
        {(eta || email) && (
          <div className="flex flex-col gap-1 border-t border-border pt-2 text-xs">
            {eta && (
              <div className="flex items-center gap-1.5 text-card-foreground">
                <PackageCheck
                  className="size-3 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>{eta}</span>
              </div>
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
