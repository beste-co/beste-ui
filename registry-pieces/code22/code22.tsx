"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface Code22File {
  /** Tab label */
  name?: string;
  /** Shown after the domain in the address bar */
  path?: string;
  /** File contents, whitespace kept as written */
  body?: string;
}

interface Code22Props {
  domain?: string;
  files?: Code22File[];
  /** Tab open on first render */
  defaultIndex?: number;
  /** A quiet line with a dot under the file */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const code22Demo: Code22Props = {
  domain: "orielstudio.pt",
  defaultIndex: 0,
  files: [
    {
      name: "llms.txt",
      path: "llms.txt",
      body: "# Oriel Skin Studio\n> Facials, brows and skin consultations\n> in Príncipe Real, Lisbon.\n\n## Pages\n- [Treatments](https://orielstudio.pt/treatments)\n- [Shop](https://orielstudio.pt/shop)\n- [Book](https://orielstudio.pt/book)",
    },
    {
      name: "Product schema",
      path: "shop/barrier-serum",
      body: '{\n  "@type": "Product",\n  "name": "Barrier serum",\n  "category": "Skin care",\n  "offers": {\n    "price": "48",\n    "priceCurrency": "EUR"\n  }\n}',
    },
    {
      name: "sitemap.xml",
      path: "sitemap.xml",
      body: '<url>\n  <loc>https://orielstudio.pt/treatments</loc>\n  <xhtml:link hreflang="es"\n    href="https://orielstudio.pt/es/tratamientos"/>\n</url>',
    },
  ],
  framed: true,
};

export function Code22({ domain, files = [], defaultIndex = 0, note, framed = true, fill = false, className }: Code22Props) {
  const [picked, setPicked] = useState(defaultIndex);
  const index = Math.min(Math.max(picked, 0), Math.max(files.length - 1, 0));
  const file = files[index];
  // One file needs no tabs: the bar turns into a plain browser chrome
  const single = files.length === 1;

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-2xl bg-card text-card-foreground",
            // A single file keeps its natural height; tabs need the fixed one so switching never jumps
            !single && "h-82",
            !framed && "shadow-lg"
          )}
        >
          {single ? (
            <div className="flex h-11 items-center gap-1.5 border-b border-border px-3 text-xs text-muted-foreground">
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-border" />
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-border" />
              <span className="ml-1.5 min-w-0 truncate">
                {domain && `${domain}/`}{file?.path}
              </span>
            </div>
          ) : (
            <div className="flex items-center border-b border-border px-3 py-2.5">
              <span className="flex h-6 min-w-0 flex-1 items-center truncate rounded-md bg-secondary px-2.5 text-xs text-muted-foreground">
                {domain && `${domain}/`}{file?.path}
              </span>
            </div>
          )}

          {!single && <div role="tablist" className="flex gap-1 overflow-hidden px-2.5 pt-2">
            {files.map((item, itemIndex) => (
              <button
                key={itemIndex}
                type="button"
                role="tab"
                aria-selected={itemIndex === index}
                onClick={() => setPicked(itemIndex)}
                className={cn(
                  "h-7.5 shrink-0 cursor-pointer rounded-lg px-3 text-xs transition-colors",
                  itemIndex === index ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>}

          <div
            role={single ? undefined : "tabpanel"}
            className="mx-2.5 mt-2.5 mb-2.5 flex-1 overflow-hidden rounded-xl bg-secondary px-4 py-3.5 text-xs leading-relaxed whitespace-pre text-foreground/75 ring-1 ring-border ring-inset"
          >
            {file?.body}
          </div>

          {note && (
            <div className="flex items-center gap-1.5 border-t border-border px-3.5 py-2.5 text-xs text-muted-foreground">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
