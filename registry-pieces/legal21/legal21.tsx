"use client";

import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface Deliverable {
  label: string;
  due: string;
  status: "pending" | "in-progress" | "delivered" | "overdue";
}

interface Legal21Props {
  title?: string;
  items?: Deliverable[];
  className?: string;
}

const statusConfig = {
  pending: {
    pill: "bg-muted text-muted-foreground",
    label: "Pending",
  },
  "in-progress": {
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    label: "In progress",
  },
  delivered: {
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    label: "Delivered",
  },
  overdue: {
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    label: "Overdue",
  },
};

export const legal21Demo: Legal21Props = {
  title: "Engagement deliverables",
  items: [
    {
      label: "Regulatory filings · Q2",
      due: "Due May 12",
      status: "in-progress",
    },
    {
      label: "Board resolutions package",
      due: "Due May 3",
      status: "overdue",
    },
    {
      label: "Closing memo",
      due: "Delivered Apr 18",
      status: "delivered",
    },
  ],
};

export function Legal21({
  title,
  items = [],
  className,
}: Legal21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-violet-500/15 text-violet-500">
            <ListChecks className="size-3.5" aria-hidden="true" />
          </div>
          {title && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {items.map((item, idx) => {
            const s = statusConfig[item.status];
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 py-1.5 text-xs"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-card-foreground">
                    {item.label}
                  </span>
                  <span className="truncate text-muted-foreground">
                    {item.due}
                  </span>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 font-semibold",
                    s.pill
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
