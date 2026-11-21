"use client";

import { cn } from "@/lib/utils";

interface Editor100Props {
  page?: string;
  path?: string;
  draftLabel?: string;
  /** The orange pill the draft turns into */
  liveLabel?: string;
  className?: string;
}

export const editor100Demo: Editor100Props = {
  page: "Treatments",
  draftLabel: "Draft",
  liveLabel: "Published",
};

const STYLES = `
@keyframes editor100-off { 0%, 30% { opacity: 1 } 34%, 86% { opacity: 0 } 90%, 100% { opacity: 1 } }
@keyframes editor100-on { 0%, 35% { opacity: 0 } 39%, 80% { opacity: 1 } 84%, 100% { opacity: 0 } }
.editor100-off { animation: editor100-off 10s ease -3s infinite }
.editor100-on { opacity: 0; animation: editor100-on 10s ease -3s infinite }
@media (prefers-reduced-motion: reduce) { .editor100-off, .editor100-on { animation: none } .editor100-off { opacity: 0 } .editor100-on { opacity: 1 } }
`;

export function Editor100({ page, path, draftLabel, liveLabel, className }: Editor100Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{STYLES}</style>
      <div className="flex h-14 max-w-full items-center gap-3.5 rounded-full bg-card pr-2.5 pl-5 text-card-foreground shadow-lg">
        {page && <span className="truncate text-sm">{page}</span>}
        {path && <span className="truncate text-xs text-muted-foreground">{path}</span>}
        <span className="relative grid h-8.5 w-24 shrink-0 text-xs">
          <span className="editor100-off col-start-1 row-start-1 flex items-center justify-center gap-1.5 rounded-full bg-muted text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
            {draftLabel}
          </span>
          <span className="editor100-on col-start-1 row-start-1 flex items-center justify-center gap-1.5 rounded-full bg-chart-1 text-white">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-white" />
            {liveLabel}
          </span>
        </span>
      </div>
    </div>
  );
}
