"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  name: string;
  hint: string;
  initial: string;
  imageSrc?: string;
  alt?: string;
}

interface Form29Props {
  label?: string;
  selectedHint?: string;
  items?: Item[];
  selectedIndex?: number;
  className?: string;
}

export const form29Demo: Form29Props = {
  label: "Primary contact",
  selectedHint: "Start typing to search",
  items: [
    {
      name: "Beste Sözen",
      hint: "Design lead",
      initial: "M",
      imageSrc: "https://oud.pics/sm/l/gmail.jpeg",
      alt: "Beste Sözen",
    },
    {
      name: "Mirko Petrov",
      hint: "Engineer",
      initial: "M",
      imageSrc: "https://oud.pics/sm/l/stripe.jpeg",
      alt: "Mirko Petrov",
    },
    {
      name: "Noor Ahmed",
      hint: "Product",
      initial: "N",
      imageSrc: "https://oud.pics/sm/l/notion.png",
      alt: "Noor Ahmed",
    },
  ],
  selectedIndex: 0,
};

export function Form29({
  label,
  selectedHint,
  items = [],
  selectedIndex = 0,
  className,
}: Form29Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-card-foreground">{label}</label>}
        <div className="flex items-center gap-2 rounded-md border border-primary bg-card px-3 py-2 shadow-sm ring-2 ring-primary/20">
          <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="flex-1 truncate text-sm text-muted-foreground">{selectedHint}</span>
        </div>
        <div className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2",
                idx === selectedIndex && "bg-primary/10"
              )}
            >
              <div
                className={cn(
                  "relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white",
                  !item.imageSrc && "bg-gradient-to-br from-sky-500 to-indigo-500"
                )}
              >
                {item.imageSrc ? (
                  <img
                    src={item.imageSrc}
                    alt={item.alt ?? item.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  item.initial
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-card-foreground">
                  {item.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">{item.hint}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
