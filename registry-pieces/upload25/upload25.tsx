"use client";

import { cn } from "@/lib/utils";

interface Upload25Props {
  imageSrc?: string;
  output?: string;
  className?: string;
}

export const upload25Demo: Upload25Props = {
  imageSrc:
    "https://images.unsplash.com/photo-1612350109947-4ef9a3cbf6f2?w=250&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzOHx8fGVufDB8fHx8fA%3D%3D",
  output: "1200 × 630",
};

export function Upload25({
  imageSrc,
  output,
  className,
}: Upload25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative w-36 overflow-hidden rounded-md border border-border bg-muted shadow-sm">
        <img
          src={imageSrc}
          alt="Crop Frame"
          className="aspect-square w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-3 border-2 border-dashed border-white"
          aria-hidden="true"
        >
          <span className="absolute -left-1 -top-1 size-2.5 border-l-2 border-t-2 border-white" />
          <span className="absolute -right-1 -top-1 size-2.5 border-r-2 border-t-2 border-white" />
          <span className="absolute -bottom-1 -left-1 size-2.5 border-b-2 border-l-2 border-white" />
          <span className="absolute -bottom-1 -right-1 size-2.5 border-b-2 border-r-2 border-white" />
        </div>
        {output && (
          <span className="absolute bottom-1 right-1 rounded-sm bg-background/85 px-1.5 py-0.5 font-mono text-xs text-card-foreground backdrop-blur">
            {output}
          </span>
        )}
      </div>
    </div>
  );
}
