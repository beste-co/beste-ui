"use client";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce12Item {
  image: string;
  name: string;
  qty: number;
  price: string;
}

interface Commerce12Props {
  items?: Commerce12Item[];
  subtotal?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const ctaClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-violet-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const commerce12Demo: Commerce12Props = {
  items: [
    {
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=128&auto=format&fit=crop",
      name: "Air Max 90",
      qty: 1,
      price: "$129",
    },
    {
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=128&auto=format&fit=crop",
      name: "Field Jacket",
      qty: 1,
      price: "$240",
    },
  ],
  subtotal: "$369",
  tone: "foreground",
  bordered: false,
};

export function Commerce12({
  items = [],
  subtotal = "$0",
  tone = "foreground",
  bordered = false,
  className,
}: Commerce12Props) {
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col rounded-md bg-card shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-card-foreground">
              Your bag
            </span>
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">
              {count}
            </span>
          </div>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {items.map((it, i) => (
            <li key={i} className="flex items-center gap-2 px-3 py-2">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-muted">
                <img
                  src={it.image}
                  alt={it.name}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-medium text-card-foreground">
                  {it.name}
                </span>
                {it.qty > 1 && (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    Qty {it.qty}
                  </span>
                )}
              </div>
              <span className="shrink-0 text-xs tabular-nums text-card-foreground">
                {it.price}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-muted-foreground">Subtotal</span>
            <span className="text-sm font-semibold tabular-nums text-card-foreground">
              {subtotal}
            </span>
          </div>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs font-semibold",
              ctaClasses[tone]
            )}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
