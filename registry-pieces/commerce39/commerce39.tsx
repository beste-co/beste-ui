"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface Commerce39Props {
  name?: string;
  maker?: string;
  /** One photo per variant; the thumbnails swap the main photo */
  images?: string[];
  sizeLabel?: string;
  sizes?: string[];
  textureLabel?: string;
  textures?: string[];
  price?: string;
  channel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const commerce39Demo: Commerce39Props = {
  name: "Calming Serum",
  images: ["https://oud.pics/b/beste/oriel-serum.webp", "https://oud.pics/b/beste/oriel-ritual.webp"],
  sizes: ["30 ml", "50 ml"],
  price: "€38",
  framed: true,
};

function Chips({ items, picked, onPick, label }: { items: string[]; picked: number; onPick: (i: number) => void; label?: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap justify-end gap-1">
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={i === picked}
          onClick={() => onPick(i)}
          className={cn(
            "cursor-pointer rounded-full px-2.5 py-1 transition-colors",
            i === picked ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function Commerce39({
  name,
  maker,
  images = [],
  sizeLabel,
  sizes = [],
  textureLabel,
  textures = [],
  price,
  channel,
  framed = true,
  fill = false,
  className,
}: Commerce39Props) {
  const [image, setImage] = useState(0);
  const [size, setSize] = useState(0);
  const [texture, setTexture] = useState(0);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3 rounded-2xl bg-card p-3 text-xs text-card-foreground",
            !framed && "shadow-lg",
          )}
        >
          {images.length > 0 && (
            // Every variant photo is stacked and cross-fades, so picking one never reflows the card
            <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={i === image ? (name ?? "") : ""}
                  aria-hidden={i !== image}
                  className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500", i === image ? "opacity-100" : "opacity-0")}
                />
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-3 px-1">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{name}</div>
              {maker && <div className="mt-0.5 truncate text-muted-foreground">{maker}</div>}
            </div>
            {price && <span className="shrink-0 text-sm font-semibold">{price}</span>}
          </div>

          {(images.length > 1 || sizes.length > 0) && (
            <div className="flex items-center justify-between gap-3 px-1 pb-1">
              {images.length > 1 ? (
                <div className="flex gap-1.5">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-pressed={i === image}
                      aria-label={`Variant ${i + 1}`}
                      onClick={() => setImage(i)}
                      className={cn(
                        "cursor-pointer overflow-hidden rounded-lg ring-offset-2 ring-offset-card transition-shadow",
                        i === image ? "ring-2 ring-foreground/30" : "ring-1 ring-border",
                      )}
                    >
                      <img src={src} alt="" aria-hidden className="size-8 object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <span />
              )}
              {sizes.length > 0 && <Chips items={sizes} picked={size} onPick={setSize} label={sizeLabel} />}
            </div>
          )}

          {textures.length > 0 && (
            <div className="flex items-center justify-between gap-3 px-1 pb-1">
              <span className="text-muted-foreground">{textureLabel}</span>
              <Chips items={textures} picked={texture} onPick={setTexture} label={textureLabel} />
            </div>
          )}

          {channel && <div className="border-t border-border px-1 pt-2.5 pb-1 text-muted-foreground">{channel}</div>}
        </div>
      </div>
    </div>
  );
}
