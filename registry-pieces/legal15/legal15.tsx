"use client";

import { Stamp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal15Props {
  notary?: string;
  commission?: string;
  state?: string;
  expiry?: string;
  sealNo?: string;
  className?: string;
}

export const legal15Demo: Legal15Props = {
  notary: "Rosa M. Álvarez",
  commission: "Notary Public · Bar #284,911",
  state: "State of New York",
  expiry: "Commission expires Oct 3, 2029",
  sealNo: "NY-NP-77412",
};

export function Legal15({
  notary,
  commission,
  state,
  expiry,
  sealNo,
  className,
}: Legal15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative flex size-16 shrink-0 -rotate-6 flex-col items-center justify-center rounded-full border-2 border-rose-600/70 bg-card text-center text-rose-700 shadow-sm dark:text-rose-300">
          <Stamp className="size-4" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Notary
          </span>
          <span className="font-mono text-xs">{sealNo}</span>
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
            <span className="mt-1 text-xs text-muted-foreground">{expiry}</span>
          )}
        </div>
      </div>
    </div>
  );
}
