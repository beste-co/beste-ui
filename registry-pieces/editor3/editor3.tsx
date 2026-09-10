"use client";

import { ChevronRight, File, Folder } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Crumb {
  label: string;
  kind?: "folder" | "file";
}

interface Editor3Props {
  crumbs?: Crumb[];
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

export const editor3Demo: Editor3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  crumbs: [
    { label: "src", kind: "folder" },
    { label: "components", kind: "folder" },
    { label: "beste", kind: "folder" },
    { label: "button.tsx", kind: "file" },
  ],
};

export function Editor3({ crumbs = [], surface = "card", bordered = true, inverted = false, className }: Editor3Props) {
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
          "inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-xs shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          const Icon = c.kind === "file" ? File : Folder;
          return (
            <Fragment key={i}>
              <div className="flex items-center gap-1">
                <Icon
                  className={cn(
                    "size-3 shrink-0",
                    c.kind === "folder"
                      ? "text-amber-500"
                      : "text-current/60"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "truncate",
                    isLast
                      ? "font-semibold"
                      : "text-current/60"
                  )}
                >
                  {c.label}
                </span>
              </div>
              {!isLast && (
                <ChevronRight
                  className="size-3 shrink-0 text-current/35"
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
