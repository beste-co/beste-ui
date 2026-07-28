"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileEdit,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DocStatus = "draft" | "review" | "signed" | "expired" | "voided";

interface Legal6Props {
  status?: DocStatus;
  docName?: string;
  updated?: string;
  className?: string;
}

const statusConfig: Record<
  DocStatus,
  { label: string; icon: typeof Clock; pill: string; iconColor: string }
> = {
  draft: {
    label: "Draft",
    icon: FileEdit,
    pill: "bg-muted text-muted-foreground",
    iconColor: "text-muted-foreground",
  },
  review: {
    label: "In review",
    icon: Clock,
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    iconColor: "text-amber-500",
  },
  signed: {
    label: "Signed",
    icon: CheckCircle2,
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    iconColor: "text-emerald-500",
  },
  expired: {
    label: "Expired",
    icon: AlertTriangle,
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    iconColor: "text-rose-500",
  },
  voided: {
    label: "Voided",
    icon: XCircle,
    pill: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
    iconColor: "text-slate-500",
  },
};

export const legal6Demo: Legal6Props = {
  status: "review",
  docName: "Series A investors' rights agreement",
  updated: "Updated 4 hours ago",
};

export function Legal6({
  status = "draft",
  docName,
  updated,
  className,
}: Legal6Props) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <Icon
          className={cn("size-6 shrink-0", config.iconColor)}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          {docName && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {docName}
            </span>
          )}
          {updated && (
            <span className="truncate text-xs text-muted-foreground">
              {updated}
            </span>
          )}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
            config.pill
          )}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}
