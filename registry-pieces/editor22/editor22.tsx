"use client";

import { cn } from "@/lib/utils";

interface LensItem {
  label: string;
  value?: number;
}

interface Editor22Props {
  items?: LensItem[];
  signature?: string;
  className?: string;
}

export const editor22Demo: Editor22Props = {
  items: [
    { label: "references", value: 8 },
    { label: "implementations", value: 2 },
    { label: "run test" },
  ],
  signature: "function greet(name: string)",
};

export function Editor22({
  items = [],
  signature,
  className,
}: Editor22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3 px-3 pt-2 text-xs">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-card-foreground"
            >
              {typeof it.value === "number" && (
                <span className="font-semibold tabular-nums text-primary">
                  {it.value}
                </span>
              )}
              <span className="underline decoration-dotted underline-offset-4">
                {it.label}
              </span>
            </button>
          ))}
        </div>
        {signature && (
          <pre className="px-3 pb-2 pt-1 font-mono text-xs leading-relaxed text-card-foreground">
            <code>
              <span className="text-violet-600 dark:text-violet-400">
                {signature.split(" ")[0]}
              </span>
              {signature.slice(signature.indexOf(" "))}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
