"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface Editor94Props {
  /** The field name in the card header */
  title?: string;
  /** Small format buttons in the header; the first one is bold */
  tools?: string[];
  /** The text before the missing words */
  before?: string;
  /** The words that type themselves in */
  insert?: string;
  /** The text after them */
  after?: string;
  /** A dot line at the foot on the left */
  status?: string;
  /** A quiet line at the foot on the right */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor94Demo: Editor94Props = {
  title: "Heading",
  before: "Calm skin care in the ",
  insert: "heart of ",
  after: "Lisbon",
  framed: true,
};

const STYLES = `
@keyframes editor94-type { 0%, 22% { max-width: 0; } 44%, 86% { max-width: var(--editor94-w); } 92%, 100% { max-width: 0; } }
@keyframes editor94-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
.editor94-type { display: inline-block; overflow: hidden; white-space: pre; vertical-align: bottom; max-width: var(--editor94-w); animation: editor94-type 11s infinite; animation-delay: -5s; }
.editor94-caret { animation: editor94-blink 1.1s step-end infinite; }
@media (prefers-reduced-motion: reduce) { .editor94-type, .editor94-caret { animation: none; } }
`;

export function Editor94({ title, tools = [], before, insert = "", after, status, note, framed = true, fill = false, className }: Editor94Props) {
  // The insert widens one character per step, so the words type in rather than slide
  const typeStyle = { "--editor94-w": `${insert.length + 1}ch`, animationTimingFunction: `steps(${Math.max(insert.length, 1)}, end)` } as CSSProperties;

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">{title}</span>
            {tools.length > 0 && (
              <span aria-hidden="true" className="flex gap-1 text-foreground/70">
                {tools.map((tool, index) => (
                  <span key={index} className={cn("rounded-md bg-muted px-1.5 py-0.5", index === 0 && "font-semibold")}>
                    {tool}
                  </span>
                ))}
              </span>
            )}
          </div>
          <div className="min-h-16 rounded-lg bg-muted p-2.5 text-sm leading-snug ring-1 ring-foreground/20">
            {before}
            <span className="editor94-type border-b border-chart-1" style={typeStyle}>
              {insert}
            </span>
            <span aria-hidden="true" className="editor94-caret mx-px inline-block h-4 w-0.5 bg-chart-1 align-text-bottom" />
            {after}
          </div>
          {(status || note) && (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5 text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                <span className="truncate">{status}</span>
              </span>
              {note && <span className="shrink-0">{note}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
