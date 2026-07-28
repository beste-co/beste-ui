"use client";

import { Calendar, FileText, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "draft" | "submitted" | "late" | "graded";

interface Education15Props {
  title?: string;
  course?: string;
  due?: string;
  attachments?: number;
  status?: Status;
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
  title: "Project 2 · State management patterns",
  course: "CS 401 · Advanced React",
  due: "Due Apr 30, 23:59",
  attachments: 3,
  status: "submitted",
};

export function Education15({
  title,
  course,
  due,
  attachments = 0,
  status = "draft",
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
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-violet-500/15 text-violet-500">
              <FileText className="size-4" aria-hidden="true" />
            </div>
            {course && (
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          {due && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" aria-hidden="true" />
              {due}
            </span>
          )}
          {attachments > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3" aria-hidden="true" />
              {attachments} files
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
