"use client";

import { Scroll } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal22Props {
  affiant?: string;
  sworn?: string;
  statement?: string;
  jurisdiction?: string;
  sealed?: boolean;
  className?: string;
}

export const legal22Demo: Legal22Props = {
  affiant: "I, Rosa M. Álvarez,",
  sworn: "being duly sworn,",
  statement:
    "hereby affirm that the attached exhibits are true and correct copies of the originals in my possession as of April 21, 2026.",
  jurisdiction: "Notarized · State of New York",
  sealed: true,
};

export function Legal22({
  affiant,
  sworn,
  statement,
  jurisdiction,
  sealed = false,
  className,
}: Legal22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-500">
              <Scroll className="size-3.5" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Affidavit
            </span>
          </div>
          {sealed && (
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
              Sealed
            </span>
          )}
        </div>
        <p className="rounded-md bg-muted p-2 text-sm leading-relaxed text-card-foreground">
          <span className="font-serif italic">{affiant}</span>{" "}
          <span className="font-serif italic">{sworn}</span> {statement}
        </p>
        {jurisdiction && (
          <span className="text-xs text-muted-foreground">{jurisdiction}</span>
        )}
      </div>
    </div>
  );
}
