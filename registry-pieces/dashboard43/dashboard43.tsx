"use client";

import { cn } from "@/lib/utils";

type Lead = "avatar" | "time";

interface Dashboard43Row {
  /** Initials in a round chip, or a time in a narrow column */
  lead?: string;
  /** A round photo in place of the initials chip */
  image?: string;
  title: string;
  detail?: string;
}

interface Dashboard43Props {
  title?: string;
  meta?: string;
  rows?: Dashboard43Row[];
  /** How the lead of each row is drawn */
  lead?: Lead;
  /** A quiet ruled line at the foot */
  note?: string;
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Stretch to the slot it sits in instead of keeping a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard43Demo: Dashboard43Props = {
  title: "Our team",
  lead: "avatar",
  rows: [
    { image: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop", title: "Norah Jones", detail: "Dermal therapist" },
    { image: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=400&h=400&auto=format&fit=crop", title: "Laura Marling", detail: "Licensed aesthetician" },
    { image: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=400&h=400&auto=format&fit=crop", title: "Ben Howard", detail: "Laser specialist" },
  ],
  framed: true,
};

export function Dashboard43({ title, meta, rows = [], lead = "avatar", note, framed = true, fill = false, className }: Dashboard43Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-80",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-4 text-sm text-card-foreground", !framed && "shadow-lg")}>
          {(title || meta) && (
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{title}</span>
              {meta && <span className="truncate text-xs text-muted-foreground">{meta}</span>}
            </div>
          )}
          <div className="flex flex-col">
            {rows.map((row, index) => (
              <div key={index} className={cn("flex gap-3 border-b border-border py-2.5 last:border-b-0", lead === "avatar" && "items-center")}>
                {lead === "avatar" && row.image ? (
                  <img src={row.image} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                ) : row.lead &&
                  (lead === "avatar" ? (
                    <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-foreground/75">
                      {row.lead}
                    </span>
                  ) : (
                    <span className="w-10 shrink-0 text-muted-foreground tabular-nums">{row.lead}</span>
                  ))}
                <div className="min-w-0">
                  <div className="truncate font-medium">{row.title}</div>
                  {row.detail && <div className="truncate text-xs text-muted-foreground">{row.detail}</div>}
                </div>
              </div>
            ))}
          </div>
          {note && <p className="border-t border-border pt-2.5 text-xs text-muted-foreground">{note}</p>}
        </div>
      </div>
    </div>
  );
}
