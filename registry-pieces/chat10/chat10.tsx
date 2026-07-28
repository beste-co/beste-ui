"use client";

import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "sent" | "delivered" | "read";

interface Chat10Props {
  time?: string;
  status?: Status;
  sentLabel?: string;
  deliveredLabel?: string;
  readLabel?: string;
  className?: string;
}

export const chat10Demo: Chat10Props = {
  time: "09:42",
  status: "read",
  sentLabel: "Sent",
  deliveredLabel: "Delivered",
  readLabel: "Read",
};

const statusColor: Record<Status, string> = {
  sent: "text-muted-foreground/60",
  delivered: "text-muted-foreground",
  read: "text-sky-500",
};

export function Chat10({
  time = "00:00",
  status = "sent",
  sentLabel = "Sent",
  deliveredLabel = "Delivered",
  readLabel = "Read",
  className,
}: Chat10Props) {
  const color = statusColor[status];
  const label =
    status === "sent" ? sentLabel : status === "delivered" ? deliveredLabel : readLabel;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 shadow-sm">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {time}
        </span>
        <CheckCheck
          className={cn("size-3.5", color)}
          aria-hidden="true"
        />
        <span className={cn("text-xs font-medium", color)}>
          {label}
        </span>
      </div>
    </div>
  );
}
