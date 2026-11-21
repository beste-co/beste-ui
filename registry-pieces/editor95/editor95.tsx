"use client";

import { cn } from "@/lib/utils";

interface Editor95Props {
  title?: string;
  meta?: string;
  /** The picked file, with a small preview */
  file?: { image?: string; name: string; detail?: string };
  /** Ruled settings under the file, e.g. what stays the same */
  rows?: { label: string; value: string }[];
  /** An empty-field hint each row value starts as, then gives way to the value on a loop */
  placeholder?: string;
  /** Labelled groups of ruled rows under the rows, e.g. Images and Motion */
  groups?: { label: string; rows: { label: string; value: string }[] }[];
  /** A ruled note at the foot: a quiet label over a sentence */
  note?: { label?: string; text: string };
  /** A ruled line with a quiet dot at the very foot */
  footnote?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor95Demo: Editor95Props = {
  title: "Image",
  meta: "Home · Hero",
  file: { image: "https://oud.pics/b/beste/oriel-facial.webp", name: "facial.jpg", detail: "Chosen from the library" },
  rows: [
    { label: "Crop", value: "Kept" },
    { label: "Size", value: "Kept" },
    { label: "Loading", value: "Preload" },
  ],
  framed: true,
};

const STYLES = `
@keyframes editor95-hint { 0%, 30% { opacity: 1 } 34%, 93% { opacity: 0 } 97%, 100% { opacity: 1 } }
@keyframes editor95-value { 0%, 36% { opacity: 0 } 40%, 87% { opacity: 1 } 91%, 100% { opacity: 0 } }
.editor95-hint { animation: editor95-hint 12s ease infinite }
.editor95-value { opacity: 0; animation: editor95-value 12s ease infinite }
@media (prefers-reduced-motion: reduce) { .editor95-hint, .editor95-value { animation: none } .editor95-hint { opacity: 0 } .editor95-value { opacity: 1 } }
`;

export function Editor95({ title, meta, file, rows = [], groups = [], placeholder, note, footnote, framed = true, fill = false, className }: Editor95Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {placeholder && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold">{title}</span>
              {meta && <span className="truncate text-muted-foreground">{meta}</span>}
            </div>
          )}
          {file && (
            <div className="flex items-center gap-2.5 rounded-lg bg-muted p-2">
              {file.image && <img src={file.image} alt="" aria-hidden="true" className="h-10 w-13 shrink-0 rounded-md object-cover" />}
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate">{file.name}</span>
                {file.detail && <span className="truncate text-muted-foreground">{file.detail}</span>}
              </span>
            </div>
          )}
          {rows.length > 0 && (
            <div className="flex flex-col border-t border-border">
              {rows.map((row, index) => (
                <div key={index} className="flex justify-between gap-3 border-b border-border py-2 last:border-b-0">
                  <span className={cn("shrink-0", placeholder && "text-muted-foreground")}>{row.label}</span>
                  {placeholder ? (
                    <span className="relative min-w-0 flex-1">
                      <span aria-hidden="true" className="editor95-hint absolute inset-0 truncate text-right text-muted-foreground/60">{placeholder}</span>
                      <span className="editor95-value block truncate text-right">{row.value}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          {groups.map((group, index) => (
            <div key={index} className="flex flex-col">
              <span className="pb-1.5 text-muted-foreground">{group.label}</span>
              {group.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-between gap-3 border-t border-border py-2">
                  <span className="shrink-0">{row.label}</span>
                  <span className="truncate text-muted-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          ))}
          {note && (
            <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
              {note.label && <span className="text-muted-foreground">{note.label}</span>}
              <span className="leading-normal text-foreground/80">{note.text}</span>
            </div>
          )}
          {footnote && (
            <div className="flex items-center gap-1.5 border-t border-border pt-2.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{footnote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
