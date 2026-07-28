"use client";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "forest"
  | "midnight";

interface Media3Props {
  src?: string;
  alt?: string;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-400 via-orange-400 to-amber-300",
  ocean: "bg-gradient-to-br from-sky-500 via-cyan-400 to-teal-300",
  forest: "bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-400",
  midnight: "bg-gradient-to-br from-indigo-900 via-violet-800 to-slate-900",
};

export const media3Demo: Media3Props = {
  src: "https://images.unsplash.com/photo-1593558628703-535b2556320b?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN1bW1lcnxlbnwwfHwwfHx8MA%3D%3D",
  alt: "Mountain ridge in warm light",
  caption: "Summer '26",
  tone: "sunset",
};

export function Media3({
  src,
  alt,
  caption,
  tone = "sunset",
  className,
}: Media3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="-rotate-3 rounded-sm bg-white p-2.5 pb-5 shadow-sm shadow-black/10">
        <div
          className={cn(
            "relative size-28 overflow-hidden rounded-sm",
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
        {caption && (
          <div className="mt-2.5 text-center">
            <span className="font-serif text-sm italic text-zinc-800">
              {caption}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
