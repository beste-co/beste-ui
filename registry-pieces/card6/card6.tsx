"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card6Props {
  count?: number;
  label?: string;
  bordered?: boolean;
  className?: string;
}

export const card6Demo: Card6Props = {
  count: 12,
  label: "unread",
  bordered: false,
};

export function Card6({ count = 0, label, bordered = false, className }: Card6Props) {
  const display = count > 99 ? "99+" : String(count);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2.5 rounded-lg bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <div className="relative">
          <Bell
            className="size-5 text-card-foreground"
            aria-hidden="true"
          />
          {count > 0 && (
            <span className="absolute -right-1.5 -top-1 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
              {display}
            </span>
          )}
        </div>
        {label && (
          <span className="text-sm font-medium text-card-foreground">
            <span className="tabular-nums">{count}</span> {label}
          </span>
        )}
      </div>
    </div>
  );
}
