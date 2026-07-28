"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof11Props {
  prefix?: string;
  brand?: string;
  className?: string;
}

export const socialproof11Demo: Socialproof11Props = {
  prefix: "Payments by",
  brand: "Stripe",
};

export function Socialproof11({
  prefix = "Powered by",
  brand = "Partner",
  className,
}: Socialproof11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
        </div>
        <span className="text-xs text-muted-foreground">
          {prefix}{" "}
          <span className="font-semibold text-card-foreground">{brand}</span>
        </span>
      </div>
    </div>
  );
}
