"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface Form52Entry {
  name: string;
  time?: string;
  message?: string;
  /** The message types itself in behind an orange caret */
  typing?: boolean;
}

interface Form52Props {
  title?: string;
  meta?: string;
  entries?: Form52Entry[];
  /** A quiet ruled line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const form52Demo: Form52Props = {
  title: "Inquiries",
  meta: "2 new",
  entries: [
    { name: "Sade Adu", message: "Are you taking new patients this month?", typing: true },
    { name: "Bonnie Raitt", message: "A check-up for my son" },
    { name: "Rhye", message: "Do you have parking near the practice?" },
  ],
  framed: true,
};

const STYLES = `
@keyframes form52-type { 0%, 8% { width: 0 } 44%, 86% { width: var(--form52-w) } 94%, 100% { width: 0 } }
@keyframes form52-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
.form52-type { width: var(--form52-w); animation: form52-type 12s infinite }
.form52-caret { animation: form52-blink 1.1s step-end infinite }
@media (prefers-reduced-motion: reduce) { .form52-type, .form52-caret { animation: none } .form52-caret { opacity: 0 } }
`;

export function Form52({ title, meta, entries = [], note, framed = true, fill = false, className }: Form52Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-85",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-semibold">{title}</span>
            {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
          </div>
          <div className="flex flex-col border-t border-border">
            {entries.map((entry, index) => {
              const message = entry.message ?? "";
              const typing = { "--form52-w": `${message.length + 1}ch`, animationTimingFunction: `steps(${Math.max(message.length, 1)}, end)` } as CSSProperties;
              return (
                <div key={index} className={cn("py-2.5", index < entries.length - 1 && "border-b border-border")}>
                  <div className="flex justify-between gap-3">
                    <span className="truncate font-medium">{entry.name}</span>
                    {entry.time && <span className="shrink-0 text-xs text-muted-foreground">{entry.time}</span>}
                  </div>
                  {message &&
                    (entry.typing ? (
                      <div className="mt-0.5 flex h-4 items-center text-xs text-muted-foreground">
                        <span className="sr-only">{message}</span>
                        <span aria-hidden="true" className="form52-type inline-block max-w-full overflow-hidden whitespace-nowrap" style={typing}>
                          {message}
                        </span>
                        <span aria-hidden="true" className="form52-caret ml-px h-3.25 w-0.5 shrink-0 bg-chart-1" />
                      </div>
                    ) : (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{message}</p>
                    ))}
                </div>
              );
            })}
          </div>
          {note && <p className="border-t border-border pt-2.5 text-xs text-muted-foreground">{note}</p>}
        </div>
      </div>
    </div>
  );
}
