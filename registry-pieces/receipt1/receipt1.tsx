"use client";

import { cn } from "@/lib/utils";

interface LineItem {
  label: string;
  amount: string;
}

interface Receipt1Props {
  merchant?: string;
  receiptLabel?: string;
  items?: LineItem[];
  total?: string;
  totalLabel?: string;
  className?: string;
}

export const receipt1Demo: Receipt1Props = {
  merchant: "Packer's Coffee",
  totalLabel: "Total",
  items: [
    { label: "Latte", amount: "$4.50" },
    { label: "Croissant", amount: "$3.25" },
    { label: "Mineral water", amount: "$2.00" },
  ],
  total: "$9.75",
};

export function Receipt1({
  merchant = "Store",
  receiptLabel,
  items = [],
  total,
  totalLabel = "Total",
  className,
}: Receipt1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-full max-w-56 flex-col gap-2 bg-white p-3 text-xs text-zinc-800 shadow-lg shadow-black/20"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% 97%, 92% 100%, 84% 97%, 76% 100%, 68% 97%, 60% 100%, 52% 97%, 44% 100%, 36% 97%, 28% 100%, 20% 97%, 12% 100%, 4% 97%, 0 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-0.5 border-b border-dashed border-zinc-300 pb-2">
          <span className="text-sm font-bold">
            {merchant}
          </span>
          {receiptLabel && (
            <span className="text-xs text-zinc-500">{receiptLabel}</span>
          )}
        </div>
        <ul className="flex flex-col gap-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <span className="truncate">{item.label}</span>
              <span className="shrink-0 tabular-nums">{item.amount}</span>
            </li>
          ))}
        </ul>
        {total && (
          <div className="flex items-center justify-between border-t border-dashed border-zinc-300 pt-2 text-sm font-bold">
            <span>{totalLabel}</span>
            <span className="tabular-nums">{total}</span>
          </div>
        )}
      </div>
    </div>
  );
}
