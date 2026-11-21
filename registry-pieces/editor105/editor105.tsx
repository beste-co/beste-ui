"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor105Item {
  label: string;
  /** A reviewer's note; the item stays unticked on a soft highlight */
  note?: string;
}

interface Editor105Props {
  title?: string;
  /** A quiet line under the title */
  meta?: string;
  /** A stone pill on the right, e.g. "1 note" */
  tag?: string;
  /** Checks that tick off one after another; items with a note stay open */
  items?: Editor105Item[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor105Demo: Editor105Props = {
  title: "Review notes",
  items: [
    { label: "Real copy on every page" },
    { label: "One design set throughout" },
    { label: "Checked at every width", note: "The About heading wraps on a phone" },
    { label: "SEO title on every page" },
  ],
  framed: true,
};

const STYLES = `
@keyframes editor105-tick { 0%, 4% { opacity: 0; transform: scale(.6) } 8%, 86% { opacity: 1; transform: none } 92%, 100% { opacity: 0; transform: none } }
.editor105-tick { opacity: 0; animation: editor105-tick 15s cubic-bezier(.3,0,.2,1) infinite }
@media (prefers-reduced-motion: reduce) { .editor105-tick { animation: none; opacity: 1 } }
`;

export function Editor105({ title, meta, tag, items = [], framed = true, fill = false, className }: Editor105Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-1 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta || tag) && (
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold">{title}</span>
                {meta && <span className="truncate text-muted-foreground">{meta}</span>}
              </span>
              {tag && <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-foreground/75">{tag}</span>}
            </div>
          )}
          {items.map((item, index) =>
            item.note ? (
              <div key={index} className="-mx-1.5 my-0.5 flex flex-col gap-1.5 rounded-lg bg-muted px-1.5 py-2.5">
                <span className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="size-4 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </span>
                <span className="pl-6.5 leading-normal text-muted-foreground">{item.note}</span>
              </div>
            ) : (
              <div key={index} className={cn("flex items-center gap-2.5 py-2.5", !items[index - 1]?.note && "border-t border-border")}>
                <Check aria-hidden="true" className="editor105-tick size-4 shrink-0" style={{ animationDelay: `${-9 + index * 1.2}s` }} />
                <span className="text-sm">{item.label}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
