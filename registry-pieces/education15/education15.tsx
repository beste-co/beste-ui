"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "draft" | "submitted" | "late" | "graded";

interface Education15Props {
  title?: string;
  course?: string;
  due?: string;
  attachments?: number;
  status?: Status;
  bordered?: boolean;
  className?: string;
}

const statusConfig: Record<Status, { label: string; pill: string }> = {
  draft: {
    label: "Draft",
    pill: "bg-muted text-muted-foreground",
  },
  submitted: {
    label: "Submitted",
    pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  late: {
    label: "Late",
    pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  graded: {
    label: "Graded",
    pill: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  },
};

export const education15Demo: Education15Props = {
  title: "State management patterns",
  course: "Advanced React",
  due: "Due Apr 30",
  status: "submitted",
  bordered: false,
};

export function Education15({
  title,
  course,
  due,
  attachments = 0,
  status = "draft",
  bordered = false,
  className,
}: Education15Props) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-5 shrink-0 text-violet-500" aria-hidden="true" />
            {course && (
              <span className="text-xs font-medium text-muted-foreground">
                {course}
              </span>
            )}
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              config.pill
            )}
          >
            {config.label}
          </span>
        </div>
        {title && (
          <span className="text-sm font-semibold leading-snug text-card-foreground">
            {title}
          </span>
        )}
        {(due || attachments > 0) && (
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs tabular-nums text-muted-foreground">
            {due && <span>{due}</span>}
            {attachments > 0 && <span>{attachments} files</span>}
          </div>
        )}
      </div>
    </div>
  );
}
