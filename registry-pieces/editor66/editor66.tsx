"use client";

import { cn } from "@/lib/utils";

interface Editor66Change {
  /** A round photo of who made the change; without it the initial shows */
  image?: string;
  initial?: string;
  note?: string;
}

interface Editor66Props {
  title?: string;
  status?: string;
  verified?: string;
  waitingLabel?: string;
  changesLabel?: string;
  change?: Editor66Change;
  footnote?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor66Demo: Editor66Props = {
  title: "Publish",
  waitingLabel: "Waiting in the draft",
  changesLabel: "2 changes",
  change: { image: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop", note: "Prices and one photo, edited by the client." },
  framed: true,
};

export function Editor66({
  title,
  status,
  verified,
  waitingLabel,
  changesLabel,
  change,
  footnote,
  framed = true,
  fill = false,
  className,
}: Editor66Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-semibold">{title}</span>
            {status && <span className="shrink-0 text-muted-foreground">{status}</span>}
          </div>
          {verified && <div className="text-emerald-700">{verified}</div>}
          <div aria-hidden className="h-px bg-border" />
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm font-semibold">{waitingLabel}</span>
            {changesLabel && (
              <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-accent-foreground">{changesLabel}</span>
            )}
          </div>
          {change && (
            <div className="flex items-center gap-2.5 rounded-lg bg-muted p-2">
              {change.image ? (
                <img src={change.image} alt="" className="size-7 shrink-0 rounded-full object-cover" />
              ) : change.initial && (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-700">
                  {change.initial}
                </span>
              )}
              <span className="leading-snug text-muted-foreground">{change.note}</span>
            </div>
          )}
          {footnote && <div aria-hidden className="h-px bg-border" />}
          {footnote && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{footnote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
