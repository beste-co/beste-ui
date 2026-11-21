"use client";

import { cn } from "@/lib/utils";

interface Search37Props {
  /** Quiet header line on the left, e.g. where the link was shared */
  label?: string;
  domain?: string;
  /** The generated share image */
  image?: string;
  url?: string;
  title?: string;
  description?: string;
  /** A quiet dot line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const search37Demo: Search37Props = {
  image: "https://oud.pics/b/beste/oriel-facial.webp",
  url: "orielstudio.pt",
  title: "Signature facial · Oriel Skin Studio",
  description: "A 60 minute facial in our Lisbon studio.",
  framed: true,
};

export function Search37({ label, domain, image, url, title, description, note, framed = true, fill = false, className }: Search37Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-78",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(label || domain) && (
            <div className="flex items-center justify-between gap-3 px-0.5 text-muted-foreground">
              <span className="truncate">{label}</span>
              {domain && <span className="shrink-0">{domain}</span>}
            </div>
          )}
          <div className="overflow-hidden rounded-xl ring-1 ring-border">
            {image && <img src={image} alt="" aria-hidden="true" className="h-33 w-full bg-muted object-cover" />}
            <div className="flex flex-col gap-1 px-3 pt-2.5 pb-3">
              {url && <span className="truncate text-muted-foreground">{url}</span>}
              {title && <span className="text-sm font-medium">{title}</span>}
              {description && <span className="leading-normal text-muted-foreground">{description}</span>}
            </div>
          </div>
          {note && (
            <div className="flex items-center gap-1.5 px-0.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
