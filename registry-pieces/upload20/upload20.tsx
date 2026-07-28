"use client";

import { cn } from "@/lib/utils";

interface Upload20Props {
  thumbs?: string[];
  total?: number;
  label?: string;
  className?: string;
}

const defaultThumbs = [
  "https://images.unsplash.com/photo-1774275987532-4abf5c59c887?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1774275985337-0be016f154d5?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1774275987947-10827121ea45?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1648597628449-b5c9a2786707?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
];

export const upload20Demo: Upload20Props = {
  thumbs: defaultThumbs,
  total: 24,
  label: "Recent uploads",
};

export function Upload20({
  thumbs = defaultThumbs,
  total = 0,
  label,
  className,
}: Upload20Props) {
  const visible = thumbs.slice(0, 4);
  const extra = Math.max(0, total - visible.length);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-2 rounded-md border border-border bg-card p-2 shadow-sm">
        <div className="flex -space-x-2">
          {visible.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              className="size-8 rounded-md object-cover ring-2 ring-card"
            />
          ))}
          {extra > 0 && (
            <span className="flex size-8 items-center justify-center rounded-md bg-muted font-mono text-xs font-semibold text-card-foreground ring-2 ring-card">
              +{extra}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {label && (
            <span className="truncate text-xs font-semibold text-card-foreground">
              {label}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {total} items
          </span>
        </div>
      </div>
    </div>
  );
}
