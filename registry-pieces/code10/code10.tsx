"use client";

import { cn } from "@/lib/utils";

const SQL_KEYWORDS = new Set([
  "select",
  "from",
  "where",
  "and",
  "or",
  "not",
  "in",
  "is",
  "null",
  "order",
  "by",
  "group",
  "having",
  "limit",
  "offset",
  "join",
  "left",
  "right",
  "inner",
  "outer",
  "on",
  "as",
  "insert",
  "into",
  "values",
  "update",
  "set",
  "delete",
]);

interface Code10Props {
  query?: string;
  className?: string;
}

export const code10Demo: Code10Props = {
  query: [
    "SELECT id, name, email",
    "FROM users",
    "WHERE active = true",
    "ORDER BY created_at DESC",
    "LIMIT 10;",
  ].join("\n"),
};

function tokenize(line: string) {
  return line.split(/(\s+|,|;|\(|\)|=)/g).filter(Boolean);
}

function classFor(token: string): string {
  const trimmed = token.trim();
  if (!trimmed) return "";
  if (SQL_KEYWORDS.has(trimmed.toLowerCase())) {
    return "text-violet-600 dark:text-violet-400";
  }
  if (/^['"].*['"]$/.test(trimmed)) {
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (/^\d+$/.test(trimmed)) {
    return "text-amber-600 dark:text-amber-400";
  }
  if (trimmed === "true" || trimmed === "false") {
    return "text-amber-600 dark:text-amber-400";
  }
  if (/^[,;()=]$/.test(trimmed)) {
    return "text-muted-foreground";
  }
  return "text-card-foreground";
}

export function Code10({ query = "", className }: Code10Props) {
  const lines = query.split("\n");
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        {lines.map((line, i) => (
          <div key={i} className="truncate">
            {tokenize(line).map((token, j) => (
              <span key={j} className={classFor(token)}>
                {token}
              </span>
            ))}
            {line === "" && " "}
          </div>
        ))}
      </div>
    </div>
  );
}
