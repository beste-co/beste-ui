"use client";

import { Pipette } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input20Props {
  label?: string;
  hex?: string;
  name?: string;
  bordered?: boolean;
  className?: string;
}

export const input20Demo: Input20Props = {
  label: "Accent color",
  hex: "#6D5EFA",
  name: "Mira violet",
  bordered: false,
};

export function Input20({
  label,
  hex = "#000000",
  name,
  bordered = false,
  className,
}: Input20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className={cn("flex items-center gap-2 rounded-md bg-card p-1.5 shadow-sm", bordered && "border border-border")}>
          <div
            className={cn("flex size-8 shrink-0 items-center justify-center rounded-md shadow-inner", bordered ? "border border-border" : "bg-card")}
            style={{ backgroundColor: hex }}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-xs font-medium text-card-foreground">
                {name}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {hex}
            </span>
          </div>
          <button
            type="button"
            className="flex size-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            aria-label="Pick color"
          >
            <Pipette className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
