"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type LayoutKind = "split" | "centered" | "full";

interface Editor63Layout {
  label: string;
  kind: LayoutKind;
}

interface Editor63Props {
  heading?: string;
  description?: string;
  image?: string;
  caption?: string;
  note?: string;
  layouts?: Editor63Layout[];
  intervalMs?: number;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor63Demo: Editor63Props = {
  heading: "Skin care that takes its time",
  description: "Facials and consultations in Lisbon.",
  image: "https://oud.pics/b/beste/oriel-studio.webp",
  layouts: [
    { label: "Split", kind: "split" },
    { label: "Centered", kind: "centered" },
    { label: "Full width", kind: "full" },
  ],
  intervalMs: 3200,
};

function HeroLayer({ kind, heading, description, image }: { kind: LayoutKind; heading?: string; description?: string; image?: string }) {
  if (kind === "full") {
    return (
      <div className="relative size-full overflow-hidden">
        {image && <img src={image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />}
        <span className="absolute inset-0 bg-stone-900/30" aria-hidden="true" />
        <div className="relative flex size-full flex-col items-center justify-center gap-1.5 px-6 text-center">
          <span className="text-lg font-medium leading-tight text-white">{heading}</span>
          <span className="text-xs text-white/80">{description}</span>
        </div>
      </div>
    );
  }

  if (kind === "centered") {
    return (
      <div className="flex size-full flex-col items-center gap-3 px-5 pt-5 text-center">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-medium leading-tight text-stone-800">{heading}</span>
          <span className="text-xs text-stone-500">{description}</span>
        </div>
        {image && <img src={image} alt="" aria-hidden="true" className="min-h-0 w-full flex-1 rounded-t-md object-cover" />}
      </div>
    );
  }

  return (
    <div className="flex size-full items-center gap-3.5 px-5">
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-lg font-medium leading-tight text-stone-800">{heading}</span>
        <span className="text-xs text-stone-500">{description}</span>
      </div>
      {image && <img src={image} alt="" aria-hidden="true" className="h-20 w-28 shrink-0 rounded-md object-cover" />}
    </div>
  );
}

function Thumb({ kind }: { kind: LayoutKind }) {
  if (kind === "full") {
    return (
      <span className="relative block h-12.5 rounded-sm bg-stone-300" aria-hidden="true">
        <span className="absolute bottom-1.5 left-1.5 h-1 w-1/2 rounded-full bg-white" />
      </span>
    );
  }
  if (kind === "centered") {
    return (
      <span className="flex flex-col items-center gap-1.5" aria-hidden="true">
        <span className="h-1 w-3/4 rounded-full bg-stone-300" />
        <span className="h-1 w-1/2 rounded-full bg-stone-200" />
        <span className="h-7.5 w-full rounded-sm bg-stone-200" />
      </span>
    );
  }
  return (
    <span className="flex flex-col gap-1.5" aria-hidden="true">
      <span className="h-7.5 rounded-sm bg-stone-200" />
      <span className="h-1 w-4/5 rounded-full bg-stone-300" />
      <span className="h-1 w-1/2 rounded-full bg-stone-200" />
    </span>
  );
}

export function Editor63({
  heading,
  description,
  image,
  caption,
  note,
  layouts = [],
  intervalMs = 3200,
  fill = false,
  className,
}: Editor63Props) {
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduced);
    if (reduced) setActive(Math.max(0, layouts.findIndex((layout) => layout.kind === "split")));
  }, []);

  useEffect(() => {
    if (still || layouts.length < 2) return;
    const id = setTimeout(() => setActive((value) => (value + 1) % layouts.length), intervalMs);
    return () => clearTimeout(id);
  }, [active, still, layouts.length, intervalMs]);

  const current = active;

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div className={cn("flex w-full flex-col gap-2.5", !fill && "max-w-100")}>
        <div className="relative h-36 overflow-hidden rounded-2xl bg-stone-50 shadow-lg">
          {layouts.map((layout, index) => (
            <div
              key={layout.label}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none",
                index === current ? "opacity-100" : "opacity-0"
              )}
              aria-hidden={index !== current}
            >
              <HeroLayer kind={layout.kind} heading={heading} description={description} image={image} />
            </div>
          ))}
        </div>

        {(caption || note) && (
        <div className="flex items-center justify-between gap-3 px-1 pt-1 text-xs">
          <span className="flex items-center gap-1.5 truncate">
            <ArrowRightLeft className="size-3 shrink-0" aria-hidden="true" />
            {caption}
          </span>
          {note && <span className="shrink-0 text-muted-foreground">{note}</span>}
        </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {layouts.map((layout, index) => (
            <button
              key={layout.label}
              type="button"
              aria-pressed={index === current}
              onClick={() => setActive(index)}
              className={cn(
                "flex cursor-pointer flex-col gap-1.5 rounded-lg bg-card p-2.5 text-left ring-1 transition-shadow duration-300 motion-reduce:transition-none",
                index === current ? "ring-muted-foreground/50" : "ring-border"
              )}
            >
              <Thumb kind={layout.kind} />
              <span className={cn("truncate text-xs", index === current ? "text-foreground" : "text-muted-foreground")}>
                {layout.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
