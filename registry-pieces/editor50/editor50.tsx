"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Editor50Props {
  sectionId?: string;
  title?: string;
  description?: string;
  addLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  loadMs?: number;
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

export const editor50Demo: Editor50Props = {
  sectionId: "hero181",
  title: "Portrait Hero",
  description:
    "Tall photograph beside a heading, a short paragraph and a checked benefit list.",
  addLabel: "Add to Page",
  surface: "card",
  bordered: true,
  inverted: false,
  loadMs: 1400,
};

/* The picker skeletons only the preview panel; the text under it is there from
   the first frame. Animating the same way keeps the card's height fixed. */
const STYLES = `
@keyframes editor50-sweep { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
@keyframes editor50-in { from { opacity: 0; } to { opacity: 1; } }
.editor50-sweep { animation: editor50-sweep 1600ms linear infinite; }
.editor50-in { animation: editor50-in 420ms ease-out both; }
@media (prefers-reduced-motion: reduce) {
  .editor50-sweep { display: none; }
  .editor50-in { animation: none; }
}
`;

export function Editor50({
  sectionId,
  title,
  description,
  addLabel,
  surface = "card",
  bordered = true,
  inverted = false,
  loadMs = 1400,
  className,
}: Editor50Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), loadMs);
    return () => clearTimeout(id);
  }, [loadMs]);

  const tone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "w-full max-w-72 overflow-hidden rounded-xl shadow-sm",
          tone,
          bordered && "border border-current/15"
        )}
      >
        <div
          className="relative flex h-24 items-center gap-3 bg-current/10 px-4"
          aria-hidden="true"
        >
          <div
            className={cn(
              "flex flex-1 flex-col gap-1.5",
              loaded ? "editor50-in" : "invisible"
            )}
          >
            <span className="h-2 w-4/5 rounded-full bg-current/40" />
            <span className="h-1.5 w-full rounded-full bg-current/20" />
            <span className="h-1.5 w-3/5 rounded-full bg-current/20" />
            <span className="mt-1 h-3 w-12 rounded-full bg-current/30" />
          </div>
          <div
            className={cn(
              "h-16 w-12 shrink-0 rounded-sm bg-current/15",
              loaded ? "editor50-in" : "invisible"
            )}
          />
          {!loaded && (
            <span className="editor50-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-current/20 to-transparent" />
          )}
        </div>

        <div className="flex flex-col gap-1 p-4">
          {sectionId && (
            <p className="font-mono text-xs opacity-60">{sectionId}</p>
          )}
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {description && (
            <p className="line-clamp-2 text-xs opacity-60">{description}</p>
          )}
          {addLabel && (
            <button
              type="button"
              className={cn(
                "mt-2 flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                inverted
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background"
              )}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              {addLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
