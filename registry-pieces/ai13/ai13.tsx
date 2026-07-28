"use client";
import { cn } from "@/lib/utils";

interface Variant {
  src?: string;
  alt?: string;
  tint?: string;
}

interface Ai13Props {
  variants?: Variant[];
  selected?: number;
  className?: string;
}

export const ai13Demo: Ai13Props = {
  selected: 0,
  variants: [
    {
      src: "https://images.unsplash.com/photo-1688644707880-3d0df0fb2dc5?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
      alt: "Mountain ridge",
    },
    {
      src: "https://images.unsplash.com/photo-1545696648-86c761bc5410?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8",
      alt: "Mountain lake",
    },
    {
      src: "https://images.unsplash.com/photo-1601469090980-fc95e8d95544?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8",
      alt: "Forest canopy",
    },
    {
      src: "https://images.unsplash.com/photo-1607957333562-c760eee665ef?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI2fHx8ZW58MHx8fHx8",
      alt: "Starry night",
    },
  ],
};

export function Ai13({
  variants = [],
  selected = -1,
  className,
}: Ai13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-40 grid-cols-2 gap-1.5">
        {variants.slice(0, 4).map((v, i) => (
          <div
            key={i}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border",
              selected === i
                ? "border-2 border-primary"
                : "border-border"
            )}
          >
            {v.src && (
              <img
                src={v.src}
                alt={v.alt ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <span className="absolute bottom-1 right-1 rounded-sm bg-black/60 px-1 font-mono text-xs font-semibold tabular-nums text-white">
              {i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
