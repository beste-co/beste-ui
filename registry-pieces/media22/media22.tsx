"use client";
import { cn } from "@/lib/utils";

interface Tile {
  src?: string;
  alt?: string;
}

interface Media22Props {
  tiles?: Tile[];
  label?: string;
  className?: string;
}

export const media22Demo: Media22Props = {
  label: "Moodboard · Winter",
  tiles: [
    {
      src: "https://images.unsplash.com/photo-1519627457373-b60a0da1706b?w=300&auto=format&fit=crop&q=60",
      alt: "Mountain lake",
    },
    {
      src: "https://images.unsplash.com/photo-1605185189315-fc269c231e41?w=200&auto=format&fit=crop&q=60",
      alt: "Alpine ridge",
    },
    {
      src: "https://images.unsplash.com/photo-1459314079206-9970f36c7784?q=80&w=200&auto=format&fit=crop",
      alt: "Forest canopy",
    },
  ],
};

export function Media22({ tiles = [], label, className }: Media22Props) {
  const shown = tiles.slice(0, 3);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-1.5 shadow-sm">
        <div className="grid h-28 w-40 grid-cols-3 grid-rows-2 gap-1.5">
          {shown.map((tile, i) => (
            <div
              key={i}
              className={cn(
                "relative overflow-hidden rounded-md bg-muted",
                i === 0 && "col-span-2 row-span-2"
              )}
            >
              {tile.src && (
                <img
                  src={tile.src}
                  alt={tile.alt ?? ""}
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
        {label && (
          <span className="px-1 pb-0.5 text-center text-xs text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
