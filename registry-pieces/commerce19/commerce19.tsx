"use client";
import { cn } from "@/lib/utils";

interface Commerce19Item {
  image: string;
  name: string;
  price: string;
}

interface Commerce19Props {
  items?: Commerce19Item[];
  bordered?: boolean;
  className?: string;
}

export const commerce19Demo: Commerce19Props = {
  items: [
    {
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop",
      name: "Air Max 90",
      price: "$129",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop",
      name: "Diver Watch",
      price: "$420",
    },
    {
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop",
      name: "Leather Pack",
      price: "$340",
    },
    {
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop",
      name: "Studio HP",
      price: "$299",
    },
  ],
  bordered: false,
};

export function Commerce19({ items = [], bordered = false, className }: Commerce19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <span className="text-xs font-semibold text-card-foreground">
          Recently viewed
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {items.slice(0, 4).map((it, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                <img
                  src={it.image}
                  alt={it.name}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <span className="truncate text-xs tabular-nums text-card-foreground">
                {it.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
