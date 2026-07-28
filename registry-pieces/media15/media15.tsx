"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Slide {
  src?: string;
  alt?: string;
}

interface Media15Props {
  images?: Slide[];
  className?: string;
}

export const media15Demo: Media15Props = {
  images: [
    {
      src: "https://images.unsplash.com/photo-1593558628703-535b2556320b?w=200&auto=format&fit=crop&q=60",
      alt: "Mountain ridge in warm light",
    },
    {
      src: "https://images.unsplash.com/photo-1519627457373-b60a0da1706b?w=200&auto=format&fit=crop&q=60",
      alt: "Mountain lake",
    },
    {
      src: "https://images.unsplash.com/photo-1459314079206-9970f36c7784?q=80&w=200&auto=format&fit=crop",
      alt: "Forest canopy",
    },
  ],
};

export function Media15({ images = [], className }: Media15Props) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = images[index];

  const go = (delta: number) => {
    if (count === 0) return;
    setIndex((prev) => (prev + delta + count) % count);
  };

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative h-48 w-40 overflow-hidden rounded-lg border border-border bg-muted shadow-sm">
        {current?.src && (
          <img
            key={index}
            src={current.src}
            alt={current.alt ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {index + 1} / {count}
            </div>
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    i === index ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
