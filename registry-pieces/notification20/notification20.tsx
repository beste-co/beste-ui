"use client";

import type { LucideIcon } from "lucide-react";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification20Props {
  icon?: LucideIcon;
  title?: string;
  meta?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
}

export const notification20Demo: Notification20Props = {
  icon: UserPlus,
  title: "Access request",
  meta: "Noah Reyes wants the records role",
  primaryLabel: "Approve",
  secondaryLabel: "Decline",
};

export function Notification20({
  icon: Icon = UserPlus,
  title,
  meta,
  primaryLabel,
  secondaryLabel,
  className,
}: Notification20Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Icon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            {title && (
              <p className="truncate text-sm font-semibold text-card-foreground">{title}</p>
            )}
            {meta && <p className="text-sm leading-relaxed text-muted-foreground">{meta}</p>}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {primaryLabel && (
            <button
              type="button"
              className="h-8 flex-1 cursor-pointer rounded-md bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {primaryLabel}
            </button>
          )}
          {secondaryLabel && (
            <button
              type="button"
              className="h-8 flex-1 cursor-pointer rounded-md border border-border bg-transparent text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
