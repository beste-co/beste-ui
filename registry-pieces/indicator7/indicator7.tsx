"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Indicator7Props {
  label?: string;
  targetDate?: string | Date;
  className?: string;
}

function pad(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

export const indicator7Demo: Indicator7Props = {
  label: "Launches in",
};

export function Indicator7({
  label,
  targetDate,
  className,
}: Indicator7Props) {
  const [target] = useState(() =>
    targetDate
      ? new Date(targetDate)
      : new Date(Date.now() + 3 * 60 * 60 * 1000)
  );
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1">
        {label && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        )}
        <div
          className="font-mono text-3xl font-bold tabular-nums text-card-foreground"
          aria-live="polite"
        >
          {pad(hours)}
          <span className="mx-1 text-muted-foreground">:</span>
          {pad(minutes)}
          <span className="mx-1 text-muted-foreground">:</span>
          {pad(seconds)}
        </div>
      </div>
    </div>
  );
}
