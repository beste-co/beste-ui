"use client";
import { cn } from "@/lib/utils";

interface Photo {
  src?: string;
  alt?: string;
}

interface Media10Props {
  photos?: Photo[];
  className?: string;
}

export const media10Demo: Media10Props = {
  photos: [
    {
      src: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Portrait 1",
    },
    {
      src: "https://images.unsplash.com/photo-1504275490777-45f30792f13f?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YiUyNnclMjBwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
      alt: "Portrait 2",
    },
    {
      src: "https://images.unsplash.com/photo-1660251406411-589fa0b05604?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGIlMjZ3JTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
      alt: "Portrait 3",
    },
    {
      src: "https://images.unsplash.com/photo-1620111693292-65bc19cc79d2?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGIlMjZ3JTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
      alt: "Portrait 4",
    },
  ],
};

export function Media10({ photos = [], className }: Media10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex rotate-2 flex-col gap-1.5 rounded-sm bg-white p-1.5 shadow-xl shadow-black/30">
        {photos.slice(0, 4).map((photo, i) => (
          <div
            key={i}
            className="relative size-16 overflow-hidden rounded-sm bg-zinc-200"
          >
            {photo.src && (
              <img
                src={photo.src}
                alt={photo.alt ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
