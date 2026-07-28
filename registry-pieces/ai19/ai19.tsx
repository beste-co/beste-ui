"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelCard {
  name: string;
  speed: string;
  cost: string;
  selected?: boolean;
}

interface Ai19Props {
  models?: ModelCard[];
  className?: string;
}

export const ai19Demo: Ai19Props = {
  models: [
    { name: "Fast", speed: "Instant", cost: "$0.10 / Mtok", selected: true },
    { name: "Smart", speed: "2–4s", cost: "$1.20 / Mtok" },
  ],
};

export function Ai19({ models = [], className }: Ai19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-80 grid-cols-2 gap-2">
        {models.slice(0, 2).map((m, i) => (
          <div
            key={i}
            className={cn(
              "relative flex flex-col gap-1 rounded-md border bg-card px-3 py-2.5 shadow-sm",
              m.selected ? "border-primary border-2" : "border-border"
            )}
          >
            {m.selected && (
              <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check
                  className="size-2.5"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>
            )}
            <span className="text-sm font-semibold text-card-foreground">
              {m.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {m.speed}
            </span>
            <span className="mt-1 font-mono text-xs tabular-nums text-card-foreground">
              {m.cost}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
