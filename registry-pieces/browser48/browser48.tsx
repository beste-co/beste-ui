"use client";

import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

interface Browser48Props {
  /** The address before and after the move */
  url?: { before: string; after: string };
  title?: string;
  subtitle?: string;
  /** The foot line before and after; the dot turns orange with the second */
  note?: { before: string; after: string };
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot's width instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const browser48Demo: Browser48Props = {
  url: { before: "ticketplatform.com/e/48213", after: "lisboncraftsummit.com" },
  title: "Lisbon Craft Summit",
  subtitle: "14 to 16 October",
  note: { before: "Listed next to other events", after: "Your own address and audience" },
  framed: true,
};

const STYLES = `
@keyframes browser48-old { 0%, 38% { opacity: 1 } 43%, 88% { opacity: 0 } 93%, 100% { opacity: 1 } }
@keyframes browser48-new { 0%, 45% { opacity: 0 } 50%, 82% { opacity: 1 } 87%, 100% { opacity: 0 } }
.browser48-old { animation: browser48-old 12s ease infinite }
.browser48-new { opacity: 0; animation: browser48-new 12s ease infinite }
@media (prefers-reduced-motion: reduce) { .browser48-old, .browser48-new { animation: none } .browser48-old { opacity: 0 } .browser48-new { opacity: 1 } }
`;

export function Browser48({ url, title, subtitle, note, framed = true, fill = false, className }: Browser48Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-68",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")} aria-hidden="true">
          {url && (
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3.5 py-2.5 text-xs">
              <Lock className="size-3 shrink-0 text-muted-foreground" />
              <span className="grid min-w-0">
                <span className="browser48-old col-start-1 row-start-1 truncate text-muted-foreground/80">{url.before}</span>
                <span className="browser48-new col-start-1 row-start-1 truncate text-foreground">{url.after}</span>
              </span>
            </div>
          )}
          <div className="px-3.5 pt-4 pb-3.5">
            <p className="truncate text-sm font-medium tracking-tight">{title}</p>
            {subtitle && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>}
            {note && (
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs">
                <span className="grid size-1.5 shrink-0">
                  <span className="browser48-old col-start-1 row-start-1 rounded-full bg-muted-foreground/40" />
                  <span className="browser48-new col-start-1 row-start-1 rounded-full bg-chart-1" />
                </span>
                <span className="grid min-w-0">
                  <span className="browser48-old col-start-1 row-start-1 truncate text-muted-foreground">{note.before}</span>
                  <span className="browser48-new col-start-1 row-start-1 truncate text-foreground/80">{note.after}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
