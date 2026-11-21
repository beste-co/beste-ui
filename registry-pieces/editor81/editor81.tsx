"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor81Props {
  title?: string;
  /** The site address, after a lock */
  domain?: string;
  /** The waiting item: a thumbnail, a bold line and a sentence */
  item?: { image?: string; title: string; description?: string };
  /** Small pills naming what was filled in */
  tags?: string[];
  /** The ruled foot row, left and right */
  status?: string;
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor81Demo: Editor81Props = {
  title: "Publish",
  item: {
    image: "https://oud.pics/b/beste/oriel-serum.webp",
    title: "Waiting for you",
    description: "A new post in your draft.",
  },
  tags: ["Author", "Summary", "Tags", "Meta description"],
  framed: true,
};

export function Editor81({ title, domain, item, tags = [], status, note, framed = true, fill = false, className }: Editor81Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-78",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 rounded-2xl bg-card p-3.5 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-sm font-semibold">{title}</span>
            {domain && (
              <span className="inline-flex shrink-0 items-center gap-1.5 text-muted-foreground">
                <Lock aria-hidden="true" className="size-3" />
                {domain}
              </span>
            )}
          </div>
          {item && (
            <div className="flex items-center gap-2.5 rounded-xl p-2.5 ring-1 ring-border">
              {item.image && <img src={item.image} alt="" aria-hidden="true" className="size-11 shrink-0 rounded-lg bg-muted object-cover" />}
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-semibold">{item.title}</span>
                {item.description && <span className="leading-snug text-muted-foreground">{item.description}</span>}
              </span>
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <span key={index} className="rounded-full bg-muted px-2 py-0.5 text-foreground/75">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {(status || note) && (
            <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5 text-muted-foreground">
              <span className="truncate">{status}</span>
              {note && <span className="shrink-0">{note}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
