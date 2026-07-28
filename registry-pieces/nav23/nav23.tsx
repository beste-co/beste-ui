"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MegaItem {
  label: string;
  description: string;
}

interface Nav23Props {
  heading?: string;
  items?: MegaItem[];
  imageSrc?: string;
  alt?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1719951565103-6069b7ae047d?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8";

export const nav23Demo: Nav23Props = {
  heading: "Products",
  items: [
    {
      label: "Blocks",
      description: "Copy-paste section templates",
    },
    {
      label: "Themes",
      description: "Design system starters",
    },
    {
      label: "Components",
      description: "Ready-to-style primitives",
    },
  ],
  imageSrc: defaultImage,
  alt: "Products preview",
};

export function Nav23({
  heading,
  items = [],
  imageSrc = defaultImage,
  alt,
  className,
}: Nav23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <div className="flex flex-1 flex-col gap-1 p-2">
          {heading && (
            <span className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {heading}
            </span>
          )}
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="group flex items-start gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold text-card-foreground">
                  {item.label}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
              <ArrowUpRight
                className="size-3 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        {imageSrc && (
          <div className="relative w-28 shrink-0 border-l border-border">
            <img
              src={imageSrc}
              alt={alt ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
