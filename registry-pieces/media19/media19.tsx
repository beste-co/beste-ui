"use client";
import { cn } from "@/lib/utils";

interface Media19Props {
  src?: string;
  alt?: string;
  country?: string;
  value?: string;
  className?: string;
}

const TEETH_X = Array.from({ length: 7 });
const TEETH_Y = Array.from({ length: 9 });

export const media19Demo: Media19Props = {
  src: "https://images.unsplash.com/photo-1605185189315-fc269c231e41?w=200&auto=format&fit=crop&q=60",
  alt: "Alpine ridge at dusk",
  country: "Postes 2026",
  value: "$2",
};

export function Media19({
  src,
  alt,
  country,
  value,
  className,
}: Media19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative -rotate-3">
        <div
          className="absolute inset-x-1 -top-1 flex justify-between"
          aria-hidden="true"
        >
          {TEETH_X.map((_, i) => (
            <span key={i} className="size-2 rounded-full bg-white shadow-sm" />
          ))}
        </div>
        <div
          className="absolute inset-x-1 -bottom-1 flex justify-between"
          aria-hidden="true"
        >
          {TEETH_X.map((_, i) => (
            <span key={i} className="size-2 rounded-full bg-white shadow-sm" />
          ))}
        </div>
        <div
          className="absolute inset-y-1 -left-1 flex flex-col justify-between"
          aria-hidden="true"
        >
          {TEETH_Y.map((_, i) => (
            <span key={i} className="size-2 rounded-full bg-white shadow-sm" />
          ))}
        </div>
        <div
          className="absolute inset-y-1 -right-1 flex flex-col justify-between"
          aria-hidden="true"
        >
          {TEETH_Y.map((_, i) => (
            <span key={i} className="size-2 rounded-full bg-white shadow-sm" />
          ))}
        </div>

        <div className="relative bg-white p-1.5 shadow-md shadow-black/20">
          <div className="relative h-24 w-20 overflow-hidden border border-zinc-200 bg-muted">
            {src && (
              <img
                src={src}
                alt={alt ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            )}
            {value && (
              <span className="absolute right-1 top-1 rounded-sm bg-white/90 px-1 text-xs font-bold text-zinc-800">
                {value}
              </span>
            )}
          </div>
          {country && (
            <p className="mt-1 text-center font-serif text-xs italic text-zinc-600">
              {country}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
