"use client";

import { cn } from "@/lib/utils";

interface DiffLine {
  text: string;
  kind: "added" | "removed" | "context";
}

interface Legal27Props {
  heading?: string;
  lines?: DiffLine[];
  added?: number;
  removed?: number;
  bordered?: boolean;
  className?: string;
}

export const legal27Demo: Legal27Props = {
  heading: "§ 7.3 · Indemnification",
  lines: [
    { text: "Each party shall indemnify the other against", kind: "context" },
    {
      text: "all direct and indirect damages arising from a breach",
      kind: "removed",
    },
    {
      text: "direct damages arising from a breach, capped at fees paid",
      kind: "added",
    },
    { text: "of this agreement, subject to Section 11.", kind: "context" },
  ],
  bordered: false,
};

const lineClasses: Record<DiffLine["kind"], string> = {
  added: "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 pl-2",
  removed: "bg-rose-500/15 text-rose-900 dark:text-rose-200 line-through pl-2",
  context: "pl-2 text-muted-foreground",
};

const prefix: Record<DiffLine["kind"], string> = {
  added: "+",
  removed: "-",
  context: " ",
};

export function Legal27({
  heading,
  lines = [],
  added,
  removed,
  bordered = false,
  className,
}: Legal27Props) {
  const showCounts = added !== undefined || removed !== undefined;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {(heading || showCounts) && (
          <div className="flex items-center justify-between gap-2">
            {heading && (
              <span className="text-xs font-semibold text-muted-foreground">
                {heading}
              </span>
            )}
            {showCounts && (
              <span className="ml-auto shrink-0 text-xs tabular-nums">
                <span className="text-emerald-700 dark:text-emerald-300">+{added ?? 0}</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-rose-700 dark:text-rose-300">-{removed ?? 0}</span>
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col gap-0.5 text-xs">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-2 rounded-sm py-0.5",
                lineClasses[line.kind]
              )}
            >
              <span className="shrink-0 text-muted-foreground">
                {prefix[line.kind]}
              </span>
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
