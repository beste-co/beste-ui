"use client";

import { cn } from "@/lib/utils";

interface Editor88Row {
  label: string;
  value: string;
  /** Show the value as a small stone pill */
  pill?: boolean;
}

interface Editor88Props {
  image?: string;
  title?: string;
  /** The dot status before publishing, and the green line after */
  draftLabel?: string;
  liveLabel?: string;
  /** A static quiet line under the title, e.g. "Project · 6 images" */
  meta?: string;
  /** A quiet stand-in each value fades in over, e.g. "Add text" */
  placeholder?: string;
  /** What publishing does, each value sliding in after the other */
  rows?: Editor88Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor88Demo: Editor88Props = {
  image: "https://oud.pics/b/beste/oriel-facial.webp",
  title: "What a calming facial does for reactive skin",
  draftLabel: "Draft",
  liveLabel: "Published",
  rows: [
    { label: "Structured data", value: "Added" },
    { label: "Sitemap", value: "Updated" },
    { label: "Post lists", value: "Listed" },
    { label: "Portuguese translation", value: "Linked" },
  ],
  framed: true,
};

const STYLES = `
@keyframes editor88-draft { 0%, 16% { opacity: 1; } 19%, 95% { opacity: 0; } 98%, 100% { opacity: 1; } }
@keyframes editor88-live { 0%, 20% { opacity: 0; } 23%, 91% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes editor88-val { 0%, 24% { opacity: 0; transform: translateX(-0.375rem); } 30%, 92% { opacity: 1; transform: none; } 96%, 100% { opacity: 0; } }
.editor88-draft { opacity: 0; animation: editor88-draft 12s ease -5s infinite; }
.editor88-live { animation: editor88-live 12s ease -5s infinite; }
@keyframes editor88-ph { 0%, 24% { opacity: 1; } 30%, 92% { opacity: 0; } 96%, 100% { opacity: 1; } }
.editor88-val { animation: editor88-val 12s ease infinite; }
.editor88-ph { animation: editor88-ph 12s ease infinite; }
@media (prefers-reduced-motion: reduce) {
  .editor88-draft, .editor88-live, .editor88-val, .editor88-ph { animation: none; }
  .editor88-ph { opacity: 0; }
}
`;

export function Editor88({ image, title, draftLabel, liveLabel, meta, placeholder, rows = [], framed = true, fill = false, className }: Editor88Props) {
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
        <div className={cn("flex flex-col gap-1 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(image || title) && (
            <div className="flex items-center gap-3 pb-3">
              {image && <img src={image} alt="" aria-hidden="true" className="size-14 shrink-0 rounded-lg object-cover" />}
              <div className="min-w-0">
                {title && <p className="text-sm leading-snug font-semibold">{title}</p>}
                {meta && <p className="mt-0.5 text-muted-foreground">{meta}</p>}
                {(draftLabel || liveLabel) && (
                  <div className="relative mt-1 h-4">
                    {draftLabel && (
                      <span className="editor88-draft absolute top-0 left-0 flex items-center gap-1.5 whitespace-nowrap text-muted-foreground">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
                        {draftLabel}
                      </span>
                    )}
                    {liveLabel && <span className="editor88-live absolute top-0 left-0 whitespace-nowrap text-emerald-700 dark:text-emerald-400">{liveLabel}</span>}
                  </div>
                )}
              </div>
            </div>
          )}
          {rows.map((row, index) => (
            <div key={index} className="flex items-center justify-between gap-3 border-t border-border py-2.5">
              <span className={cn("truncate", placeholder && "text-muted-foreground")}>{row.label}</span>
              <span className="grid shrink-0 justify-items-end">
                {placeholder && (
                  <span className="editor88-ph col-start-1 row-start-1 text-muted-foreground/70" style={{ animationDelay: `${-5 + index * 0.6}s` }}>
                    {placeholder}
                  </span>
                )}
                <span
                  className={cn(
                    "editor88-val col-start-1 row-start-1",
                    row.pill ? "rounded-full bg-muted px-2 py-0.5 text-foreground/70" : placeholder ? "text-card-foreground" : "text-muted-foreground",
                  )}
                  style={{ animationDelay: `${-5 + index * 0.6}s` }}
                >
                  {row.value}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
