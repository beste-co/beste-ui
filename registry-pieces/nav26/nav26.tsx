"use client";

import { ChevronDown, ChevronRight, File, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeItem {
  label: string;
  type: "folder" | "file";
  open?: boolean;
  children?: TreeItem[];
  active?: boolean;
}

interface Nav26Props {
  items?: TreeItem[];
  className?: string;
}

export const nav26Demo: Nav26Props = {
  items: [
    {
      label: "app",
      type: "folder",
      open: true,
      children: [
        { label: "page.tsx", type: "file" },
        { label: "layout.tsx", type: "file", active: true },
      ],
    },
    {
      label: "components",
      type: "folder",
      open: false,
    },
    { label: "tailwind.config.ts", type: "file" },
  ],
};

function Row({
  item,
  depth,
}: {
  item: TreeItem;
  depth: number;
}) {
  const Icon = item.type === "folder" ? FolderOpen : File;
  const Chevron = item.open ? ChevronDown : ChevronRight;

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-1 rounded-md px-1 py-1 text-xs",
          item.active
            ? "bg-primary/15 text-primary"
            : "text-card-foreground hover:bg-muted"
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {item.type === "folder" ? (
          <Chevron
            className="size-3 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <span className="size-3 shrink-0" aria-hidden="true" />
        )}
        <Icon
          className={cn(
            "size-3.5 shrink-0",
            item.type === "folder"
              ? "text-amber-500"
              : "text-muted-foreground"
          )}
          aria-hidden="true"
        />
        <span className="truncate font-mono">{item.label}</span>
      </div>
      {item.open &&
        item.children?.map((child, idx) => (
          <Row key={idx} item={child} depth={depth + 1} />
        ))}
    </>
  );
}

export function Nav26({ items = [], className }: Nav26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-60 flex-col gap-0.5 rounded-md border border-border bg-card p-1 shadow-sm">
        {items.map((item, idx) => (
          <Row key={idx} item={item} depth={0} />
        ))}
      </div>
    </div>
  );
}
