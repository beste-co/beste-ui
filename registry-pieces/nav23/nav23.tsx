"use client";

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
  bordered?: boolean;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1719951565103-6069b7ae047d?q=80&w=400&h=600&auto=format&fit=crop";

export const nav23Demo: Nav23Props = {
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
  bordered: false,
};

export function Nav23({
  heading,
  items = [],
  imageSrc = defaultImage,
  alt,
  bordered = false,
  className,
}: Nav23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 overflow-hidden rounded-lg bg-card shadow-lg", bordered && "border border-border")}>
        <div className="flex flex-1 flex-col gap-1 p-2">
          {heading && (
            <span className="px-2 pb-1 text-xs font-semibold text-muted-foreground">
              {heading}
            </span>
          )}
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="flex min-w-0 flex-col rounded-md px-2 py-1.5 text-left hover:bg-muted"
            >
              <span className="text-sm font-semibold text-card-foreground">
                {item.label}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {item.description}
              </span>
            </button>
          ))}
        </div>
        {imageSrc && (
          <div className="relative w-28 shrink-0 self-stretch overflow-hidden border-l border-border">
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
