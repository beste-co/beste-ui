"use client";

import { File, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dashboard57Group {
  /** The folder name, e.g. a path segment */
  label: string;
  /** A quiet count on the right, e.g. "12 pages" */
  count?: string;
  pages?: string[];
  /** A quiet last line for the pages not listed, e.g. "9 more" */
  more?: string;
}

interface Dashboard57Props {
  title?: string;
  meta?: string;
  groups?: Dashboard57Group[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard57Demo: Dashboard57Props = {
  title: "Pages",
  groups: [
    { label: "treatments", count: "12 pages", pages: ["signature-facial", "calming-facial"] },
    { label: "locations", count: "3 pages", pages: ["chiado", "alfama"] },
  ],
  framed: true,
};

export function Dashboard57({ title, meta, groups = [], framed = true, fill = false, className }: Dashboard57Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-72",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {groups.map((group, index) => (
            <div key={index} className={cn("flex flex-col", index > 0 && "mt-1 border-t border-border")}>
              <div className="flex items-center justify-between gap-3 px-1 py-1.5">
                <span className="flex min-w-0 items-center gap-2">
                  <Folder aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{group.label}</span>
                </span>
                {group.count && <span className="shrink-0 text-muted-foreground">{group.count}</span>}
              </div>
              {group.pages?.map((page) => (
                <div key={page} className="flex min-w-0 items-center gap-2 py-1.5 pr-1 pl-6 text-foreground/80">
                  <File aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">{page}</span>
                </div>
              ))}
              {group.more && <div className="py-1.5 pr-1 pl-6 text-muted-foreground">{group.more}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
