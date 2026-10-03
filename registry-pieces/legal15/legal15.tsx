"use client";

import { Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal15Props {
  notary?: string;
  commission?: string;
  state?: string;
  expiry?: string;
  sealNo?: string;
  bordered?: boolean;
  className?: string;
}

export const legal15Demo: Legal15Props = {
  notary: "Agnes Obel",
  state: "State of New York",
  expiry: "Commission expires Oct 3, 2029",
  bordered: false,
};

export function Legal15({
  notary,
  commission,
  state,
  expiry,
  sealNo,
  bordered = false,
  className,
}: Legal15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="relative flex size-16 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-2 border-rose-600/70 bg-card text-center text-rose-700 shadow-sm dark:text-rose-300">
          <Stamp className="size-4" aria-hidden="true" />
          <span className="text-xs font-bold">
            Notary
          </span>
          {sealNo && <span className="text-xs">{sealNo}</span>}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {notary && (
            <span className="font-serif text-base italic text-card-foreground">
              {notary}
            </span>
          )}
          {commission && (
            <span className="text-xs text-muted-foreground">{commission}</span>
          )}
          {state && (
            <span className="text-xs text-card-foreground">{state}</span>
          )}
          {expiry && (
            <span className="text-xs text-muted-foreground">{expiry}</span>
          )}
        </div>
      </div>
    </div>
  );
}
