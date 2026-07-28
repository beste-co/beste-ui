"use client";
import { cn } from "@/lib/utils";

interface Frame {
  src?: string;
  alt?: string;
}

interface Media14Props {
  frames?: Frame[];
  className?: string;
}

const SPROCKETS = Array.from({ length: 9 });

export const media14Demo: Media14Props = {
  frames: [
    {
      src: "https://images.unsplash.com/photo-1519627457373-b60a0da1706b?w=200&auto=format&fit=crop&q=60",
      alt: "Mountain lake",
    },
    {
      src: "https://images.unsplash.com/photo-1459314079206-9970f36c7784?q=80&w=200&auto=format&fit=crop",
      alt: "Forest canopy",
    },
    {
      src: "https://images.unsplash.com/photo-1605185189315-fc269c231e41?w=200&auto=format&fit=crop&q=60",
      alt: "Alpine ridge",
    },
  ],
};

export function Media14({ frames = [], className }: Media14Props) {
  const shown = frames.slice(0, 3);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="-rotate-2 rounded-sm bg-zinc-900 px-1.5 py-1 shadow-lg shadow-black/30">
        <div className="flex justify-between px-0.5 py-1" aria-hidden="true">
          {SPROCKETS.map((_, i) => (
            <span key={i} className="h-1.5 w-2 rounded-sm bg-zinc-700" />
          ))}
        </div>
        <div className="flex gap-1">
          {shown.map((frame, i) => (
            <div
              key={i}
              className="relative h-10 w-14 overflow-hidden bg-zinc-800"
            >
              {frame.src && (
                <img
                  src={frame.src}
                  alt={frame.alt ?? ""}
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-0.5 py-1" aria-hidden="true">
          {SPROCKETS.map((_, i) => (
            <span key={i} className="h-1.5 w-2 rounded-sm bg-zinc-700" />
          ))}
        </div>
      </div>
    </div>
  );
}
