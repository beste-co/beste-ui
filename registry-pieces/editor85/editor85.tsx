"use client";

import { cn } from "@/lib/utils";

interface Editor85Props {
  /** The masthead */
  title?: string;
  meta?: string;
  /** The lead story with a picture */
  lead?: { image?: { src: string; alt: string }; title: string; description?: string };
  /** Ruled headlines in the side column */
  headlines?: string[];
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const editor85Demo: Editor85Props = {
  title: "The Oriel Journal",
  lead: {
    image: { src: "https://oud.pics/b/beste/oriel-serum.webp", alt: "A bottle of serum on a stone shelf" },
    title: "What a serum can and cannot do",
  },
  headlines: ["Caring for skin in winter", "Before your first facial", "Brows, one month later"],
  framed: true,
};

export function Editor85({ title, meta, lead, headlines = [], framed = true, fill = false, className }: Editor85Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-95",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-2.5 rounded-2xl bg-card p-4 text-xs text-card-foreground", !framed && "shadow-lg", fill && "justify-center")}>
          {(title || meta) && (
            <div className="flex items-baseline justify-between gap-3 border-b border-muted-foreground/40 pb-2">
              <span className="truncate font-serif text-lg">{title}</span>
              {meta && <span className="shrink-0 text-muted-foreground">{meta}</span>}
            </div>
          )}
          <div className="grid grid-cols-5 gap-3">
            {lead && (
              <div className="col-span-3 flex flex-col gap-1.5 border-r border-border pr-3">
                {lead.image && <img src={lead.image.src} alt={lead.image.alt} loading="lazy" decoding="async" className="h-19 w-full rounded-sm object-cover" />}
                <p className="font-serif text-base leading-tight">{lead.title}</p>
                {lead.description && <p className="leading-snug text-muted-foreground">{lead.description}</p>}
              </div>
            )}
            {headlines.length > 0 && (
              <div className={cn("flex flex-col", lead ? "col-span-2" : "col-span-5")}>
                {headlines.map((headline, index) => (
                  <p key={index} className={cn("py-2 font-serif text-sm leading-tight first:pt-0 last:pb-0", index < headlines.length - 1 && "border-b border-border")}>
                    {headline}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
