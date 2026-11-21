"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser44Row {
  /** A round photo before the label */
  image?: string;
  /** Initials in a round chip when there is no image */
  initials?: string;
  label: string;
  detail?: string;
  value?: string;
  /** A quiet figure after the value, e.g. "of $2,000" */
  total?: string;
}

interface Browser44Props {
  url?: string;
  /** A green word on the right of the address bar */
  status?: string;
  brand?: { name: string; image?: string; initial?: string };
  links?: string[];
  eyebrow?: string;
  heading?: string;
  description?: string;
  /** A dot line under a rule, e.g. the waitlist state */
  note?: string;
  /** A soft panel beside the copy, with ruled rows */
  panel?: { title?: string; meta?: string; rows: Browser44Row[] };
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  className?: string;
}

export const browser44Demo: Browser44Props = {
  url: "tallyroom.app",
  status: "Published",
  brand: { name: "Tallyroom", image: "https://oud.pics/b/gradients/gradient-silk-sage.webp" },
  links: ["Product", "Pricing", "Docs", "Blog"],
  eyebrow: "For teams of 3 to 30",
  heading: "Shared budgets for small teams",
  description: "Plan spend together, see who spent what and close the month without a spreadsheet.",
  panel: {
    title: "October budgets",
    rows: [
      { image: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop", label: "Software", value: "$1,840", total: "of $2,000" },
      { image: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=400&h=400&auto=format&fit=crop", label: "Team offsite", value: "$3,200", total: "of $4,500" },
      { image: "https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?q=80&w=400&h=400&auto=format&fit=crop", label: "Hiring", value: "$650", total: "of $1,000" },
    ],
  },
  framed: true,
};

export function Browser44({ url, status, brand, links = [], eyebrow, heading, description, note, panel, framed = true, className }: Browser44Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "w-full max-w-230",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("overflow-hidden rounded-2xl bg-card text-sm text-card-foreground", !framed && "shadow-lg")}>
          <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
            <span aria-hidden="true" className="flex shrink-0 gap-1.5">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
            </span>
            <span className="flex min-w-0 flex-1 justify-center">
              {url && (
                <span className="flex min-w-0 items-center gap-1.5 rounded-full bg-muted px-3.5 py-1 text-xs text-foreground/75">
                  <Lock aria-hidden="true" className="size-3 shrink-0" />
                  <span className="truncate">{url}</span>
                </span>
              )}
            </span>
            {status && <span className="shrink-0 text-xs text-emerald-700 dark:text-emerald-400">{status}</span>}
          </div>

          {(brand || links.length > 0) && (
            <div className="flex items-center gap-6 px-5 py-4 md:px-8">
              {brand && (
                <span className="flex items-center gap-2 font-semibold">
                  {brand.image ? (
                    <img src={brand.image} alt="" className="size-5.5 shrink-0 rounded-md object-cover" />
                  ) : brand.initial && (
                    <span aria-hidden="true" className="flex size-5.5 shrink-0 items-center justify-center rounded-md bg-emerald-900 text-xs text-emerald-50">
                      {brand.initial}
                    </span>
                  )}
                  {brand.name}
                </span>
              )}
              <span className="ml-auto hidden gap-5 text-xs text-muted-foreground sm:flex">
                {links.map((link) => (
                  <span key={link}>{link}</span>
                ))}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-8 px-5 pt-5 pb-8 md:flex-row md:items-center md:gap-9 md:px-8 md:pb-10">
            <div className="min-w-0 flex-1">
              {eyebrow && <p className="text-xs text-muted-foreground">{eyebrow}</p>}
              {heading && <p className="mt-2.5 text-3xl leading-tight font-medium tracking-tight">{heading}</p>}
              {description && <p className="mt-3.5 max-w-85 leading-relaxed text-muted-foreground">{description}</p>}
              {note && (
                <div className="mt-5.5 flex items-center gap-2 border-t border-border pt-3.5 text-xs text-muted-foreground">
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                  <span className="truncate">{note}</span>
                </div>
              )}
            </div>

            {panel && (
              <div className="min-w-0 flex-1 rounded-xl bg-muted p-4.5">
                {(panel.title || panel.meta) && (
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{panel.title}</span>
                    {panel.meta && <span className="text-xs text-muted-foreground">{panel.meta}</span>}
                  </div>
                )}
                {panel.rows.map((row, index) => (
                  <div key={index} className="flex items-center gap-3 border-b border-border py-2.5 last:border-b-0">
                    {row.image ? (
                      <img src={row.image} alt="" className="size-7 shrink-0 rounded-full object-cover" />
                    ) : row.initials && (
                      <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-card text-xs text-foreground/75">
                        {row.initials}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{row.label}</span>
                      {row.detail && <span className="block truncate text-xs text-muted-foreground">{row.detail}</span>}
                    </span>
                    {row.value && (
                      <span className="shrink-0 tabular-nums">
                        {row.value}
                        {row.total && <span className="text-muted-foreground"> {row.total}</span>}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
