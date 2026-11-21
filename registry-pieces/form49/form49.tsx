"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface Form49Props {
  image?: { src: string; alt: string };
  /** A quiet line above the title, e.g. the site name */
  site?: string;
  title?: string;
  /** Field labels */
  fields?: string[];
  /** What gets typed into each field in turn; without them the fields stay empty */
  values?: string[];
  draftLabel?: string;
  /** The green line the draft turns into */
  liveLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form49Demo: Form49Props = {
  image: { src: "https://oud.pics/b/beste/oriel-facial.webp", alt: "A facial treatment at the Oriel studio" },
  title: "Spring open day",
  fields: ["Name", "Email"],
  values: ["Norah Jones", "hello@beste.co"],
  draftLabel: "Draft",
  liveLabel: "Live",
  framed: true,
};

const STYLES = `
@keyframes form49-draft { 0%, 42% { opacity: 1 } 48%, 94% { opacity: 0 } 100% { opacity: 1 } }
@keyframes form49-live { 0%, 42% { opacity: 0 } 48%, 94% { opacity: 1 } 100% { opacity: 0 } }
.form49-draft { animation: form49-draft 10s ease infinite }
.form49-live { opacity: 0; animation: form49-live 10s ease infinite }
@keyframes form49-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.form49-type { display: inline-block; overflow: hidden; white-space: nowrap; vertical-align: bottom; width: 0 }
.form49-caret { animation: form49-blink 1s step-end infinite }
@media (prefers-reduced-motion: reduce) {
  .form49-draft, .form49-live, .form49-type, .form49-cursor { animation: none !important }
  .form49-draft { opacity: 0 } .form49-live { opacity: 1 } .form49-type { width: auto } .form49-cursor { display: none }
}
`;

// Fields fill one after another inside 4%..40% of the loop, each in an equal slice, then hold until the reset
function typingStyles(count: number) {
  const slice = 36 / Math.max(1, count);
  const pct = (value: number) => Math.min(100, Math.round(value * 100) / 100);
  return Array.from({ length: count }, (_, i) => {
    const start = 4 + i * slice;
    const end = start + slice * 0.78;
    return `@keyframes form49-type${i} { 0%, ${pct(start)}% { width: 0 } ${pct(end)}%, 94% { width: var(--form49-w) } 97%, 100% { width: 0 } }
@keyframes form49-cursor${i} { 0%, ${pct(start - 1)}% { opacity: 0 } ${pct(start)}%, ${pct(end + slice * 0.11)}% { opacity: 1 } ${pct(end + slice * 0.17)}%, 100% { opacity: 0 } }
.form49-type${i} { animation: form49-type${i} 10s infinite }
.form49-cursor${i} { opacity: 0; animation: form49-cursor${i} 10s linear infinite }`;
  }).join("\n");
}

export function Form49({ image, site, title, fields = [], values = [], draftLabel, liveLabel, framed = true, fill = false, className }: Form49Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES + typingStyles(Math.min(values.length, fields.length))}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-90",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex gap-3.5 rounded-2xl bg-card p-3.5 text-sm text-card-foreground", !framed && "shadow-lg")}>
          {image && (
            <div className="w-29.5 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {site && <span className="truncate text-xs text-muted-foreground">{site}</span>}
            {title && <span className="text-base leading-tight font-medium tracking-tight">{title}</span>}
            {fields.map((field, index) => {
              const value = values[index];
              return (
                <div key={index} className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{field}</span>
                  <span aria-hidden="true" className="flex h-7 items-center overflow-hidden rounded-md bg-background px-2 text-xs ring-1 ring-border">
                    {value && (
                      <>
                        <span
                          className={cn("form49-type", `form49-type${index}`)}
                          style={{ "--form49-w": `${value.length + 1}ch`, animationTimingFunction: `steps(${value.length}, end)` } as CSSProperties}
                        >
                          {value}
                        </span>
                        <span className={cn("form49-cursor", `form49-cursor${index}`)}>
                          <span className="form49-caret ml-px block h-3.5 w-px bg-foreground" />
                        </span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
            {(draftLabel || liveLabel) && (
              <span className="grid text-xs">
                {draftLabel && (
                  <span className="form49-draft col-start-1 row-start-1 flex items-center gap-1.5 text-muted-foreground">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
                    {draftLabel}
                  </span>
                )}
                {liveLabel && (
                  <span className="form49-live col-start-1 row-start-1 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                    {liveLabel}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
