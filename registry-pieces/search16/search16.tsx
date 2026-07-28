"use client";

import { Camera, ImageIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search16Props {
  filename?: string;
  placeholder?: string;
  image?: string;
  className?: string;
}

export const search16Demo: Search16Props = {
  filename: "linen-chair.jpg",
  placeholder: "Find similar products",
  image:
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=160&auto=format&fit=crop",
};

export function Search16({
  filename,
  placeholder = "Visual search",
  image,
  className,
}: Search16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-xl border border-border bg-card p-1.5 pr-3 shadow-sm">
        <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 text-white">
          {image ? (
            <img
              src={image}
              alt={filename ?? "Uploaded image"}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-4" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {filename && (
            <span className="truncate text-xs font-medium text-card-foreground">
              {filename}
            </span>
          )}
          <span className="truncate text-xs text-muted-foreground">
            {placeholder}
          </span>
        </div>
        <button
          type="button"
          className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
          aria-label="Remove image"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
        <span className="h-6 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted-foreground/10"
          aria-label="Upload another image"
        >
          <Camera className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90"
          aria-label="Search"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
