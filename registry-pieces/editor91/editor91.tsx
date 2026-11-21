"use client";

import { cn } from "@/lib/utils";

interface Editor91Props {
  title?: string;
  meta?: string;
  /** The item being edited, with a small photo */
  item?: { image?: string; name: string; detail?: string };
  /** Plain fields shown above the one being edited */
  fields?: { label: string; value: string }[];
  label?: string;
  /** Fixed text before the value, e.g. a currency */
  prefix?: string;
  before?: string;
  after?: string;
  /** A dot line while the field is being edited */
  editingLabel?: string;
  /** The line that replaces it once the value is in */
  doneLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor91Demo: Editor91Props = {
  title: "Treatments",
  item: { image: "https://oud.pics/b/beste/oriel-facial.webp", name: "Calming facial" },
  prefix: "From $",
  before: "45",
  after: "49",
  framed: true,
};

const STYLES = `
@keyframes editor91-a { 0%, 30% { opacity: 1 } 33%, 94% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes editor91-b { 0%, 36% { opacity: 0 } 39%, 88% { opacity: 1 } 91%, 100% { opacity: 0 } }
@keyframes editor91-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.editor91-a { opacity: 0; animation: editor91-a 10s ease infinite }
.editor91-b { animation: editor91-b 10s ease infinite }
.editor91-caret { animation: editor91-blink 1.1s step-end infinite }
@media (prefers-reduced-motion: reduce) { .editor91-a, .editor91-b, .editor91-caret { animation: none } }
`;

export function Editor91({ title, meta, item, fields = [], label, prefix, before, after, editingLabel, doneLabel, framed = true, fill = false, className }: Editor91Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-72",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold">{title}</span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}
          {item && (
            <div className="flex items-center gap-2.5">
              {item.image && <img src={item.image} alt="" aria-hidden="true" className="size-10 shrink-0 rounded-lg object-cover" />}
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-medium">{item.name}</span>
                {item.detail && <span className="truncate text-muted-foreground">{item.detail}</span>}
              </span>
            </div>
          )}
          {fields.map((field, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <span className="text-muted-foreground">{field.label}</span>
              <span className="truncate rounded-lg px-2.5 py-2 ring-1 ring-border">{field.value}</span>
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            {label && <span className="text-muted-foreground">{label}</span>}
            <div className="flex items-center rounded-lg bg-background px-2.5 py-2 tabular-nums ring-1 ring-border">
              {prefix}
              <span className="relative inline-grid">
                <span className="editor91-a col-start-1 row-start-1">{before}</span>
                <span className="editor91-b col-start-1 row-start-1">{after}</span>
              </span>
              <span aria-hidden="true" className="editor91-caret ml-0.5 h-3.5 w-0.5 bg-chart-1" />
            </div>
          </div>
          {(editingLabel || doneLabel) && (
            <div className="relative grid border-t border-border pt-2.5">
              {editingLabel && (
                <span className="editor91-a col-start-1 row-start-1 flex items-center gap-1.5 truncate text-muted-foreground">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  {editingLabel}
                </span>
              )}
              {doneLabel && <span className="editor91-b col-start-1 row-start-1 truncate text-emerald-700">{doneLabel}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
