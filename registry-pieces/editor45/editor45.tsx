"use client";

import { Check, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "success" | "error";

interface Editor45Props {
  status?: Status;
  title?: string;
  duration?: string;
  size?: string;
  errorCount?: number;
  bordered?: boolean;
  className?: string;
}

export const editor45Demo: Editor45Props = {
  status: "success",
  title: "Build finished",
  duration: "2.4s",
  bordered: false,
};

export function Editor45({
  status = "success",
  title = "Build",
  duration,
  size,
  errorCount,
  bordered = false,
  className,
}: Editor45Props) {
  const isError = status === "error";
  const Icon = isError ? TriangleAlert : Check;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 items-center gap-3 rounded-md px-3 py-2 shadow-sm",
          bordered && "border",
          isError
            ? "border-rose-500/40 bg-rose-50 dark:bg-rose-950/60"
            : "border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/60"
        )}
      >
        <Icon
          className={cn(
            "size-5 shrink-0",
            isError ? "text-rose-500" : "text-emerald-500"
          )}
          strokeWidth={isError ? 2 : 3}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              "text-sm font-semibold",
              isError
                ? "text-rose-700 dark:text-rose-200"
                : "text-emerald-700 dark:text-emerald-200"
            )}
          >
            {title}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isError ? (
              <span className="tabular-nums">{errorCount} errors</span>
            ) : (
              <>
                {duration && <span className="tabular-nums">{duration}</span>}
                {duration && size && <span>·</span>}
                {size && <span className="tabular-nums">{size}</span>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
