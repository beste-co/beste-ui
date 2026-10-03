"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type VersionStatus = "active" | "draft" | "archived";

interface Automation19Version {
  tag: string;
  status: VersionStatus;
  date: string;
  author?: string;
}

interface Automation19Props {
  heading?: string;
  versions?: Automation19Version[];
  activeLabel?: string;
  draftLabel?: string;
  archivedLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const STATUS_CLASSES: Record<VersionStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  draft: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  archived: "bg-current/10 text-current/60",
};


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

export const automation19Demo: Automation19Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  versions: [
    { tag: "v3", status: "active", date: "Apr 20" },
    { tag: "v2", status: "draft", date: "Apr 14" },
    { tag: "v1", status: "archived", date: "Mar 30" },
  ],
  activeLabel: "Active",
  draftLabel: "Draft",
  archivedLabel: "Archived",
};

export function Automation19({
  heading,
  versions = [],
  activeLabel = "Active",
  draftLabel = "Draft",
  archivedLabel = "Archived",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Automation19Props) {
  const statusLabels: Record<VersionStatus, string> = {
    active: activeLabel,
    draft: draftLabel,
    archived: archivedLabel,
  };
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
          "flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        {heading && (
          <span className="text-xs font-medium text-current/60">
            {heading}
          </span>
        )}
        <ol className="flex flex-col divide-y divide-border">
          {versions.map((v) => (
            <li
              key={v.tag}
              className="flex items-center gap-2 py-1.5 first:pt-0 last:pb-0"
            >
              <span className="text-sm font-semibold tabular-nums">
                {v.tag}
              </span>
              <span
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-xs font-medium",
                  STATUS_CLASSES[v.status]
                )}
              >
                {statusLabels[v.status]}
              </span>
              <span className="ml-auto flex items-baseline gap-1.5 text-xs tabular-nums text-current/60">
                {v.author && (
                  <>
                    <span>{v.author}</span>
                    <span>·</span>
                  </>
                )}
                <span>{v.date}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
