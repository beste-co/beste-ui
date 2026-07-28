"use client";

import { cn } from "@/lib/utils";

interface Code1Props {
  code?: string;
  language?: string;
  className?: string;
}

export const code1Demo: Code1Props = {
  code: "const greeting = \"Hello, Beste!\";",
  language: "ts",
};

export function Code1({
  code,
  language,
  className,
}: Code1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 shadow-sm">
        <code className="flex-1 truncate font-mono text-sm text-card-foreground">
          {code}
        </code>
        {language && (
          <span className="shrink-0 rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-xs font-semibold uppercase text-muted-foreground">
            {language}
          </span>
        )}
      </div>
    </div>
  );
}
