"use client";

import {
  Brush,
  Eraser,
  PenTool,
  Shapes,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToolId = "pen" | "brush" | "eraser" | "text" | "shapes";

interface Toolbar7Props {
  active?: ToolId;
  className?: string;
}

const tools: { id: ToolId; Icon: typeof PenTool; label: string }[] = [
  { id: "pen", Icon: PenTool, label: "Pen" },
  { id: "brush", Icon: Brush, label: "Brush" },
  { id: "eraser", Icon: Eraser, label: "Eraser" },
  { id: "text", Icon: Type, label: "Text" },
  { id: "shapes", Icon: Shapes, label: "Shapes" },
];

export const toolbar7Demo: Toolbar7Props = {
  active: "brush",
};

export function Toolbar7({ active = "pen", className }: Toolbar7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex flex-col items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-sm">
        {tools.map(({ id, Icon, label }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              className={cn(
                "flex size-9 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-foreground text-background"
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
