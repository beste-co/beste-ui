"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sky" | "emerald" | "violet" | "amber" | "rose";

interface Tooltip10Props {
  title?: string;
  subtitle?: string;
  dimensions?: string;
  imageSrc?: string;
  alt?: string;
  tone?: Tone;
  className?: string;
}

const fallbackClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  violet: "bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white",
  amber: "bg-gradient-to-br from-amber-400 to-rose-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 to-pink-500 text-white",
};

const defaultImage =
  "https://images.unsplash.com/photo-1686172932808-870de06c5b8a?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const tooltip10Demo: Tooltip10Props = {
  title: "hero-dashboard-dark.png",
  subtitle: "Uploaded by Mira · 2 days ago",
  dimensions: "2560 × 1440",
  imageSrc: defaultImage,
  alt: "hero-dashboard-dark preview",
  tone: "violet",
};

export function Tooltip10({
  title,
  subtitle,
  dimensions,
  imageSrc = defaultImage,
  alt,
  tone = "violet",
  className,
}: Tooltip10Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="relative">
        <div className="flex w-52 flex-col gap-2 rounded-lg border border-border bg-card p-2 shadow-xl">
          <div
            className={cn(
              "relative flex aspect-video items-center justify-center overflow-hidden rounded-md",
              !imageSrc && fallbackClasses[tone]
            )}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={alt ?? title ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <ImageIcon className="size-6 opacity-80" aria-hidden="true" />
            )}
            {dimensions && (
              <span className="absolute bottom-1 right-1 rounded bg-background/90 px-1.5 py-0.5 font-mono text-xs text-card-foreground">
                {dimensions}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 px-1 pb-1">
            {title && (
              <span className="truncate text-xs font-semibold text-card-foreground">{title}</span>
            )}
            {subtitle && <span className="truncate text-xs text-muted-foreground">{subtitle}</span>}
          </div>
        </div>
        <div
          className="absolute -bottom-1 left-8 size-2 rotate-45 border-b border-r border-border bg-card"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
