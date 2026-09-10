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

type Surface = "card" | "glass";

type ItemId =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "align"
  | "link";

interface Toolbar1Props {
  active?: ItemId[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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

export const toolbar1Demo: Toolbar1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

export function Toolbar1({ active = [], surface = "card", bordered = true, inverted = false, className }: Toolbar1Props) {
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
          "inline-flex items-center gap-0.5 rounded-lg p-1 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
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
                  : "text-current/60 hover:bg-current/10 hover:text-current"
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
