"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sunset" | "emerald" | "sky" | "violet";

interface Notification3Props {
  appName?: string;
  title?: string;
  description?: string;
  time?: string;
  image?: string;
  alt?: string;
  tone?: Tone;
  className?: string;
}

const iconTileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

export const notification3Demo: Notification3Props = {
  appName: "Linear",
  title: "New issue assigned",
  description: "ENG-482 · Crash on checkout submit",
  time: "now",
  image: "https://oud.pics/sm/l/linear.jpeg",
  alt: "Linear",
  tone: "violet",
};

export function Notification3({
  appName = "Linear",
  title,
  description,
  time = "now",
  image,
  alt,
  tone = "violet",
  className,
}: Notification3Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl">
        <div
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl",
            !image && iconTileClasses[tone]
          )}
        >
          {image ? (
            <img src={image} alt={alt ?? appName} className="absolute inset-0 size-full object-cover" />
          ) : (
            <Sparkles className="size-5" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {appName}
            </span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          {title && <span className="text-sm font-semibold text-card-foreground">{title}</span>}
          {description && (
            <span className="truncate text-sm text-muted-foreground">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
}
