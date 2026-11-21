"use client";

import { cn } from "@/lib/utils";

interface Search30Row {
  label?: string;
  value?: string;
}

interface Search30Props {
  url?: string;
  /** The site's icon beside the address, a small square image */
  favicon?: string;
  title?: string;
  description?: string;
  rows?: Search30Row[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const search30Demo: Search30Props = {
  url: "orielstudio.pt › treatments",
  favicon: "https://oud.pics/b/beste/oriel-studio.webp",
  title: "Facials in Lisbon | Oriel Skin Studio",
  description: "Facials, brows and skin consultations in Príncipe Real, Lisbon.",
  framed: true,
};

export function Search30({ url, favicon, title, description, rows = [], framed = true, fill = false, className }: Search30Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            "flex flex-col rounded-2xl bg-card p-3.5 text-xs text-card-foreground",
            !framed && "shadow-lg",
          )}
        >
          <div className={cn("flex flex-col gap-1", rows.length > 0 && "pb-3")}>
            <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
              {favicon ? (
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-card ring-1 ring-border">
                  <img src={favicon} alt="" loading="lazy" decoding="async" className="size-3.5 rounded-full object-cover" />
                </span>
              ) : (
                <span aria-hidden className="size-5 shrink-0 rounded-full bg-muted ring-1 ring-border" />
              )}
              <span className="truncate">{url}</span>
            </div>
            <div className="text-sm font-medium text-sky-800">{title}</div>
            {description && <div className="leading-normal text-muted-foreground">{description}</div>}
          </div>
          {rows.map((row, i) => (
            <div key={i} className="flex justify-between gap-2 border-t border-border pt-2 not-last:pb-2">
              <span className="truncate">{row.label}</span>
              <span className="shrink-0 text-muted-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
