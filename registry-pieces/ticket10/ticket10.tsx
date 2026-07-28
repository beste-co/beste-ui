"use client";

import { cn } from "@/lib/utils";

interface Ticket10Props {
  name?: string;
  company?: string;
  host?: string;
  validDate?: string;
  badgeId?: string;
  className?: string;
}

export const ticket10Demo: Ticket10Props = {
  name: "Ada Lovelace",
  company: "Algorithm Ltd.",
  host: "Grace Hopper",
  validDate: "Valid Jun 14",
  badgeId: "V-0428",
};

export function Ticket10({
  name,
  company,
  host,
  validDate,
  badgeId,
  className,
}: Ticket10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
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
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {badgeId}
            </span>
          )}
        </div>
        <div
          className="border-t border-dashed border-border"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between gap-3 bg-foreground px-3 py-1.5 text-xs text-background">
          <span className="font-bold uppercase tracking-widest">Visitor</span>
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
