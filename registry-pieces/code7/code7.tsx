"use client";

import { cn } from "@/lib/utils";

type JsonValue = string | number | boolean | null;

interface JsonEntry {
  key: string;
  value: JsonValue;
}

interface Code7Props {
  entries?: JsonEntry[];
  className?: string;
}

export const code7Demo: Code7Props = {
  entries: [
    { key: "name", value: "Beste" },
    { key: "version", value: "1.0.0" },
    { key: "active", value: true },
    { key: "count", value: 42 },
    { key: "owner", value: null },
  ],
};

function ValueSpan({ value }: { value: JsonValue }) {
  if (typeof value === "string") {
    return (
      <span className="text-emerald-600 dark:text-emerald-400">{`"${value}"`}</span>
    );
  }
  if (typeof value === "number") {
    return <span className="text-amber-600 dark:text-amber-400">{value}</span>;
  }
  if (typeof value === "boolean") {
    return (
      <span className="text-violet-600 dark:text-violet-400">
        {String(value)}
      </span>
    );
  }
  return <span className="text-muted-foreground">null</span>;
}

export function Code7({ entries = [], className }: Code7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm leading-relaxed shadow-sm">
        <div className="text-muted-foreground">{"{"}</div>
        {entries.map((entry, i) => (
          <div key={entry.key} className="flex gap-1 truncate pl-3">
            <span className="text-sky-600 dark:text-sky-400">
              {`"${entry.key}"`}
            </span>
            <span className="text-muted-foreground">:</span>
            <ValueSpan value={entry.value} />
            {i < entries.length - 1 && (
              <span className="text-muted-foreground">,</span>
            )}
          </div>
        ))}
        <div className="text-muted-foreground">{"}"}</div>
      </div>
    </div>
  );
}
