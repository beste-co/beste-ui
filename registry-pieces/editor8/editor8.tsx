"use client";

import { cn } from "@/lib/utils";

interface Editor8Props {
  prefix?: string;
  ghost?: string;
  bordered?: boolean;
  className?: string;
}

export const editor8Demo: Editor8Props = {
  prefix: "const greet = (name: string) => `Hello, ",
  ghost: "${name}!`;",
  bordered: false,
};

export function Editor8({
  prefix = "",
  ghost = "",
  bordered = false,
  className,
}: Editor8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <pre className="overflow-auto text-xs leading-relaxed">
          <code>
            <span className="text-card-foreground">{prefix}</span>
            <span className="italic text-muted-foreground/60">{ghost}</span>
            <span
              className="ml-0.5 inline-block h-3 w-px translate-y-0.5 animate-pulse bg-foreground align-middle"
              aria-hidden="true"
            />
          </code>
        </pre>
      </div>
    </div>
  );
}
