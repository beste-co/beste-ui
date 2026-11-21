"use client";

import { cn } from "@/lib/utils";

type PillTone = "success" | "accent" | "neutral";

interface Commerce50Row {
  image?: string;
  title: string;
  /** A short figure on the right of the title, e.g. a price */
  value?: string;
  /** A quiet line under the title, e.g. a place or a path */
  detail?: string;
  /** A third, quieter line, e.g. features of the home */
  extra?: string;
  /** A small status pill */
  tag?: string;
  tone?: PillTone;
  /** A second status the pill turns into and back on a loop, e.g. Live to Sold */
  next?: { tag: string; tone?: PillTone };
}

interface Commerce50Props {
  title?: string;
  /** Quiet text beside the title, e.g. the agency or a count */
  meta?: string;
  rows?: Commerce50Row[];
  /** Thumbnail size: small for page lists, large for listings with three lines */
  size?: "sm" | "lg";
  /** A dot line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

const toneClasses: Record<PillTone, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  accent: "bg-accent text-accent-foreground",
  neutral: "bg-muted text-foreground/70",
};

const STYLES = `
@keyframes commerce50-a { 0%, 38% { opacity: 1 } 43%, 88% { opacity: 0 } 93%, 100% { opacity: 1 } }
@keyframes commerce50-b { 0%, 45% { opacity: 0 } 50%, 82% { opacity: 1 } 87%, 100% { opacity: 0 } }
.commerce50-a { animation: commerce50-a 11s ease infinite }
.commerce50-b { opacity: 0; animation: commerce50-b 11s ease infinite }
@media (prefers-reduced-motion: reduce) { .commerce50-a { animation: none; opacity: 0 } .commerce50-b { animation: none; opacity: 1 } }
`;

export const commerce50Demo: Commerce50Props = {
  title: "Available Properties",
  size: "lg",
  rows: [
    { image: "https://oud.pics/b/beste/oriel-consultation.webp", title: "Modern Downtown Loft", value: "$1,850,000", detail: "San Francisco", tag: "Open House", tone: "neutral" },
    { image: "https://oud.pics/b/beste/oriel-studio.webp", title: "Spacious Family Home", value: "$2,450,000", detail: "Palo Alto", tag: "Price Reduced", tone: "neutral" },
    { image: "https://oud.pics/b/beste/oriel-consultation.webp", title: "Waterfront Luxury Condo", value: "$3,200,000", detail: "Miami" },
  ],
  framed: true,
};

function Pill({ row }: { row: Commerce50Row }) {
  if (!row.tag) return null;
  const base = "rounded-full px-2 py-0.5 whitespace-nowrap";
  if (!row.next) return <span className={cn("shrink-0", base, toneClasses[row.tone ?? "neutral"])}>{row.tag}</span>;
  return (
    <span className="relative inline-grid shrink-0 justify-items-end">
      <span className={cn("commerce50-a col-start-1 row-start-1", base, toneClasses[row.tone ?? "neutral"])}>{row.tag}</span>
      <span className={cn("commerce50-b col-start-1 row-start-1", base, toneClasses[row.next.tone ?? "neutral"])}>{row.next.tag}</span>
    </span>
  );
}

export function Commerce50({ title, meta, rows = [], size = "sm", note, framed = true, fill = false, className }: Commerce50Props) {
  const large = size === "lg";
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      {rows.some((row) => row.next) && <style>{STYLES}</style>}
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold">{title}</span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}
          {rows.length > 0 && (
            <div className="flex flex-col border-t border-border">
              {rows.map((row, index) => (
                <div key={index} className={cn("flex gap-2.5 border-b border-border", large ? "py-2.5" : "items-center py-2")}>
                  {row.image && <img src={row.image} alt="" aria-hidden="true" className={cn("shrink-0 bg-muted object-cover", large ? "size-14 rounded-lg" : "size-8 rounded-md")} />}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex justify-between gap-2">
                      <span className={cn("truncate", large && "font-semibold")}>{row.title}</span>
                      {row.value && <span className="shrink-0">{row.value}</span>}
                    </div>
                    {(row.detail || (row.value && row.tag)) && (
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-muted-foreground">{row.detail}</span>
                        {row.value && <Pill row={row} />}
                      </div>
                    )}
                    {row.extra && <span className="truncate text-muted-foreground/80">{row.extra}</span>}
                  </div>
                  {!row.value && <Pill row={row} />}
                </div>
              ))}
            </div>
          )}
          {note && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
