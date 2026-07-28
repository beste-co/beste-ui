"use client";

import { cn } from "@/lib/utils";

interface StatItem {
  value: string;
  label: string;
}

interface Socialproof10Props {
  stats?: StatItem[];
  className?: string;
}

export const socialproof10Demo: Socialproof10Props = {
  stats: [
    { value: "12K", label: "Customers" },
    { value: "99.98%", label: "Uptime" },
    { value: "4.9★", label: "Rating" },
  ],
};

export function Socialproof10({
  stats = [],
  className,
}: Socialproof10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-center gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-0.5 text-center"
          >
            <span className="text-xl font-bold tabular-nums text-card-foreground">
              {s.value}
            </span>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
