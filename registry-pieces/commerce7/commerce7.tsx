"use client";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce7Item {
  image: string;
  name: string;
  price: string;
}

interface Commerce7Props {
  title?: string;
  items?: Commerce7Item[];
  total?: string;
  savings?: string;
  tone?: Tone;
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

export const commerce7Demo: Commerce7Props = {
  title: "Frequently bought together",
  total: "$215",
  savings: "Save $20",
  items: [
    {
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&auto=format&fit=crop",
      name: "Air Max 90",
      price: "$129",
    },
    {
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=160&auto=format&fit=crop",
      name: "Cotton Tee",
      price: "$48",
    },
    {
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=160&auto=format&fit=crop",
      name: "Retro Shades",
      price: "$38",
    },
  ],
  tone: "foreground",
};

export function Commerce7({
  title = "Bundle",
  items = [],
  total = "$0",
  savings,
  tone = "foreground",
  className,
}: Commerce7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold text-card-foreground">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="flex flex-col items-center gap-1">
                <div className="relative size-14 overflow-hidden rounded-sm border border-border bg-muted">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {it.price}
                </span>
              </div>
              {i < items.length - 1 && (
                <Plus
                  className="size-3 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
              {total}
            </span>
            {savings && (
              <span className="rounded-sm bg-emerald-500/15 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {savings}
              </span>
            )}
          </div>
          <button
            type="button"
            className={cn(
              "rounded-sm px-2.5 py-1 text-xs font-semibold",
              ctaClasses[tone]
            )}
          >
            Add {items.length} items
          </button>
        </div>
      </div>
    </div>
  );
}
