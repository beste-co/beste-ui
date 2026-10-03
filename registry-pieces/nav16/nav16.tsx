"use client";

import { cn } from "@/lib/utils";

interface Nav16Props {
  bordered?: boolean;
  className?: string;
}

export const nav16Demo: Nav16Props = {
  bordered: false,
};

export function Nav16({ bordered = false, className }: Nav16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-56 flex-col gap-0.5 rounded-lg bg-card p-1 shadow-lg", bordered && "border border-border")}>
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          Edit
        </button>
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          Duplicate
        </button>
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          Archive
        </button>
        <span
          className="mx-1 my-1 h-px bg-border"
          aria-hidden="true"
        />
        <button
          type="button"
          className="flex items-center rounded-md px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
