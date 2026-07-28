"use client";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce29Product {
  image: string;
  name: string;
  price: string;
}

interface Commerce29AttrValue {
  text?: string;
  yes?: boolean;
  no?: boolean;
}

interface Commerce29Row {
  label: string;
  a: Commerce29AttrValue;
  b: Commerce29AttrValue;
}

interface Commerce29Props {
  a?: Commerce29Product;
  b?: Commerce29Product;
  rows?: Commerce29Row[];
  className?: string;
}

export const commerce29Demo: Commerce29Props = {
  a: {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&auto=format&fit=crop",
    name: "Air Max 90",
    price: "$129",
  },
  b: {
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=160&auto=format&fit=crop",
    name: "Cloud Runner",
    price: "$159",
  },
  rows: [
    { label: "Material", a: { text: "Canvas" }, b: { text: "Knit mesh" } },
    { label: "Weight", a: { text: "320 g" }, b: { text: "240 g" } },
    { label: "Waterproof", a: { no: true }, b: { yes: true } },
    { label: "Rating", a: { text: "★ 4.7" }, b: { text: "★ 4.9" } },
  ],
};

function Cell({ value }: { value: Commerce29AttrValue }) {
  if (value.yes)
    return (
      <span
        className="inline-flex size-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        aria-hidden="true"
      >
        <Check className="size-2.5" strokeWidth={3} />
      </span>
    );
  if (value.no)
    return (
      <span
        className="inline-flex size-4 items-center justify-center rounded-full bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        <X className="size-2.5" strokeWidth={3} />
      </span>
    );
  return (
    <span className="font-mono text-xs tabular-nums text-card-foreground">
      {value.text}
    </span>
  );
}

export function Commerce29({ a, b, rows = [], className }: Commerce29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="grid grid-cols-[5rem_1fr_1fr] gap-2">
          <span aria-hidden="true" />
          {[a, b].map((p, i) =>
            p ? (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="relative size-12 overflow-hidden rounded-sm bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
                <span className="truncate text-xs font-semibold text-card-foreground">
                  {p.name}
                </span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {p.price}
                </span>
              </div>
            ) : (
              <div key={i} />
            )
          )}
        </div>
        <div className="flex flex-col gap-0.5 border-t border-border pt-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[5rem_1fr_1fr] items-center gap-2 py-1 text-xs"
            >
              <span className="truncate text-muted-foreground">{r.label}</span>
              <div className="flex items-center justify-center">
                <Cell value={r.a} />
              </div>
              <div className="flex items-center justify-center">
                <Cell value={r.b} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
