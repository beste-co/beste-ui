"use client";

import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "accent";

interface Dashboard41Item {
  image?: string;
  name?: string;
  detail?: string;
  status?: string;
  tone?: StatusTone;
}

interface Dashboard41Props {
  /** A header row with the studio's initial and name */
  studio?: { name: string; image?: string; initial?: string };
  /** A stone pill on the right of the header, e.g. the plan */
  tag?: string;
  items?: Dashboard41Item[];
  /** A dot line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard41Demo: Dashboard41Props = {
  items: [
    {
      image: "https://oud.pics/b/beste/oriel-studio.webp",
      name: "Oriel Skin Studio",
      status: "Published",
      tone: "neutral",
    },
    {
      image: "https://oud.pics/b/beste/project-mira.webp",
      name: "Mira Dental",
      status: "Handed over",
      tone: "accent",
    },
    {
      image: "https://oud.pics/b/beste/project-ardena.webp",
      name: "Ardena",
      status: "White label",
      tone: "neutral",
    },
  ],
  framed: true,
};

const statusClasses: Record<StatusTone, string> = {
  neutral: "bg-secondary text-foreground/80",
  accent: "bg-accent text-accent-foreground",
};

export function Dashboard41({ studio, tag, items = [], note, framed = true, fill = false, className }: Dashboard41Props) {
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
            "flex flex-col justify-center rounded-2xl bg-card px-4 py-2 text-card-foreground",
            !framed && "shadow-lg"
          )}
        >
          {(studio || tag) && (
            <div className="flex items-center justify-between gap-3 border-b border-border px-1 pt-2 pb-3">
              <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                {studio?.image ? (
                  <img src={studio.image} alt="" className="size-5.5 shrink-0 rounded-md object-cover" />
                ) : studio?.initial && (
                  <span aria-hidden="true" className="flex size-5.5 shrink-0 items-center justify-center rounded-md bg-emerald-900 text-xs text-emerald-50">
                    {studio.initial}
                  </span>
                )}
                <span className="truncate">{studio?.name}</span>
              </span>
              {tag && <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground/80">{tag}</span>}
            </div>
          )}
          {items.map((item, index) => (
            <div key={index} className={cn("flex items-center gap-3.5 border-b border-border px-1 py-3.5", !note && "last:border-b-0")}>
              {item.image && <img src={item.image} alt="" aria-hidden="true" className="size-11 shrink-0 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1">
                {item.name && <div className="truncate text-sm font-medium">{item.name}</div>}
                {item.detail && <div className="mt-0.5 truncate text-xs text-muted-foreground">{item.detail}</div>}
              </div>
              {item.status && (
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs", statusClasses[item.tone ?? "neutral"])}>
                  {item.status}
                </span>
              )}
            </div>
          ))}
          {note && (
            <div className="flex items-center gap-1.5 px-1 pt-3 pb-2 text-xs text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span className="truncate">{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
