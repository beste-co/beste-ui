"use client";

import { GitCommitHorizontal, Loader2, TriangleAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DeployStatus = "building" | "success" | "failed";

interface Notification7Props {
  branch?: string;
  commit?: string;
  message?: string;
  status?: DeployStatus;
  duration?: string;
  className?: string;
}

const statusConfig: Record<
  DeployStatus,
  { icon: typeof CheckCircle2; label: string; pill: string }
> = {
  building: {
    icon: Loader2,
    label: "Building",
    pill: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  success: {
    icon: CheckCircle2,
    label: "Deployed",
    pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  failed: {
    icon: TriangleAlert,
    label: "Failed",
    pill: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
};

export const notification7Demo: Notification7Props = {
  branch: "main",
  commit: "a1b2c3d",
  message: "fix: resolve cart rounding edge case",
  status: "success",
  duration: "42s",
};

export function Notification7({
  branch = "main",
  commit = "0000000",
  message,
  status = "success",
  duration,
  className,
}: Notification7Props) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              config.pill
            )}
          >
            <Icon
              className={cn(
                "size-3",
                status === "building" && "animate-spin"
              )}
              aria-hidden="true"
            />
            {config.label}
          </span>
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}</span>
          )}
        </div>
        {message && (
          <span className="truncate text-sm font-medium text-card-foreground">
            {message}
          </span>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <GitCommitHorizontal className="size-3.5" aria-hidden="true" />
          <span className="font-mono">{commit.slice(0, 7)}</span>
          <span>·</span>
          <span>{branch}</span>
        </div>
      </div>
    </div>
  );
}
