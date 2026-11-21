"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { StagePanel } from "@/components/beste/component/stage-panel";
import { cn } from "@/lib/utils";

type Layout = "stack" | "inline";
type Size = "sm" | "default" | "lg";
type MediaFade = "top" | "bottom" | "both";
type TitleSize = "md" | "lg";

export interface StageCardProps {
  /** The quiet line above the copy, e.g. "By hand" */
  label?: string;
  description?: string;
  /** An icon in a small white tile, for cards without media */
  icon?: LucideIcon | ((props: { className?: string }) => ReactNode);
  /** A small picture in the same tile instead of an icon */
  iconImage?: { src: string; alt?: string };
  /** A piece shown in the free space above the copy */
  media?: ReactNode;
  /** Let the media fade out at its bottom edge, its top edge or both */
  mediaFade?: MediaFade;
  /** A photograph filling the card, with the copy in white over a dark fade at its foot */
  photo?: { src: string; alt: string };
  /** A sky look (dawn, haze, azure, dusk, mist, apricot, lilac, sage, stone, night) or a picture URL, filling the whole card behind the media */
  backdrop?: string;
  /** A short ticked list under the description */
  points?: string[];
  link?: { label: string; href: string };
  /** Makes the whole card a link; a `link` then shows as its call to action */
  href?: string;
  /** Icon over copy, or the icon beside the copy */
  layout?: Layout;
  /** Minimum height: none, a short tile, or a tall feature card */
  size?: Size;
  /** The label as a quiet line ("md"), or as a larger title over the copy ("lg") */
  titleSize?: TitleSize;
  className?: string;
}

const fadeStyles: Record<MediaFade, string> = {
  top: "mask-t-from-50%",
  bottom: "mask-b-from-50%",
  both: "mask-y-from-75%",
};

const sizeStyles: Record<Size, string> = {
  sm: "",
  default: "min-h-60",
  lg: "min-h-110 md:min-h-120",
};

export const stageCardDemo: StageCardProps = {
  label: "With Bestie",
  description: "Ask for a section, a form or a page and Bestie adds it to your draft, with nothing to connect.",
  iconImage: { src: "https://oud.pics/b/beste/bestie-jelly.webp" },
};

export function StageCard({ label, description, icon: Icon, iconImage, media, mediaFade, photo, backdrop, points = [], link, href, layout = "stack", size = "default", titleSize = "md", className }: StageCardProps) {
  const tile = (Icon || iconImage) && (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-foreground/75 ring-1 ring-border">
      {iconImage ? <img src={iconImage.src} alt={iconImage.alt ?? ""} className="size-6.5 object-contain" /> : Icon && <Icon className="size-5" />}
    </span>
  );

  // Gradients behind the copy stay light in every theme, so the copy on them keeps a fixed dark ink
  // A photo or the night sky takes white copy; a light sky keeps a fixed dark ink in every theme
  const onDark = Boolean(photo) || backdrop === "night";
  const onArt = Boolean(backdrop) && !onDark;
  const copy = (label || description || link || points.length > 0) && (
    <div className={cn("relative", !tile && "px-1")}>
      {label && (
        <h3
          className={cn(
            titleSize === "lg" ? "mb-2.5 text-xl font-medium tracking-tight md:text-2xl" : "mb-2 text-base",
            titleSize === "lg"
              ? onDark ? "text-white" : onArt ? "text-neutral-950" : "text-foreground"
              : onDark ? "text-white/75" : onArt ? "text-neutral-950/60" : "text-muted-foreground"
          )}
        >
          {href && !link ? (
            <span className="inline-flex items-center gap-2">
              {label}
              <ArrowRight aria-hidden="true" className="size-4 -translate-x-1 opacity-0 transition duration-300 group-hover/card:translate-x-0 group-hover/card:opacity-100" />
            </span>
          ) : (
            label
          )}
        </h3>
      )}
      {description && <p className={cn("max-w-lg text-base leading-relaxed", onDark ? "text-white" : onArt ? "text-neutral-950" : "text-foreground")}>{description}</p>}
      {points.length > 0 && (
        <ul className={cn("mt-3 flex flex-col gap-2 text-sm", onDark ? "text-white/85" : onArt ? "text-neutral-950/80" : "text-foreground/80")}>
          {points.map((point, index) => (
            <li key={index} className="flex gap-2.5 leading-snug">
              <Check aria-hidden="true" className={cn("size-4 shrink-0", onDark ? "text-white" : onArt ? "text-neutral-950" : "text-foreground")} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
      {link &&
        (href ? (
          // The whole card is the link, so this only shows the call to action
          <span className={cn("mt-4 inline-flex items-center gap-1.5 text-sm transition-colors", onDark ? "text-white/85 group-hover/card:text-white" : onArt ? "text-neutral-950/75 group-hover/card:text-neutral-950" : "text-foreground/75 group-hover/card:text-foreground")}>
            {link.label}
            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5" />
          </span>
        ) : (
          <a href={link.href} className={cn("group/stage-card mt-4 inline-flex cursor-pointer items-center gap-1.5 text-sm transition-colors", onDark ? "text-white/85 hover:text-white" : onArt ? "text-neutral-950/75 hover:text-neutral-950" : "text-foreground/75 hover:text-foreground")}>
            {link.label}
            <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover/stage-card:translate-x-0.5" />
          </a>
        ))}
    </div>
  );

  return (
    <StagePanel
      surface={backdrop ? "image" : "muted"}
      image={backdrop ? { src: backdrop } : undefined}
      className={cn("flex p-6.5 md:p-7", layout === "inline" ? "flex-row items-start gap-4.5" : "flex-col justify-between gap-8", sizeStyles[size], href && "group/card", className)}
    >
      {photo && (
        <>
          <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-10 size-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 from-10% via-black/45 via-50% to-transparent to-80%" />
        </>
      )}
      {tile && <div className="relative">{tile}</div>}
      {/* With the whole card as a link, the piece is only a picture: not clickable, not focusable */}
      {media && <div inert={href ? true : undefined} className={cn("relative flex flex-1 items-center justify-center", mediaFade && fadeStyles[mediaFade])}>{media}</div>}
      {photo && !media && <div className="flex-1" />}
      {copy}
      {href && (
        <a href={href} aria-label={label ?? link?.label ?? description} className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none" />
      )}
    </StagePanel>
  );
}
