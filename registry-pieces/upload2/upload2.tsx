"use client";

import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload2Props {
  title?: string;
  subtitle?: string;
  action?: string;
  className?: string;
}

export const upload2Demo: Upload2Props = {
  title: "Drag files to upload",
  subtitle: "or click to browse your device",
  action: "Select files",
};

export function Upload2({
  title,
  subtitle,
  action,
  className,
}: Upload2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <UploadCloud className="size-5" aria-hidden="true" />
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-muted-foreground">{subtitle}</span>
        )}
        {action && (
          <button
            type="button"
            className="mt-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}
