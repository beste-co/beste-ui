"use client";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce6Props {
  image?: string;
  name?: string;
  variant?: string;
  price?: string;
  qty?: number;
  tone?: Tone;
  className?: string;
}

const ctaClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-foreground/90",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  sky: "bg-sky-500 text-white hover:bg-sky-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
  rose: "bg-rose-500 text-white hover:bg-rose-600",
};

export const commerce6Demo: Commerce6Props = {
  image:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=256&auto=format&fit=crop",
  name: "Nomad Diver Watch",
  variant: "Black · Steel band",
  price: "$420",
  qty: 1,
  tone: "foreground",
};

export function Commerce6({
  image,
  name = "Product",
  variant,
  price = "$0",
  qty = 1,
  tone = "foreground",
  className,
}: Commerce6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-muted">
            {image && (
              <img
                src={image}
                alt={name}
                className="absolute inset-0 size-full object-cover"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold text-card-foreground">
              {name}
            </span>
            {variant && (
              <span className="truncate text-xs text-muted-foreground">
                {variant}
              </span>
            )}
          </div>
          <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-card-foreground">
            {price}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-sm border border-border">
            <button
              type="button"
              className="flex size-7 items-center justify-center text-muted-foreground hover:bg-muted"
              aria-label="Decrease"
            >
              <Minus className="size-3" />
            </button>
            <span className="flex w-7 items-center justify-center font-mono text-xs tabular-nums text-card-foreground">
              {qty}
            </span>
            <button
              type="button"
              className="flex size-7 items-center justify-center text-muted-foreground hover:bg-muted"
              aria-label="Increase"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <button
            type="button"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors",
              ctaClasses[tone]
            )}
          >
            <ShoppingBag className="size-3.5" aria-hidden="true" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
