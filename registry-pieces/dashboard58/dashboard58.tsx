"use client";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface Dashboard58Row {
  label: string;
  /** Where it lives today, another tool's address */
  before: string;
  /** Where it lives once it moves onto the site */
  after: string;
}

interface Dashboard58Props {
  title?: string;
  /** The quiet header text before and after the move */
  meta?: { before?: string; after?: string };
  rows?: Dashboard58Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard58Demo: Dashboard58Props = {
  title: "Lumen Spanish",
  meta: { before: "3 places", after: "lumenspanish.com" },
  rows: [
    { label: "Course", before: "course.app", after: "/course" },
    { label: "Sign-up list", before: "forms.app", after: "/sign-up" },
    { label: "Landing page", before: "landing.page", after: "/spanish-b1" },
  ],
  framed: true,
};

const STYLES = `
@keyframes dashboard58-old { 0%, 38% { opacity: 1 } 43%, 88% { opacity: 0 } 93%, 100% { opacity: 1 } }
@keyframes dashboard58-new { 0%, 45% { opacity: 0 } 50%, 82% { opacity: 1 } 87%, 100% { opacity: 0 } }
.dashboard58-old { animation: dashboard58-old 12s ease infinite }
.dashboard58-new { opacity: 0; animation: dashboard58-new 12s ease infinite }
@media (prefers-reduced-motion: reduce) { .dashboard58-old, .dashboard58-new { animation: none } .dashboard58-old { opacity: 0 } .dashboard58-new { opacity: 1 } }
`;

function Swap({ before, after, external }: { before?: string; after?: string; external?: boolean }) {
  return (
    <span className="grid shrink-0 justify-items-end">
      <span className="dashboard58-old col-start-1 row-start-1 flex items-center gap-1 whitespace-nowrap text-muted-foreground/80">
        {before}
        {external && <ArrowUpRight aria-hidden="true" className="size-2.5" />}
      </span>
      <span className="dashboard58-new col-start-1 row-start-1 whitespace-nowrap text-muted-foreground">{after}</span>
    </span>
  );
}

export function Dashboard58({ title, meta, rows = [], framed = true, fill = false, className }: Dashboard58Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-66",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card px-3.5 py-3 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
            <span className="truncate text-sm font-medium">{title}</span>
            {meta && <Swap before={meta.before} after={meta.after} />}
          </div>
          {rows.map((row, index) => (
            <div key={index} className={cn("flex items-center justify-between gap-3 py-2", index > 0 && "border-t border-border")}>
              <span className="truncate">{row.label}</span>
              <Swap before={row.before} after={row.after} external />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
