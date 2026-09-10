"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const statusClasses: Record<Status, string> = {
  open: "border-sky-500 text-sky-700 dark:text-sky-300",
  "in-progress": "border-amber-500 text-amber-700 dark:text-amber-300",
  blocked: "border-rose-500 text-rose-700 dark:text-rose-300",
  done: "border-emerald-500 text-emerald-700 dark:text-emerald-300",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const ticket5Demo: Ticket5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ticket5Props) {
  const statusLabel: Record<Status, string> = {
    open: openLabel,
    "in-progress": inProgressLabel,
    blocked: blockedLabel,
    done: doneLabel,
  };
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold tracking-wide text-current/60">
            {id}
          </span>
          <span
            className={cn(
              "rounded-full border bg-current/10 px-2 py-0.5 text-xs font-semibold",
              statusClasses[status]
            )}
          >
            {statusLabel[status]}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-snug">
          {title}
        </p>
        <div className="flex items-center gap-2 text-xs text-current/60">
          {priority && (
            <span className="rounded bg-current/10 px-1.5 py-0.5 font-mono font-semibold">
              {priority}
            </span>
          )}
          {assignee && <span>@{assignee}</span>}
          {age && (
            <>
              <span
                className="size-1 rounded-full bg-current/15"
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
