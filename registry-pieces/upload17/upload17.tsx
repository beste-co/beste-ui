"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber";

interface Upload17Props {
  filename?: string;
  chunks?: number;
  chunkStatuses?: ("done" | "uploading" | "pending")[];
  overallPercent?: number;
  tone?: Tone;
  className?: string;
}

const doneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
};

const uploadingClasses: Record<Tone, string> = {
  primary: "bg-primary/50",
  foreground: "bg-foreground/50",
  sky: "bg-sky-500/50",
  emerald: "bg-emerald-500/50",
  violet: "bg-violet-500/50",
  amber: "bg-amber-500/50",
};

export const upload17Demo: Upload17Props = {
  filename: "raw-footage-reel.mp4",
  chunks: 16,
  chunkStatuses: [
    "done",
    "done",
    "done",
    "done",
    "done",
    "done",
    "done",
    "done",
    "done",
    "uploading",
    "uploading",
    "pending",
    "pending",
    "pending",
    "pending",
    "pending",
  ],
  overallPercent: 58,
  tone: "sky",
};

export function Upload17({
  filename,
  chunks = 16,
  chunkStatuses = [],
  overallPercent = 0,
  tone = "sky",
  className,
}: Upload17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {filename}
          </span>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {overallPercent}%
          </span>
        </div>
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
          aria-hidden="true"
        >
          {Array.from({ length: chunks }).map((_, idx) => {
            const status = chunkStatuses[idx] ?? "pending";
            return (
              <span
                key={idx}
                className={cn(
                  "h-5 rounded-sm",
                  status === "done" && doneClasses[tone],
                  status === "uploading" &&
                    cn("animate-pulse", uploadingClasses[tone]),
                  status === "pending" && "bg-muted"
                )}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Chunked upload · 16 MB parts</span>
          <span>
            {chunkStatuses.filter((s) => s === "done").length} / {chunks} done
          </span>
        </div>
      </div>
    </div>
  );
}
