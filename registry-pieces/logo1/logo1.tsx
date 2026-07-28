"use client";
import { Box, Globe, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type IconKey = "zap" | "sparkle" | "box" | "globe";
type Tone = "primary" | "foreground" | "sunset";

interface Logo1Props {
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
  globe: Globe,
};

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
};

export const logo1Demo: Logo1Props = {
  image: "https://oud.pics/sm/l/stripe.jpeg",
  alt: "Stripe",
  tone: "sunset",
};

export function Logo1({
  icon = "zap",
  image,
  alt = "Brand",
  tone = "primary",
  className,
}: Logo1Props) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2">
        {image ? (
          <span className="relative size-8 overflow-hidden rounded-lg bg-card shadow-sm">
            <img
              src={image}
              alt={alt}
              className="absolute inset-0 size-full object-cover"
            />
          </span>
        ) : (
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg shadow-sm",
              toneClasses[tone]
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </div>
        )}
        <span className="text-lg font-bold tracking-tight text-card-foreground">
          {alt}
        </span>
      </div>
    </div>
  );
}
