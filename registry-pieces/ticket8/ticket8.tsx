"use client";

import { cn } from "@/lib/utils";

interface Ticket8Props {
  discount?: string;
  description?: string;
  code?: string;
  expires?: string;
  bordered?: boolean;
  className?: string;
}

export const ticket8Demo: Ticket8Props = {
  discount: "20% off",
  description: "Coffee & Pastries",
  code: "BREW20",
  expires: "Expires Jun 30",
  bordered: false,
};

export function Ticket8({
  discount,
  description,
  code,
  expires,
  bordered = false,
  className,
}: Ticket8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-lg bg-card shadow-sm", bordered && "border border-border")}>
        <div className="flex flex-col items-center gap-0.5 bg-foreground py-3 text-background">
          <span className="text-xl font-bold">{discount}</span>
          {description && (
            <span className="text-xs opacity-80">
              {description}
            </span>
          )}
        </div>
        <div
          className="border-t border-dashed border-border"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
          {code && (
            <span className="font-bold text-card-foreground">
              {code}
            </span>
          )}
          {expires && (
            <span className="text-muted-foreground">{expires}</span>
          )}
        </div>
      </div>
    </div>
  );
}
