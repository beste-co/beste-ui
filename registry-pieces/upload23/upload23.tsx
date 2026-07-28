"use client";

import { cn } from "@/lib/utils";

interface Upload23Props {
  filename?: string;
  dimensions?: string;
  size?: string;
  imageSrc?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1773414001281-7e1cadd04a79?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2Mnx8fGVufDB8fHx8fA%3D%3D";

export const upload23Demo: Upload23Props = {
  filename: "brand-hero.jpg",
  dimensions: "2400 × 1600",
  size: "1.4 MB",
  imageSrc: defaultImage,
};

export function Upload23({
  filename,
  dimensions,
  size,
  imageSrc = defaultImage,
  className,
}: Upload23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-md border border-border bg-card p-2 shadow-sm">
        <img
          src={imageSrc}
          alt="Image Row"
          className="size-14 shrink-0 rounded-md object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {filename}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {dimensions} · {size}
          </span>
        </div>
      </div>
    </div>
  );
}
