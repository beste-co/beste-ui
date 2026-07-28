"use client";

import { cn } from "@/lib/utils";

type Anchor =
  | "tl"
  | "tc"
  | "tr"
  | "ml"
  | "mc"
  | "mr"
  | "bl"
  | "bc"
  | "br";

interface Toolbar15Props {
  anchor?: Anchor;
  className?: string;
}

const anchors: Anchor[] = [
  "tl",
  "tc",
  "tr",
  "ml",
  "mc",
  "mr",
  "bl",
  "bc",
  "br",
];

export const toolbar15Demo: Toolbar15Props = {
  anchor: "mc",
};

export function Toolbar15({ anchor = "tl", className }: Toolbar15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-card p-2 shadow-sm">
        {anchors.map((a) => {
          const isActive = a === anchor;
          return (
            <button
              key={a}
              type="button"
              aria-label={`Anchor ${a}`}
              aria-pressed={isActive}
              className="flex size-6 items-center justify-center rounded-sm border border-border bg-card transition-colors hover:bg-muted"
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  isActive ? "bg-primary" : "bg-muted-foreground/30"
                )}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
