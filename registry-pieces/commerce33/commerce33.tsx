"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Commerce33Props {
  name?: string;
  initials?: string;
  /** Product photo; an empty string falls back to the initials. */
  avatar?: string;
  price?: number;
  total?: number;
  intervalMs?: number;
  holdMs?: number;
  bordered?: boolean;
  className?: string;
}

export const commerce33Demo: Commerce33Props = {
  name: "Limited Press Vinyl",
  initials: "LP",
  avatar:
    "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=160&h=160&auto=format&fit=crop",
  price: 42,
  total: 24,
  bordered: false,
};

export function Commerce33({
  name = "Product",
  initials = "P",
  avatar = "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=160&h=160&auto=format&fit=crop",
  price = 0,
  total = 20,
  intervalMs = 1500,
  holdMs = 2600,
  bordered = false,
  className,
}: Commerce33Props) {
  const [stock, setStock] = useState(total);

  useEffect(() => {
    if (stock <= 0) {
      const id = setTimeout(() => setStock(total), holdMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setStock((s) => Math.max(0, s - (1 + Math.floor(Math.random() * 3))));
    }, intervalMs);
    return () => clearTimeout(id);
  }, [stock, total, intervalMs, holdMs]);

  const ratio = total > 0 ? stock / total : 0;
  const level =
    stock === 0 ? "out" : ratio <= 0.2 ? "critical" : ratio <= 0.5 ? "low" : "ok";

  const badgeClasses = {
    ok: "bg-muted text-muted-foreground",
    low: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    critical: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    out: "bg-rose-500 text-white",
  }[level];

  const barClasses = {
    ok: "bg-emerald-500",
    low: "bg-amber-500",
    critical: "bg-rose-500",
    out: "bg-rose-500",
  }[level];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes commerce33-pop { from { transform: scale(0.85); opacity: 0.4; } to { transform: scale(1); opacity: 1; } }`}</style>
      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="size-12 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-foreground text-sm font-semibold text-background"
              aria-hidden="true"
            >
              {initials}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-sm font-medium text-card-foreground">
              {name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm tabular-nums text-muted-foreground">
                ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span
                key={level === "out" ? "out" : stock}
                className={cn(
                  "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium tabular-nums transition-colors duration-300 motion-reduce:animate-none",
                  badgeClasses
                )}
                style={{ animation: "commerce33-pop 300ms ease-out" }}
              >
                {stock === 0 ? "Sold out" : `Only ${stock} left`}
              </span>
            </div>
          </div>
        </div>

        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <span
            className={cn(
              "block h-full origin-left rounded-full transition-all duration-500 ease-out motion-reduce:transition-none",
              barClasses
            )}
            style={{ transform: `scaleX(${ratio})` }}
          />
        </div>
      </div>
    </div>
  );
}
