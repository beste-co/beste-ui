"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card30Props {
  title?: string;
  description?: string;
  action?: string;
  className?: string;
}

export const card30Demo: Card30Props = {
  title: "No projects yet",
  description:
    "Create your first project to start shipping components to every workspace.",
  action: "Create project",
};

export function Card30({
  title,
  description,
  action,
  className,
}: Card30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="size-5" aria-hidden="true" />
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        {description && (
          <p className="text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        )}
        {action && (
          <button
            type="button"
            className="rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}
