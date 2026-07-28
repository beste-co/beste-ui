"use client";

import { cn } from "@/lib/utils";

interface Input30Props {
  label?: string;
  address?: string;
  chain?: string;
  className?: string;
}

export const input30Demo: Input30Props = {
  label: "Recipient wallet",
  address: "0x4A81b3cB5Fa11Ce2B492D8d7cF82C9Dd8B0E6fA0",
  chain: "Ethereum · Mainnet",
};

export function Input30({
  label,
  address = "",
  chain,
  className,
}: Input30Props) {
  const short = address.length > 16
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : address;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-xs font-bold text-white">
            Ξ
          </div>
          <span className="flex-1 truncate font-mono text-sm text-card-foreground">
            {short}
          </span>
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            ENS
          </span>
        </div>
        {chain && (
          <span className="text-xs text-muted-foreground">{chain}</span>
        )}
      </div>
    </div>
  );
}
