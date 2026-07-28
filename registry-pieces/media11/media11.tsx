"use client";

import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "violet"
  | "midnight";

interface Media11Props {
  src?: string;
  alt?: string;
  title?: string;
  viewers?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-400",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-600",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
  midnight: "bg-gradient-to-br from-indigo-900 to-slate-900",
};

export const media11Demo: Media11Props = {
  src: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&fit=crop",
  alt: "Live event scene",
  title: "Launch Week · Day 3",
  viewers: "1.2K",
  tone: "midnight",
};

export function Media11({
  src,
  alt,
  title,
  viewers,
  tone = "midnight",
  className,
}: Media11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-video w-full max-w-64 overflow-hidden rounded-lg border border-border shadow-md",
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
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-rose-500 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          <span
            className="size-1.5 animate-pulse rounded-full bg-white"
            aria-hidden="true"
          />
          Live
        </span>
        {viewers && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            <Eye className="size-3" aria-hidden="true" />
            {viewers}
          </span>
        )}
        {title && (
          <span className="absolute bottom-2 left-2 right-2 truncate rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
