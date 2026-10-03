"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Ai44Props {
  id?: string;
  completed?: number;
  failed?: number;
  total?: number;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const ai44Demo: Ai44Props = {
  id: "Nightly embeddings",
  completed: 820,
  failed: 4,
  total: 1000,
  tone: "primary",
  bordered: false,
};

export function Ai44({
  id,
  completed = 0,
  failed = 0,
  total = 1,
  tone = "primary",
  bordered = false,
  className,
}: Ai44Props) {
  const done = Math.min(100, (completed / total) * 100);
  const err = Math.min(100 - done, (failed / total) * 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-1.5 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between">
          {id && (
            <span className="truncate text-xs text-card-foreground">
              {id}
            </span>
          )}
          <span className="text-xs tabular-nums text-muted-foreground">
            {completed.toLocaleString()}/{total.toLocaleString()}
          </span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <span
            className={cn("h-full", barClasses[tone])}
            style={{ width: `${done}%` }}
            aria-hidden="true"
          />
          <span
            className="h-full bg-rose-500"
            style={{ width: `${err}%` }}
            aria-hidden="true"
          />
        </div>
        {failed > 0 && (
          <span className="text-xs tabular-nums text-rose-600 dark:text-rose-400">
            fail {failed}
          </span>
        )}
      </div>
    </div>
  );
}
