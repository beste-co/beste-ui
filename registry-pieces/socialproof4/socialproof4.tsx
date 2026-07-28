"use client";

import { cn } from "@/lib/utils";

interface Socialproof4Props {
  value?: string;
  label?: string;
  className?: string;
}

export const socialproof4Demo: Socialproof4Props = {
  value: "12,480+",
  label: "Teams using Beste this week",
};

export function Socialproof4({
  value = "0",
  label,
  className,
}: Socialproof4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-4xl font-bold tracking-tight tabular-nums text-card-foreground">
          {value}
        </span>
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
}
