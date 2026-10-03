"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel21Props {
  refund?: string;
  cancelBy?: string;
  note?: string;
  bordered?: boolean;
  className?: string;
}

export const travel21Demo: Travel21Props = {
  refund: "Full refund",
  cancelBy: "Cancel free before May 10",
  bordered: false,
};

export function Travel21({
  refund,
  cancelBy,
  note,
  bordered = false,
  className,
}: Travel21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-emerald-500")}>
        <div className="flex items-center gap-2">
          <RotateCcw className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
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
