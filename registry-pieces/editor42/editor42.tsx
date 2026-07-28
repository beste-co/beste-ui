"use client";

import { cn } from "@/lib/utils";

type Severity = "error" | "warning" | "info";

interface Editor42Props {
  prefix?: string;
  problem?: string;
  suffix?: string;
  message?: string;
  severity?: Severity;
  className?: string;
}

const severityClasses: Record<
  Severity,
  { underline: string; text: string; caret: string }
> = {
  error: {
    underline:
      "decoration-rose-500 decoration-wavy underline-offset-4 underline",
    text: "text-rose-600 dark:text-rose-400",
    caret: "bg-rose-500",
  },
  warning: {
    underline:
      "decoration-amber-500 decoration-wavy underline-offset-4 underline",
    text: "text-amber-600 dark:text-amber-400",
    caret: "bg-amber-500",
  },
  info: {
    underline:
      "decoration-sky-500 decoration-wavy underline-offset-4 underline",
    text: "text-sky-600 dark:text-sky-400",
    caret: "bg-sky-500",
  },
};

export const editor42Demo: Editor42Props = {
  prefix: "const name = user.",
  problem: "prfile",
  suffix: ".name;",
  message: "Property 'prfile' does not exist on type 'User'.",
  severity: "error",
};

export function Editor42({
  prefix = "",
  problem = "",
  suffix = "",
  message,
  severity = "error",
  className,
}: Editor42Props) {
  const cfg = severityClasses[severity];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-baseline gap-3 overflow-hidden rounded-md border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        <span
          className="shrink-0 tabular-nums text-muted-foreground/60"
          aria-hidden="true"
        >
          42
        </span>
        <code className="min-w-0 break-words">
          <span className="text-card-foreground">{prefix}</span>
          <span className={cn("text-card-foreground", cfg.underline)}>
            {problem}
          </span>
          <span className="text-card-foreground">{suffix}</span>
          {message && (
            <span
              className={cn(
                "ml-3 inline-flex items-center gap-1.5 align-middle italic",
                cfg.text
              )}
            >
              <span
                className={cn("inline-block size-1 rounded-full", cfg.caret)}
                aria-hidden="true"
              />
              {message}
            </span>
          )}
        </code>
      </div>
    </div>
  );
}
