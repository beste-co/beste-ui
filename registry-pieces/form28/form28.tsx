"use client";

import { cn } from "@/lib/utils";

type SaveStatus = "saved" | "saving" | "unsaved";

interface Form28Props {
  label?: string;
  value?: string;
  placeholder?: string;
  status?: SaveStatus;
  savedAt?: string;
  hint?: string;
  bordered?: boolean;
  className?: string;
}

const statusConfig: Record<
  SaveStatus,
  { dot: string; label: string; text: string }
> = {
  saved: {
    dot: "bg-emerald-500",
    label: "Saved",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  saving: {
    dot: "bg-amber-500 animate-pulse",
    label: "Saving…",
    text: "text-amber-700 dark:text-amber-300",
  },
  unsaved: {
    dot: "bg-rose-500",
    label: "Unsaved",
    text: "text-rose-700 dark:text-rose-300",
  },
};

export const form28Demo: Form28Props = {
  label: "Display name",
  value: "Hania Rani",
  placeholder: "How should we call you?",
  status: "saved",
  bordered: false,
};

export function Form28({
  label,
  value,
  placeholder,
  status = "saved",
  savedAt,
  hint,
  bordered = false,
  className,
}: Form28Props) {
  const config = statusConfig[status];
  const showSavedAt = Boolean(savedAt) && status === "saved";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-medium text-card-foreground">
              {label}
            </label>
          )}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold",
              config.text
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", config.dot)}
              aria-hidden="true"
            />
            {config.label}
          </span>
        </div>
        <div className={cn("flex items-center gap-2 rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
          <span
            className={cn(
              "flex-1 truncate text-sm",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        {(hint || showSavedAt) && (
          <div className="flex items-center justify-between">
            {hint && (
              <span className="text-xs text-muted-foreground">{hint}</span>
            )}
            {showSavedAt && (
              <span className="text-xs text-muted-foreground">{savedAt}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
