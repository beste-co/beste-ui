"use client";

import { cn } from "@/lib/utils";

interface Editor7Props {
  symbol?: string;
  signature?: string;
  description?: string;
  source?: string;
  className?: string;
}

export const editor7Demo: Editor7Props = {
  symbol: "greet",
  signature: "function greet(name: string): string",
  description: "Returns a localized greeting for the given name.",
  source: "@/lib/greet.ts",
};

export function Editor7({
  symbol = "symbol",
  signature,
  description,
  source,
  className,
}: Editor7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="flex items-center gap-0.5 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-sm">
          <span className="text-card-foreground">const msg = </span>
          <span className="rounded-sm bg-amber-100 px-0.5 font-semibold text-amber-800 underline decoration-amber-500/60 decoration-wavy underline-offset-4 dark:bg-amber-950 dark:text-amber-300">
            {symbol}
          </span>
          <span className="text-card-foreground">("Beste");</span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card px-3 py-2 shadow-md">
          {signature && (
            <code className="font-mono text-xs leading-snug text-card-foreground">
              <span className="text-violet-600 dark:text-violet-400">
                {signature.split(" ")[0]}
              </span>
              <span>{signature.slice(signature.indexOf(" "))}</span>
            </code>
          )}
          {description && (
            <p className="text-xs leading-snug text-muted-foreground">
              {description}
            </p>
          )}
          {source && (
            <span className="font-mono text-xs text-muted-foreground/70">
              {source}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
