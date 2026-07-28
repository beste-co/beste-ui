"use client";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "violet"
  | "gold";

interface Media12Props {
  src?: string;
  alt?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-400",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-600",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
  gold: "bg-gradient-to-br from-amber-400 to-orange-500",
};

export const media12Demo: Media12Props = {
  src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&fit=crop",
  alt: "Album art",
  tone: "violet",
};

export function Media12({
  src,
  alt,
  tone = "sunset",
  className,
}: Media12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="relative size-36 animate-spin rounded-full bg-zinc-950 shadow-xl shadow-black/30"
        style={{ animationDuration: "8s", animationTimingFunction: "linear" }}
      >
        {[0.95, 0.85, 0.75, 0.65, 0.55, 0.45].map((scale, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border border-zinc-800"
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden="true"
          />
        ))}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-inner",
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
        </div>
        <span
          className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 ring-2 ring-zinc-700"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
