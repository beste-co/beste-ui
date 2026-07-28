"use client";

import { ChevronRight, File, Folder } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  kind?: "folder" | "file";
}

interface Editor3Props {
  crumbs?: Crumb[];
  className?: string;
}

export const editor3Demo: Editor3Props = {
  crumbs: [
    { label: "src", kind: "folder" },
    { label: "components", kind: "folder" },
    { label: "beste", kind: "folder" },
    { label: "button.tsx", kind: "file" },
  ],
};

export function Editor3({ crumbs = [], className }: Editor3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 font-mono text-xs shadow-sm">
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
                      : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "truncate",
                    isLast
                      ? "font-semibold text-card-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {c.label}
                </span>
              </div>
              {!isLast && (
                <ChevronRight
                  className="size-3 shrink-0 text-muted-foreground/60"
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
