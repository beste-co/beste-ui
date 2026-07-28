"use client";

import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "placed" | "packed" | "shipped" | "delivered";

interface Card9Props {
  orderId?: string;
  items?: number;
  status?: Status;
  eta?: string;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; dotClass: string; textClass: string }
> = {
  placed: {
    label: "Order placed",
    dotClass: "bg-slate-400",
    textClass: "text-slate-600 dark:text-slate-300",
  },
  packed: {
    label: "Packed",
    dotClass: "bg-amber-500",
    textClass: "text-amber-700 dark:text-amber-400",
  },
  shipped: {
    label: "Shipped",
    dotClass: "bg-sky-500",
    textClass: "text-sky-700 dark:text-sky-400",
  },
  delivered: {
    label: "Delivered",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-400",
  },
};

export const card9Demo: Card9Props = {
  orderId: "BES-20481",
  items: 3,
  status: "shipped",
  eta: "Arrives Fri",
};

export function Card9({
  orderId = "ORDER-0001",
  items = 1,
  status = "placed",
  eta,
  className,
}: Card9Props) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Package className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="truncate font-mono text-sm font-semibold text-card-foreground">
              #{orderId}
            </span>
            <span className="text-xs text-muted-foreground">
              · {items} item{items === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn("size-1.5 rounded-full", config.dotClass)}
              aria-hidden="true"
            />
            <span className={cn("text-xs font-medium", config.textClass)}>
              {config.label}
            </span>
            {eta && (
              <span className="text-xs text-muted-foreground">· {eta}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
