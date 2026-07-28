"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Align = "left" | "center" | "right" | "justify";

interface Toolbar4Props {
  active?: Align;
  className?: string;
}

const items: { id: Align; Icon: typeof AlignLeft; label: string }[] = [
  { id: "left", Icon: AlignLeft, label: "Left" },
  { id: "center", Icon: AlignCenter, label: "Center" },
  { id: "right", Icon: AlignRight, label: "Right" },
  { id: "justify", Icon: AlignJustify, label: "Justify" },
];

export const toolbar4Demo: Toolbar4Props = {
  active: "center",
};

export function Toolbar4({ active = "left", className }: Toolbar4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-sm">
        {items.map(({ id, Icon, label }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              className={cn(
                "flex size-8 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-muted text-card-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
