"use client";

import { cn } from "@/lib/utils";

type DiffKind = "add" | "remove" | "context";

interface DiffLine {
  kind: DiffKind;
  content: string;
  line?: number;
}

interface Editor4Props {
  filename?: string;
  lines?: DiffLine[];
  className?: string;
}

export const editor4Demo: Editor4Props = {
  filename: "button.tsx",
  lines: [
    { kind: "context", line: 12, content: "export function Button({ label }) {" },
    { kind: "remove", line: 13, content: "  return <button>{label}</button>;" },
    { kind: "add", content: "  return <button className=\"btn\">{label}</button>;" },
    { kind: "context", line: 14, content: "}" },
  ],
};

const diffConfig: Record<
  DiffKind,
  { prefix: string; row: string; prefixColor: string }
> = {
  add: {
    prefix: "+",
    row: "bg-emerald-100/70 dark:bg-emerald-950/60",
    prefixColor: "text-emerald-600 dark:text-emerald-400",
  },
  remove: {
    prefix: "−",
    row: "bg-rose-100/70 dark:bg-rose-950/60",
    prefixColor: "text-rose-600 dark:text-rose-400",
  },
  context: {
    prefix: " ",
    row: "",
    prefixColor: "text-muted-foreground/50",
  },
};

export function Editor4({
  filename,
  lines = [],
  className,
}: Editor4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        {filename && (
          <div className="border-b border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">
            {filename}
          </div>
        )}
        <pre className="overflow-auto py-1 font-mono text-xs leading-relaxed">
          {lines.map((l, i) => {
            const cfg = diffConfig[l.kind];
            return (
              <div
                key={i}
                className={cn("flex gap-3 px-3", cfg.row)}
              >
                <span
                  className="w-5 shrink-0 select-none text-right text-muted-foreground/50"
                  aria-hidden="true"
                >
                  {l.line ? l.line : ""}
                </span>
                <span
                  className={cn(
                    "w-3 shrink-0 select-none font-bold",
                    cfg.prefixColor
                  )}
                  aria-hidden="true"
                >
                  {cfg.prefix}
                </span>
                <code className="flex-1 text-card-foreground">
                  {l.content}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
