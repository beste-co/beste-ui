"use client";

import { cn } from "@/lib/utils";

interface Editor102Props {
  /** The site the page lives on */
  domain?: string;
  path?: string;
  image?: string;
  title?: string;
  /** A quiet line under the title, e.g. what the project covered */
  subtitle?: string;
  /** Ruled rows, a quiet label over a short sentence */
  rows?: { label: string; value: string }[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor102Demo: Editor102Props = {
  domain: "maralind.com",
  path: "/work/oriel",
  image: "https://oud.pics/b/beste/oriel-studio.webp",
  title: "Oriel Skin Studio",
  rows: [
    { label: "The brief", value: "A calmer look for a Lisbon studio" },
    { label: "The result", value: "A new site at orielstudio.pt" },
  ],
  framed: true,
};

export function Editor102({ domain, path, image, title, subtitle, rows = [], framed = true, fill = false, className }: Editor102Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-75",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col overflow-hidden rounded-2xl bg-card text-sm text-card-foreground", !framed && "shadow-lg")}>
          {(domain || path) && (
            <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-3 text-xs">
              <span className="truncate font-semibold">{domain}</span>
              {path && <span className="shrink-0 text-muted-foreground">{path}</span>}
            </div>
          )}
          {image && <img src={image} alt="" aria-hidden="true" className="h-30 w-full bg-muted object-cover" />}
          {(title || subtitle) && (
            <div className="px-3.5 pt-3 pb-1">
              {title && <p className="text-base font-medium tracking-tight">{title}</p>}
              {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          {rows.length > 0 && (
            <div className="px-3.5 pt-1 pb-2">
              {rows.map((row, index) => (
                <div key={index} className="border-t border-border py-2.5">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="mt-0.5">{row.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
