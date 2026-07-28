"use client";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "forest"
  | "midnight";

interface Media18Props {
  src?: string;
  alt?: string;
  title?: string;
  author?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-400",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-600",
  forest: "bg-gradient-to-br from-emerald-600 to-teal-400",
  midnight: "bg-gradient-to-br from-indigo-900 to-slate-900",
};

export const media18Demo: Media18Props = {
  src: "https://images.unsplash.com/photo-1519627457373-b60a0da1706b?w=300&auto=format&fit=crop&q=60",
  alt: "Still mountain lake",
  title: "The Long Quiet",
  author: "M. Halloran",
  tone: "midnight",
};

export function Media18({
  src,
  alt,
  title,
  author,
  tone = "midnight",
  className,
}: Media18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div
          className="absolute inset-y-1.5 right-0 w-1.5 translate-x-1 rounded-r-sm bg-gradient-to-r from-zinc-300 to-zinc-100 shadow-sm"
          aria-hidden="true"
        />
        <div
          className={cn(
            "relative h-40 w-28 overflow-hidden rounded-l-md rounded-r-sm shadow-xl shadow-black/30",
            !src && toneClasses[tone]
          )}
        >
          {src && (
            <img
              src={src}
              alt={alt ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <div
            className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent"
            aria-hidden="true"
          />
          {title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 pt-8">
              <p className="font-serif text-sm font-semibold leading-tight text-white">
                {title}
              </p>
              {author && (
                <p className="mt-0.5 text-xs text-white/75">{author}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
