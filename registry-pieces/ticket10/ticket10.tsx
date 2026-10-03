"use client";

import { cn } from "@/lib/utils";

interface Ticket10Props {
  name?: string;
  company?: string;
  host?: string;
  validDate?: string;
  badgeId?: string;
  bordered?: boolean;
  className?: string;
}

export const ticket10Demo: Ticket10Props = {
  name: "Hania Rani",
  company: "Erased Tapes",
  validDate: "Valid Jun 14",
  bordered: false,
};

export function Ticket10({
  name,
  company,
  host,
  validDate,
  badgeId,
  bordered = false,
  className,
}: Ticket10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-lg bg-card shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between p-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            {name && (
              <span className="truncate text-lg font-bold leading-tight text-card-foreground">
                {name}
              </span>
            )}
            {company && (
              <span className="truncate text-xs text-muted-foreground">
                {company}
              </span>
            )}
          </div>
          {badgeId && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {badgeId}
            </span>
          )}
        </div>
        <div
          className="border-t border-dashed border-border"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between gap-3 bg-foreground px-3 py-1.5 text-xs text-background">
          <span className="font-bold">Visitor</span>
          <span className="flex items-center gap-2 truncate opacity-80">
            {host && <span className="truncate">Host: {host}</span>}
            {host && validDate && (
              <span aria-hidden="true">·</span>
            )}
            {validDate && <span className="truncate">{validDate}</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
