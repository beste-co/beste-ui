"use client";
import { cn } from "@/lib/utils";

interface Media16Props {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
}

export const media16Demo: Media16Props = {
  src: "https://images.unsplash.com/photo-1459314079206-9970f36c7784?q=80&w=300&auto=format&fit=crop",
  alt: "Forest canopy from below",
  caption: "Untitled, 2026",
};

export function Media16({ src, alt, caption, className }: Media16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 p-1.5 shadow-xl shadow-black/30">
        <div className="rounded-sm bg-white p-3 pb-4">
          <div className="relative h-32 w-28 overflow-hidden border border-zinc-200 bg-muted">
            {src && (
              <img
                src={src}
                alt={alt ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            )}
          </div>
          {caption && (
            <p className="mt-3 text-center font-serif text-xs italic text-zinc-500">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
