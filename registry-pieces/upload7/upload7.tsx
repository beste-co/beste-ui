"use client";

import { Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload7Props {
  label?: string;
  placeholder?: string;
  value?: string;
  action?: string;
  className?: string;
}

export const upload7Demo: Upload7Props = {
  label: "Import from URL",
  placeholder: "https://figma.com/file/…",
  value: "https://www.figma.com/design/wQb4…",
  action: "Import",
};

export function Upload7({
  label,
  placeholder,
  value,
  action = "Import",
  className,
}: Upload7Props) {
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
        <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <span className="flex items-center border-r border-border bg-muted px-2.5 text-muted-foreground">
            <Link className="size-3.5" aria-hidden="true" />
          </span>
          <span
            className={cn(
              "flex-1 truncate px-3 py-2 font-mono text-xs",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
          <button
            type="button"
            className="shrink-0 border-l border-border bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
