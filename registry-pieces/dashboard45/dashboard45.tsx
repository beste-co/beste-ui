"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface Dashboard45Row {
  title: string;
  /** A quiet line under the title */
  detail?: string;
  /** A small stone pill on the right */
  tag?: string;
}

interface Dashboard45Props {
  title?: string;
  /** A dot status beside the title, e.g. "Draft" */
  status?: string;
  /** A search line at the top in place of the title row */
  query?: string;
  /** A quiet caption over the rows */
  caption?: string;
  rows?: Dashboard45Row[];
  /** A muted last row, with an optional value on the right */
  footer?: { label: string; value?: string };
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard45Demo: Dashboard45Props = {
  title: "Pages",
  rows: [
    { title: "Home", detail: "Weekend ceramics classes in Porto", tag: "SEO set" },
    { title: "Classes", detail: "Book a weekend class", tag: "SEO set" },
    { title: "Collection", detail: "Handmade pieces from the studio", tag: "SEO set" },
  ],
  footer: { label: "Navigation and footer" },
  framed: true,
};

export function Dashboard45({ title, status, query, caption, rows = [], footer, framed = true, fill = false, className }: Dashboard45Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {query && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted px-2.5 py-2 leading-snug text-foreground/80">
              <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
              <span>{query}</span>
            </div>
          )}
          {(title || status) && (
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {status && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
                  {status}
                </span>
              )}
            </div>
          )}
          {caption && <p className="mb-0.5 text-muted-foreground">{caption}</p>}
          {rows.map((row, index) => (
            <div key={index} className="flex items-center justify-between gap-3 border-t border-border py-2.5">
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm">{row.title}</span>
                {row.detail && <span className="truncate text-muted-foreground">{row.detail}</span>}
              </span>
              {row.tag && <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-foreground/70">{row.tag}</span>}
            </div>
          ))}
          {footer && (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5 text-muted-foreground">
              <span>{footer.label}</span>
              {footer.value && <span className="truncate">{footer.value}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
