"use client";

import type { CSSProperties } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

interface Search33Result {
  title: string;
  url: string;
}

interface Search33Props {
  query?: string;
  searchLabel?: string;
  /** Results the site starts under, at most three */
  results?: Search33Result[];
  /** The site's own result, which rises to the top */
  result?: Search33Result & { tag?: string };
  crawlingLabel?: string;
  indexedLabel?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const search33Demo: Search33Props = {
  query: "skin studio lisbon",
  results: [
    { title: "Lisbon Facial Bar", url: "lisbonfacialbar.pt" },
    { title: "Clinica Chiado, skin care", url: "clinicachiado.pt" },
  ],
  result: { title: "Oriel Skin Studio, Lisbon", url: "orielstudio.pt › treatments" },
  framed: true,
};

// Each row is 2.875rem tall; the site's row starts under the others and climbs to the top
const STYLES = `
@keyframes search33-up { 0%, 18% { transform: translateY(var(--search33-from)); } 40%, 82% { transform: none; } 100% { transform: translateY(var(--search33-from)); } }
@keyframes search33-down { 0%, 18% { transform: none; } 40%, 82% { transform: translateY(2.875rem); } 100% { transform: none; } }
@keyframes search33-a { 0%, 14% { opacity: 1; } 20%, 90% { opacity: 0; } 96%, 100% { opacity: 1; } }
@keyframes search33-b { 0%, 22% { opacity: 0; } 28%, 82% { opacity: 1; } 88%, 100% { opacity: 0; } }
.search33-up { animation: search33-up 12s cubic-bezier(.45,0,.25,1) -5s infinite; }
.search33-down { animation: search33-down 12s cubic-bezier(.45,0,.25,1) -5s infinite; }
.search33-a { animation: search33-a 12s ease -5s infinite; }
.search33-b { opacity: 0; animation: search33-b 12s ease -5s infinite; }
@media (prefers-reduced-motion: reduce) {
  .search33-up, .search33-a, .search33-b { animation: none; }
  .search33-down { animation: none; transform: translateY(2.875rem); }
  .search33-a { opacity: 0; }
  .search33-b { opacity: 1; }
}
`;

export function Search33({ query, searchLabel, results = [], result, crawlingLabel, indexedLabel, framed = true, fill = false, className }: Search33Props) {
  const rivals = results.slice(0, 3);
  const rows = rivals.length + (result ? 1 : 0);

  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <style>{STYLES}</style>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-82",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col overflow-hidden rounded-2xl bg-card text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
            <Search aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
            <span className="truncate">{query}</span>
            {searchLabel && <span className="ml-auto shrink-0 text-muted-foreground">{searchLabel}</span>}
          </div>

          <div className="relative overflow-hidden" style={{ height: `${rows * 2.875}rem`, "--search33-from": `${rivals.length * 2.875}rem` } as CSSProperties}>
            {rivals.map((rival, index) => (
              <div
                key={index}
                className="search33-down absolute inset-x-0 flex h-11.5 flex-col justify-center gap-0.5 border-b border-border bg-card px-3.5"
                style={{ top: `${index * 2.875}rem` }}
              >
                <span className="truncate text-foreground/80">{rival.title}</span>
                <span className="truncate text-muted-foreground">{rival.url}</span>
              </div>
            ))}
            {result && (
              <div className="search33-up absolute inset-x-0 top-0 flex h-11.5 items-center gap-3 border-b border-border bg-muted px-3.5">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-medium">{result.title}</span>
                  <span className="truncate text-muted-foreground">{result.url}</span>
                </div>
                {result.tag && <span className="shrink-0 rounded-full bg-accent px-1.5 text-accent-foreground">{result.tag}</span>}
              </div>
            )}
          </div>

          {(crawlingLabel || indexedLabel) && (
          <div className="relative h-8.5 text-muted-foreground">
            {crawlingLabel && (
              <span className="search33-a absolute inset-0 flex items-center gap-1.5 px-3.5">
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                <span className="truncate">{crawlingLabel}</span>
              </span>
            )}
            {indexedLabel && (
              <span className="search33-b absolute inset-0 flex items-center px-3.5">
                <span className="truncate">{indexedLabel}</span>
              </span>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
