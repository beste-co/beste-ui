"use client";

import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadFile {
  name: string;
  percent: number;
}

interface Upload32Props {
  title?: string;
  hint?: string;
  file?: UploadFile;
  className?: string;
}

export const upload32Demo: Upload32Props = {
  title: "Import member records",
  hint: "Drop a CSV or browse — we map the fields",
  file: { name: "members_export_2026.csv", percent: 72 },
};

export function Upload32({
  title,
  hint,
  file,
  className,
}: Upload32Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-4 shadow-xl">
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border bg-muted px-4 py-6 text-center">
          <span
            className="flex size-10 items-center justify-center rounded-md bg-background text-muted-foreground"
            aria-hidden="true"
          >
            <UploadCloud className="size-5" />
          </span>
          {title && (
            <p className="text-sm font-medium text-card-foreground">{title}</p>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>

        {file && (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-card-foreground">{file.name}</span>
              <span className="shrink-0 text-muted-foreground">
                {file.percent}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(0, Math.min(file.percent, 100))}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
