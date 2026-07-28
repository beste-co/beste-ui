"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel21Props {
  refund?: string;
  cancelBy?: string;
  note?: string;
  className?: string;
}

export const travel21Demo: Travel21Props = {
  refund: "Full refund",
  cancelBy: "Cancel free before May 10 · 23:59 local",
  note: "50% refund if cancelled between May 11 and May 20. Non-refundable after.",
};

export function Travel21({
  refund,
  cancelBy,
  note,
  className,
}: Travel21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-emerald-500 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500 text-white">
            <RotateCcw className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Cancellation policy
            </span>
            {refund && (
              <span className="text-base font-bold text-card-foreground">
                {refund}
              </span>
            )}
          </div>
        </div>
        {cancelBy && (
          <span className="text-sm font-semibold text-card-foreground">
            {cancelBy}
          </span>
        )}
        {note && (
          <span className="text-sm text-muted-foreground">{note}</span>
        )}
      </div>
    </div>
  );
}
