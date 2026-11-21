"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor92Props {
  title?: string;
  /** The address beside a small lock */
  domain?: string;
  /** Pages that go from draft to live one after another */
  pages?: string[];
  draftLabel?: string;
  liveLabel?: string;
  /** The foot line before publishing */
  pendingNote?: string;
  /** The foot line once everything is live */
  publishedNote?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor92Demo: Editor92Props = {
  title: "Publish",
  pages: ["Home", "Services", "Contact"],
  draftLabel: "Draft",
  liveLabel: "Live",
  framed: true,
};

const STYLES = `
@keyframes editor92-draft { 0%, 29% { opacity: 1 } 31.5%, 93.5% { opacity: 0 } 96%, 100% { opacity: 1 } }
@keyframes editor92-live { 0%, 32.5% { opacity: 0; transform: translateY(4px) } 35.5%, 89% { opacity: 1; transform: none } 91.5%, 100% { opacity: 0; transform: none } }
.editor92-draft { animation: editor92-draft 12s ease infinite }
.editor92-live { opacity: 0; animation: editor92-live 12s ease infinite }
@media (prefers-reduced-motion: reduce) {
  .editor92-draft, .editor92-live { animation: none }
  .editor92-draft { opacity: 0 }
  .editor92-live { opacity: 1 }
}
`;

const delay = (index: number) => ({ animationDelay: `${-3 + index * 0.6}s` });

export function Editor92({ title, domain, pages = [], draftLabel, liveLabel, pendingNote, publishedNote, framed = true, fill = false, className }: Editor92Props) {
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
        <div className={cn("flex flex-col rounded-2xl bg-card px-4 py-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || domain) && (
            <div className="flex items-center justify-between gap-3 pb-2.5">
              <span className="text-sm font-semibold">{title}</span>
              {domain && (
                <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                  <Lock aria-hidden="true" className="size-3 shrink-0" />
                  <span className="truncate">{domain}</span>
                </span>
              )}
            </div>
          )}
          {pages.map((page, index) => (
            <div key={index} className="flex items-center justify-between gap-3 border-t border-border py-2.5">
              <span className="truncate">{page}</span>
              <span className="grid shrink-0 justify-items-end">
                <span className="editor92-draft col-start-1 row-start-1 text-muted-foreground" style={delay(index)}>
                  {draftLabel}
                </span>
                <span className="editor92-live col-start-1 row-start-1 text-emerald-700" style={delay(index)}>
                  {liveLabel}
                </span>
              </span>
            </div>
          ))}
          {(pendingNote || publishedNote) && (
            <div className="grid border-t border-border pt-2.5 text-muted-foreground">
              <span className="editor92-draft col-start-1 row-start-1 truncate" style={delay(pages.length)}>
                {pendingNote}
              </span>
              <span className="editor92-live col-start-1 row-start-1 truncate" style={delay(pages.length)}>
                {publishedNote}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
