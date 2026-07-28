"use client";
import { cn } from "@/lib/utils";

interface Media23Props {
  src?: string;
  alt?: string;
  name?: string;
  role?: string;
  stat?: string;
  className?: string;
}

export const media23Demo: Media23Props = {
  src: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?q=80&w=300&auto=format&fit=crop",
  alt: "Portrait",
  name: "Mara Lindqvist",
  role: "Creative Director",
  stat: "★ 98",
};

export function Media23({
  src,
  alt,
  name,
  role,
  stat,
  className,
}: Media23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-32 -rotate-1 rounded-xl bg-gradient-to-br from-fuchsia-400 via-sky-400 to-emerald-400 p-1 shadow-lg shadow-black/30">
        <div className="overflow-hidden rounded-lg bg-card">
          <div className="relative h-32 w-full overflow-hidden bg-muted">
            {src && (
              <img
                src={src}
                alt={alt ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              aria-hidden="true"
            />
            {stat && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                {stat}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 p-2">
            {name && (
              <span className="truncate text-sm font-bold text-card-foreground">
                {name}
              </span>
            )}
            {role && (
              <span className="truncate text-xs text-muted-foreground">
                {role}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
