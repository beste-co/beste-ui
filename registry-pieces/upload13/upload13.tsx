"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FileState = "uploading" | "done" | "failed";

interface UploadRow {
  filename: string;
  size: string;
  state: FileState;
  percent?: number;
}

interface Upload13Props {
  files?: UploadRow[];
  bordered?: boolean;
  className?: string;
}

export const upload13Demo: Upload13Props = {
  files: [
    { filename: "brand-guide.pdf", size: "4.2 MB", state: "done" },
    {
      filename: "hero-video.mov",
      size: "312 MB",
      state: "uploading",
      percent: 62,
    },
    { filename: "pricing.xlsx", size: "2.1 MB", state: "failed" },
  ],
  bordered: false,
};

export function Upload13({ files = [], bordered = false, className }: Upload13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col divide-y divide-border overflow-hidden rounded-lg bg-card shadow-sm", bordered && "border border-border")}>
        {files.map((f, idx) => (
          <div key={idx} className="flex items-center gap-2 px-3 py-2">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-medium text-card-foreground">
                {f.filename}
              </span>
              {f.state === "uploading" && typeof f.percent === "number" ? (
                <div
                  className="mt-1 h-1 overflow-hidden rounded-full bg-muted"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${f.percent}%` }}
                  />
                </div>
              ) : (
                <span className="text-xs text-muted-foreground tabular-nums">{f.size}</span>
              )}
            </div>
            {f.state === "done" && (
              <CheckCircle2
                className="size-4 shrink-0 text-emerald-500"
                aria-hidden="true"
              />
            )}
            {f.state === "uploading" && (
              <Loader2
                className="size-4 shrink-0 animate-spin text-sky-500"
                aria-hidden="true"
              />
            )}
            {f.state === "failed" && (
              <XCircle
                className="size-4 shrink-0 text-rose-500"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
