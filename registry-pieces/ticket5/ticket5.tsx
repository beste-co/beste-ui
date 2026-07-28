"use client";

import { cn } from "@/lib/utils";

type Status = "open" | "in-progress" | "blocked" | "done";
type Priority = "P1" | "P2" | "P3" | "P4";

interface Ticket5Props {
  id?: string;
  title?: string;
  status?: Status;
  priority?: Priority;
  assignee?: string;
  age?: string;
  openLabel?: string;
  inProgressLabel?: string;
  blockedLabel?: string;
  doneLabel?: string;
  className?: string;
}

const statusClasses: Record<Status, string> = {
  open: "border-sky-500 text-sky-700 dark:text-sky-300",
  "in-progress": "border-amber-500 text-amber-700 dark:text-amber-300",
  blocked: "border-rose-500 text-rose-700 dark:text-rose-300",
  done: "border-emerald-500 text-emerald-700 dark:text-emerald-300",
};

export const ticket5Demo: Ticket5Props = {
  id: "BUG-1432",
  title: "Login fails on Safari 17 after the OAuth redirect",
  status: "in-progress",
  priority: "P1",
  assignee: "ada",
  age: "2d",
  openLabel: "Open",
  inProgressLabel: "In Progress",
  blockedLabel: "Blocked",
  doneLabel: "Done",
};

export function Ticket5({
  id,
  title,
  status = "open",
  priority,
  assignee,
  age,
  openLabel = "Open",
  inProgressLabel = "In Progress",
  blockedLabel = "Blocked",
  doneLabel = "Done",
  className,
}: Ticket5Props) {
  const statusLabel: Record<Status, string> = {
    open: openLabel,
    "in-progress": inProgressLabel,
    blocked: blockedLabel,
    done: doneLabel,
  };
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold tracking-wide text-muted-foreground">
            {id}
          </span>
          <span
            className={cn(
              "rounded-full border bg-card px-2 py-0.5 text-xs font-semibold",
              statusClasses[status]
            )}
          >
            {statusLabel[status]}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-card-foreground">
          {title}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {priority && (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono font-semibold text-card-foreground">
              {priority}
            </span>
          )}
          {assignee && <span>@{assignee}</span>}
          {age && (
            <>
              <span
                className="size-1 rounded-full bg-muted-foreground/40"
                aria-hidden="true"
              />
              <span>{age}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
