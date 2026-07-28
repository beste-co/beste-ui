"use client";

import { LayoutGrid, List, Rows } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list" | "rows";

interface Toolbar11Props {
  active?: ViewMode;
  className?: string;
}

const modes: { id: ViewMode; Icon: typeof LayoutGrid; label: string }[] = [
  { id: "grid", Icon: LayoutGrid, label: "Grid" },
  { id: "rows", Icon: Rows, label: "Rows" },
  { id: "list", Icon: List, label: "List" },
];

export const toolbar11Demo: Toolbar11Props = {
  active: "grid",
};

export function Toolbar11({
  active = "grid",
  className,
}: Toolbar11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-sm">
        {modes.map(({ id, Icon, label }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded px-2.5 transition-colors",
                isActive
                  ? "bg-muted text-card-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
