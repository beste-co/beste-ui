"use client";
import { Box, Flame, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type IconKey = "zap" | "sparkle" | "box" | "flame";
type Tone =
  | "primary"
  | "foreground"
  | "ocean"
  | "aurora"
  | "sunset"
  | "emerald";

interface Logo2Props {
  name?: string;
  tagline?: string;
  icon?: IconKey;
  image?: string;
  alt?: string;
  tone?: Tone;
  className?: string;
}

const iconMap: Record<IconKey, typeof Zap> = {
  zap: Zap,
  sparkle: Sparkles,
  box: Box,
  flame: Flame,
};

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm",
  foreground: "bg-foreground text-background shadow-sm",
  ocean:
    "bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30",
  aurora:
    "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30",
  sunset:
    "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30",
  emerald:
    "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30",
};

export const logo2Demo: Logo2Props = {
  name: "Notion",
  tagline: "The connected workspace",
  image: "https://oud.pics/sm/l/notion.png",
  alt: "Notion",
  tone: "ocean",
};

export function Logo2({
  name = "Brand",
  tagline,
  icon = "zap",
  image,
  alt,
  tone = "ocean",
  className,
}: Logo2Props) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3">
        {image ? (
          <span className="relative size-10 overflow-hidden rounded-xl bg-card shadow-sm">
            <img
              src={image}
              alt={alt ?? name}
              className="absolute inset-0 size-full object-cover"
            />
          </span>
        ) : (
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              toneClasses[tone]
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight tracking-tight text-card-foreground">
            {name}
          </span>
          {tagline && (
            <span className="text-xs leading-tight text-muted-foreground">
              {tagline}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
