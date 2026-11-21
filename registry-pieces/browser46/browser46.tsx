"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser46Props {
  /** The address in the browser bar */
  domain?: string;
  heading?: string;
  /** A quiet line under the heading, e.g. the site name */
  subheading?: string;
  /** How many masked characters the field shows */
  dots?: number;
  /** The hint on the right of the field */
  fieldLabel?: string;
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const browser46Demo: Browser46Props = {
  domain: "orielstudio.pt",
  heading: "This site is private",
  dots: 8,
  framed: true,
};

export function Browser46({ domain, heading, subheading, dots = 8, fieldLabel, note, framed = true, fill = false, className }: Browser46Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-140",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-card text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center gap-3 border-b border-border px-3.5 py-2.5">
            <div className="flex w-10 gap-1.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
            </div>
            <div className="flex min-w-0 flex-1 justify-center">
              {domain && (
                <span className="flex min-w-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <Lock aria-hidden="true" className="size-3 shrink-0" />
                  <span className="truncate">{domain}</span>
                </span>
              )}
            </div>
            <span className="w-10" aria-hidden="true" />
          </div>
          <div className="flex flex-col items-center px-6 pt-12 pb-10 text-center md:px-16 md:pt-16 md:pb-14">
            <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground" aria-hidden="true">
              <Lock className="size-5" strokeWidth={1.7} />
            </span>
            {heading && <p className="mt-5 text-xl font-medium tracking-tight">{heading}</p>}
            {subheading && <p className="mt-1.5 text-sm text-muted-foreground">{subheading}</p>}
            <div className="mt-6 flex w-full max-w-75 items-center gap-2.5 rounded-lg bg-muted px-3.5 py-3 text-left ring-1 ring-border">
              <span className="flex flex-1 items-center gap-1.5" aria-hidden="true">
                {Array.from({ length: dots }, (_, index) => (
                  <span key={index} className="size-1.5 rounded-full bg-foreground" />
                ))}
              </span>
              {fieldLabel && <span className="text-xs text-muted-foreground">{fieldLabel}</span>}
            </div>
            {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
