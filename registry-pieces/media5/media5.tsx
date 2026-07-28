"use client";
import { cn } from "@/lib/utils";

interface Photo {
  src?: string;
  alt?: string;
}

interface Media5Props {
  photos?: Photo[];
  className?: string;
}

const rotations = ["-rotate-6", "rotate-2", "-rotate-2"];
const offsets = ["-translate-x-6", "translate-x-0", "translate-x-6"];

export const media5Demo: Media5Props = {
  photos: [
    {
      src: "https://images.unsplash.com/photo-1519627457373-b60a0da1706b?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
      alt: "Mountain lake",
    },
    {
      src: "https://images.unsplash.com/photo-1459314079206-9970f36c7784?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Forest canopy",
    },
    {
      src: "https://images.unsplash.com/photo-1605185189315-fc269c231e41?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGVtb258ZW58MHx8MHx8fDA%3D",
      alt: "Alpine ridge",
    },
  ],
};

export function Media5({ photos = [], className }: Media5Props) {
  const shown = photos.slice(0, 3);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative size-32">
        {shown.map((photo, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 rounded-sm bg-white p-1.5 pb-4 shadow-sm shadow-black/10 transition-transform",
              rotations[i],
              offsets[i]
            )}
            style={{ zIndex: i + 1 }}
          >
            <div className="relative size-full overflow-hidden rounded-sm bg-muted">
              {photo.src && (
                <img
                  src={photo.src}
                  alt={photo.alt ?? ""}
                  className="absolute inset-0 size-full object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
