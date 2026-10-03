"use client";

import { cn } from "@/lib/utils";

interface LineItem {
  label: string;
  value: string;
}

interface Travel7Props {
  title?: string;
  items?: LineItem[];
  total?: string;
  perPerson?: string;
  bordered?: boolean;
  className?: string;
}

export const travel7Demo: Travel7Props = {
  items: [
    { label: "Base fare", value: "$284.00" },
    { label: "Taxes & fees", value: "$28.40" },
    { label: "Seat selection", value: "$12.00" },
  ],
  total: "$324.40",
  bordered: false,
};

export function Travel7({
  title,
  items = [],
  total,
  perPerson,
  bordered = false,
  className,
}: Travel7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {title && (
          <span className="text-xs font-semibold text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col gap-1">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="tabular-nums text-card-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-border pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-card-foreground">
              Total
            </span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {total}
            </span>
          </div>
          {perPerson && (
            <span className="text-xs text-muted-foreground">{perPerson}</span>
          )}
        </div>
      </div>
    </div>
  );
}
