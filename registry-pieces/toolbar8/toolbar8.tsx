"use client";

import {
  Crop,
  Hand,
  MousePointer,
  Move,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToolId = "select" | "move" | "hand" | "zoom" | "crop";

interface Toolbar8Props {
  active?: ToolId;
  className?: string;
}

const tools: { id: ToolId; Icon: typeof MousePointer; label: string }[] = [
  { id: "select", Icon: MousePointer, label: "Select" },
  { id: "move", Icon: Move, label: "Move" },
  { id: "hand", Icon: Hand, label: "Pan" },
  { id: "zoom", Icon: ZoomIn, label: "Zoom" },
  { id: "crop", Icon: Crop, label: "Crop" },
];

export const toolbar8Demo: Toolbar8Props = {
  active: "select",
};

export function Toolbar8({
  active = "select",
  className,
}: Toolbar8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-sm">
        {tools.map(({ id, Icon, label }) => {
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
