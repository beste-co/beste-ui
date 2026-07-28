"use client";

import { cn } from "@/lib/utils";

type EnvKind = "comment" | "blank" | "entry";

interface EnvEntry {
  kind: EnvKind;
  key?: string;
  value?: string;
  text?: string;
}

interface Code12Props {
  entries?: EnvEntry[];
  className?: string;
}

export const code12Demo: Code12Props = {
  entries: [
    { kind: "comment", text: "# Database" },
    { kind: "entry", key: "DATABASE_URL", value: "postgres://localhost/beste" },
    { kind: "entry", key: "REDIS_URL", value: "redis://localhost:6379" },
    { kind: "blank" },
    { kind: "comment", text: "# API" },
    { kind: "entry", key: "API_KEY", value: "sk_test_EXAMPLE_0000" },
    { kind: "entry", key: "PORT", value: "3000" },
  ],
};

export function Code12({ entries = [], className }: Code12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        {entries.map((entry, i) => {
          if (entry.kind === "blank") {
            return (
              <div key={i} aria-hidden="true">
                &nbsp;
              </div>
            );
          }
          if (entry.kind === "comment") {
            return (
              <div
                key={i}
                className="truncate italic text-muted-foreground"
              >
                {entry.text}
              </div>
            );
          }
          return (
            <div key={i} className="flex gap-1 truncate">
              <span className="text-sky-600 dark:text-sky-400">
                {entry.key}
              </span>
              <span className="text-muted-foreground">=</span>
              <span className="truncate text-card-foreground">
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
