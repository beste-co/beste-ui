"use client";

import type { ReactNode } from "react";
import { SkyGradient, type SkyPreset, skyPresets } from "@/components/beste/component/sky-gradient";
import { cn } from "@/lib/utils";

type Surface = "muted" | "sky" | "image" | "none";

export interface StagePanelProps {
  /** A soft stone tint with a hairline, a sky drawn in code, a photograph filling the panel, or nothing */
  surface?: Surface;
  /** The sky look when `surface` is "sky" */
  sky?: SkyPreset;
  /** The picture when `surface` is "image"; a sky look name here draws that sky instead */
  image?: { src: string; alt?: string; /** 0 to 1, lets the ground show through */ opacity?: number };
  children?: ReactNode;
  className?: string;
}

export const stagePanelDemo: StagePanelProps = {
  surface: "sky",
  sky: "dawn",
  image: { src: "https://images.unsplash.com/photo-1781708897820-e1cda3d96180?q=80&w=2400&auto=format&fit=crop" },
  className: "flex aspect-video w-full items-center justify-center p-6",
  children: (
    <div className="flex w-full max-w-64 items-center gap-3 rounded-2xl bg-card p-3 text-card-foreground shadow-lg">
      <img src="https://oud.pics/b/beste/oriel-studio.webp" alt="" className="size-12 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Oriel Skin Studio</p>
        <p className="truncate text-sm text-muted-foreground">Facials in Lisbon</p>
      </div>
    </div>
  ),
};

export function isSkyLook(src: string): src is SkyPreset {
  return Object.hasOwn(skyPresets, src);
}

/** A backdrop layer: a sky look name draws a SkyGradient, anything else shows as a picture */
export function StageBackdrop({ src, alt, opacity, className }: { src: string; alt?: string; opacity?: number; className?: string }) {
  if (isSkyLook(src)) return <SkyGradient preset={src} opacity={opacity} className={cn("absolute inset-0", className)} />;
  return (
    <img
      src={src}
      alt={alt ?? ""}
      aria-hidden={alt ? undefined : true}
      loading="lazy"
      decoding="async"
      style={opacity === undefined ? undefined : { opacity }}
      className={cn("absolute inset-0 size-full object-cover", className)}
    />
  );
}

export function StagePanel({ surface = "muted", sky = "dawn", image, children, className }: StagePanelProps) {
  const showImage = surface === "image" && Boolean(image?.src);
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-3xl",
        surface === "muted" && "border border-border bg-muted",
        (surface === "image" || surface === "sky") && "bg-muted",
        className,
      )}
    >
      {surface === "sky" && <SkyGradient preset={sky} className="absolute inset-0 -z-10" />}
      {showImage && image && <StageBackdrop src={image.src} alt={image.alt} opacity={image.opacity} className="-z-10" />}
      {children ?? <div className="aspect-video" />}
    </div>
  );
}
