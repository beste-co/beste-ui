"use client";

import { useEffect, useState } from "react";
import { Check, FileArchive, FileText, Film, Image, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "image" | "document" | "video" | "archive";

interface QueuedFile {
  name: string;
  size?: string;
  kind?: Kind;
}

interface Upload33Props {
  files?: QueuedFile[];
  stepMs?: number;
  bordered?: boolean;
  className?: string;
}

const icons: Record<Kind, typeof FileText> = {
  image: Image,
  document: FileText,
  video: Film,
  archive: FileArchive,
};

export const upload33Demo: Upload33Props = {
  files: [
    { name: "album-cover.png", kind: "image" },
    { name: "liner-notes.pdf", kind: "document" },
    { name: "session-take-03.mp4", kind: "video" },
  ],
  bordered: false,
};

export function Upload33({ files = [], stepMs = 1000, bordered = false, className }: Upload33Props) {
  const [tick, setTick] = useState(0);
  const total = files.length;
  const allDone = total > 0 && tick > total;

  useEffect(() => {
    if (!total || tick > total) return;
    const id = setTimeout(
      () => setTick((t) => t + 1),
      tick === 0 ? 300 : stepMs + 150
    );
    return () => clearTimeout(id);
  }, [tick, total, stepMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium tabular-nums text-card-foreground">
            {allDone
              ? "All files uploaded"
              : tick === 0
                ? "Preparing upload"
                : `Uploading ${Math.min(tick, total)} of ${total}`}
          </span>
          {allDone ? (
            <Check className="size-4 text-emerald-500" aria-hidden="true" />
          ) : (
            <Loader2
              className="size-4 animate-spin text-muted-foreground motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="flex flex-col gap-3">
          {files.map((file, i) => {
            const Icon = icons[file.kind ?? "document"];
            const started = i < tick;
            const done = i < tick - 1;
            return (
              <div key={i} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
                    done
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                  aria-hidden="true"
                >
                  {done ? <Check className="size-4" /> : <Icon className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-card-foreground">
                      {file.name}
                    </span>
                    {file.size && (
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                        {file.size}
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "block h-full rounded-full transition-all ease-out motion-reduce:transition-none",
                        done ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{
                        width: started ? "100%" : "0%",
                        transitionDuration: `${stepMs}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
