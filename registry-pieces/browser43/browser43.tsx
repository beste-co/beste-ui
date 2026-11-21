"use client";

import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

interface Browser43Props {
  /** The address in the bar, with a lock before it */
  url?: string;
  /** The site's wordmark and its navigation, the current link darker */
  site?: string;
  links?: string[];
  current?: string;
  image?: { src: string; alt: string };
  meta?: string;
  title?: string;
  byline?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const browser43Demo: Browser43Props = {
  url: "orielstudio.pt/journal/calming-facial",
  site: "Oriel",
  links: ["Treatments", "Journal", "Visit"],
  current: "Journal",
  image: { src: "https://oud.pics/b/beste/oriel-facial.webp", alt: "A calming facial at the Oriel studio" },
  title: "What a calming facial does for reactive skin",
  byline: "Norah Jones",
  framed: true,
};

export function Browser43({ url, site, links = [], current, image, meta, title, byline, framed = true, fill = false, className }: Browser43Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-card text-xs text-card-foreground", !framed && "shadow-lg")}>
          {url && (
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5 text-muted-foreground">
              <Lock aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{url}</span>
            </div>
          )}
          <div className="bg-stone-50 px-3.5 pt-3 pb-4 text-stone-900">
            {(site || links.length > 0) && (
              <div className="flex items-center justify-between gap-3 text-stone-500">
                <span className="text-sm font-semibold tracking-tight text-stone-900">{site}</span>
                <span className="flex gap-2.5">
                  {links.map((link) => (
                    <span key={link} className={cn(link === current && "text-stone-900")}>
                      {link}
                    </span>
                  ))}
                </span>
              </div>
            )}
            {image && <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="mt-3 h-30 w-full rounded-lg bg-stone-200 object-cover" />}
            {meta && <p className="mt-3 text-stone-500">{meta}</p>}
            {title && <p className="mt-1 text-base leading-tight font-medium tracking-tight">{title}</p>}
            {byline && <p className="mt-1.5 text-stone-500">{byline}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
