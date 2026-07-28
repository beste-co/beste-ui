"use client";

import { Check, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Form31Props {
  label?: string;
  value?: string;
  draft?: string;
  editing?: boolean;
  className?: string;
}

export const form31Demo: Form31Props = {
  label: "Workspace name",
  value: "Mira Studio",
  draft: "Mira & Co.",
  editing: true,
};

export function Form31({
  label,
  value,
  draft,
  editing = false,
  className,
}: Form31Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        {editing ? (
          <div className="flex items-stretch gap-1">
            <div className="flex flex-1 items-center rounded-md border border-primary bg-card px-3 py-2 shadow-sm ring-2 ring-primary/20">
              <span className="flex-1 truncate text-sm text-card-foreground">
                {draft ?? value}
                <span
                  className="ml-0.5 inline-block h-4 w-px animate-pulse bg-primary align-middle"
                  aria-hidden="true"
                />
              </span>
            </div>
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white hover:opacity-90"
              aria-label="Save"
            >
              <Check className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted"
              aria-label="Cancel"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="group flex items-center gap-2 rounded-md border border-transparent px-3 py-2 hover:border-border hover:bg-muted/60">
            <span className="flex-1 truncate text-sm font-medium text-card-foreground">
              {value}
            </span>
            <Pencil
              className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}
