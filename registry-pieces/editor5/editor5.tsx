"use client";

import { ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface TreeItem {
  label: string;
  depth: number;
  kind: "folder" | "folderOpen" | "file";
  active?: boolean;
}

interface Editor5Props {
  items?: TreeItem[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const editor5Demo: Editor5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  items: [
    { label: "components", depth: 0, kind: "folderOpen" },
    { label: "beste", depth: 1, kind: "folderOpen" },
    { label: "button.tsx", depth: 2, kind: "file", active: true },
    { label: "card.tsx", depth: 2, kind: "file" },
    { label: "input.tsx", depth: 2, kind: "file" },
    { label: "ui", depth: 1, kind: "folder" },
    { label: "lib", depth: 0, kind: "folder" },
  ],
};

export function Editor5({ items = [], surface = "card", bordered = true, inverted = false, className }: Editor5Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-56 flex-col gap-0.5 rounded-md py-1.5 font-mono text-xs shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {items.map((item, i) => {
          const Icon =
            item.kind === "file"
              ? File
              : item.kind === "folderOpen"
                ? FolderOpen
                : Folder;
          return (
            <button
              key={i}
              type="button"
              className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 text-left transition-colors",
                item.active
                  ? "bg-current/10"
                  : "text-current/60 hover:bg-current/10 hover:text-current"
              )}
              style={{ paddingLeft: `${0.5 + item.depth * 1}rem` }}
            >
              {item.kind !== "file" ? (
                <ChevronDown
                  className={cn(
                    "size-3 shrink-0",
                    item.kind === "folder" && "-rotate-90"
                  )}
                  aria-hidden="true"
                />
              ) : (
                <span className="size-3 shrink-0" aria-hidden="true" />
              )}
              <Icon
                className={cn(
                  "size-3 shrink-0",
                  item.kind === "file"
                    ? "text-current/60"
                    : "text-amber-500"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
