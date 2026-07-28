"use client";

import {
  AlignLeft,
  Bold,
  Italic,
  Link as LinkIcon,
  Strikethrough,
  Underline,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ItemId =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "align"
  | "link";

interface Toolbar1Props {
  active?: ItemId[];
  className?: string;
}

const items: { id: ItemId; Icon: typeof Bold; label: string }[] = [
  { id: "bold", Icon: Bold, label: "Bold" },
  { id: "italic", Icon: Italic, label: "Italic" },
  { id: "underline", Icon: Underline, label: "Underline" },
  { id: "strike", Icon: Strikethrough, label: "Strikethrough" },
  { id: "align", Icon: AlignLeft, label: "Align left" },
  { id: "link", Icon: LinkIcon, label: "Link" },
];

export const toolbar1Demo: Toolbar1Props = {};

export function Toolbar1({ active = [], className }: Toolbar1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-sm">
        {items.map(({ id, Icon, label }) => {
          const isActive = active.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
