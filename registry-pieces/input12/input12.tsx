"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input12Props {
  label?: string;
  value?: string;
  reason?: string;
  className?: string;
}

export const input12Demo: Input12Props = {
  label: "Account ID",
  value: "acct_7Z91X2Q",
  reason: "Provided by admin. Contact support to change.",
};

export function Input12({
  label,
  value,
  reason,
  className,
}: Input12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-muted-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground">
          <Lock className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="flex-1 truncate font-mono text-sm">{value}</span>
        </div>
        {reason && (
          <span className="text-xs text-muted-foreground">{reason}</span>
        )}
      </div>
    </div>
  );
}
