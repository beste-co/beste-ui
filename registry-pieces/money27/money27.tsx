"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Ticker {
  symbol: string;
  name: string;
  price: number;
}

interface Money27Props {
  tickers?: Ticker[];
  intervalMs?: number;
  bordered?: boolean;
  className?: string;
}

interface Row extends Ticker {
  base: number;
  flashId: number;
  up: boolean;
}

export const money27Demo: Money27Props = {
  tickers: [
    { symbol: "BTC", name: "Bitcoin", price: 64120.5 },
    { symbol: "ETH", name: "Ethereum", price: 3412.2 },
    { symbol: "AAPL", name: "Apple", price: 189.35 },
  ],
  bordered: false,
};

function money(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function Money27({
  tickers = [],
  intervalMs = 1200,
  bordered = false,
  className,
}: Money27Props) {
  const [rows, setRows] = useState<Row[]>(() =>
    tickers.map((t) => ({ ...t, base: t.price, flashId: 0, up: true }))
  );

  useEffect(() => {
    if (!tickers.length) return;
    const id = setInterval(() => {
      setRows((prev) => {
        const index = Math.floor(Math.random() * prev.length);
        return prev.map((row, i) => {
          if (i !== index) return row;
          const drift = (Math.random() - 0.5) * row.base * 0.004;
          const pull = (row.base - row.price) * 0.1;
          const next = Math.max(0.01, row.price + drift + pull);
          return {
            ...row,
            price: next,
            up: next >= row.price,
            flashId: row.flashId + 1,
          };
        });
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [tickers.length, intervalMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes money27-flash { from { opacity: 1; } to { opacity: 0; } } @keyframes money27-pop { from { opacity: 0; transform: translateY(0.2rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className={cn("flex w-full max-w-72 flex-col rounded-xl bg-card shadow-sm", bordered && "border border-border")}>
        <ul className="flex flex-col py-1.5">
          {rows.map((row) => {
            const pct = ((row.price - row.base) / row.base) * 100;
            const positive = pct >= 0;
            return (
              <li
                key={row.symbol}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-card-foreground"
                  aria-hidden="true"
                >
                  {row.symbol.slice(0, 2)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium text-card-foreground">
                    {row.symbol}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {row.name}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="relative rounded px-1 text-sm font-medium tabular-nums text-card-foreground">
                    {row.flashId > 0 && (
                      <span
                        key={row.flashId}
                        className={cn(
                          "absolute inset-0 rounded motion-reduce:hidden",
                          row.up ? "bg-emerald-500/20" : "bg-rose-500/20"
                        )}
                        style={{ animation: "money27-flash 700ms ease-out forwards" }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{money(row.price)}</span>
                  </span>
                  <span
                    key={`pct-${row.flashId}`}
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums motion-reduce:animate-none",
                      positive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    )}
                    style={{ animation: "money27-pop 350ms ease-out" }}
                  >
                    {positive ? "+" : ""}
                    {pct.toFixed(2)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
