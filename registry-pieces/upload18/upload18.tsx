"use client";

import { Crop, RotateCw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Upload18Props {
  filename?: string;
  dimensions?: string;
  size?: string;
  imageSrc?: string;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1776757845431-87e426f718a4?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2Nnx8fGVufDB8fHx8fA%3D%3D";

export const upload18Demo: Upload18Props = {
  filename: "brand-hero.jpg",
  dimensions: "2400 × 1600",
  size: "1.4 MB",
  imageSrc: defaultImage,
};

export function Upload18({
  filename,
  dimensions,
  size,
  imageSrc = defaultImage,
  className,
}: Upload18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-2 shadow-sm">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <img
            src={imageSrc}
            alt="Image Preview"
            className="size-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-6 border-2 border-dashed border-white/90"
            aria-hidden="true"
          >
            <span className="absolute -left-1 -top-1 size-3 border-l-2 border-t-2 border-white" />
            <span className="absolute -right-1 -top-1 size-3 border-r-2 border-t-2 border-white" />
            <span className="absolute -bottom-1 -left-1 size-3 border-b-2 border-l-2 border-white" />
            <span className="absolute -bottom-1 -right-1 size-3 border-b-2 border-r-2 border-white" />
          </div>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold text-card-foreground">
              {filename}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {dimensions} · {size}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted"
              aria-label="Rotate"
            >
              <RotateCw className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted"
              aria-label="Crop"
            >
              <Crop className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded text-rose-500 hover:bg-rose-500/10"
              aria-label="Remove"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
