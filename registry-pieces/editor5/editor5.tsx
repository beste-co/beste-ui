"use client";

import { ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeItem {
  label: string;
  depth: number;
  kind: "folder" | "folderOpen" | "file";
  active?: boolean;
}

interface Editor5Props {
  items?: TreeItem[];
  className?: string;
}

export const editor5Demo: Editor5Props = {
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

export function Editor5({ items = [], className }: Editor5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-56 flex-col gap-0.5 rounded-md border border-border bg-card py-1.5 font-mono text-xs shadow-sm">
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
                  ? "bg-muted text-card-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
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
                    ? "text-muted-foreground"
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
