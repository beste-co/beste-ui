"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Search34Result {
  /** The site name beside its round icon; without it only the address line shows */
  site?: string;
  /** The site's icon; without it a round initial */
  image?: string;
  initial?: string;
  url: string;
  title: string;
  description?: string;
}

interface Search34Props {
  query?: string;
  results?: Search34Result[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const search34Demo: Search34Props = {
  query: "oriel skin studio lisbon",
  results: [
    {
      site: "Oriel Skin Studio",
      image: "https://oud.pics/b/beste/oriel-facial.webp",
      url: "https://orielstudio.pt",
      title: "Oriel Skin Studio · Facials and skincare in Lisbon",
      description: "Book a facial or a skin consultation at our Lisbon studio.",
    },
    {
      url: "https://orielstudio.pt › treatments",
      title: "Treatments · Oriel Skin Studio",
    },
  ],
  framed: true,
};

export function Search34({ query, results = [], framed = true, fill = false, className }: Search34Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-100",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-4 rounded-2xl bg-card p-4.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {query && (
            <div className="flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-foreground/80 ring-1 ring-border">
              <Search aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{query}</span>
            </div>
          )}
          {results.map((result, index) => (
            <div key={index} className={cn("flex flex-col gap-1.5", index > 0 && "border-t border-border pt-3.5")}>
              {result.site ? (
                <div className="flex items-center gap-2.5">
                  {result.image ? (
                    <img src={result.image} alt="" className="size-6.5 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground/70">
                      {result.initial ?? result.site.charAt(0)}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col leading-snug">
                    <span className="truncate">{result.site}</span>
                    <span className="truncate text-muted-foreground">{result.url}</span>
                  </span>
                </div>
              ) : (
                <span className="truncate text-muted-foreground">{result.url}</span>
              )}
              <span className={cn("tracking-tight text-sky-800", index === 0 ? "text-base" : "text-sm")}>{result.title}</span>
              {result.description && <span className="leading-normal text-muted-foreground">{result.description}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
