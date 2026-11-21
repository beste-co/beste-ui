"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Pill = "accent" | "neutral" | "plain";

interface Dashboard49Row {
  label: string;
  /** A round photo before the label */
  image?: string;
  /** Initials in a round chip when there is no image; without either the row gets a small square thumb */
  initials?: string;
  /** The site's image in the small square thumb */
  thumb?: string;
  /** A small icon in place of the chip or thumb */
  icon?: LucideIcon;
  value?: string;
  /** The soft orange pill, a stone pill, or plain text */
  pill?: Pill;
}

interface Dashboard49List {
  title: string;
  meta?: string;
  rows: Dashboard49Row[];
  /** A centered ticked message in place of the rows, e.g. nothing left to do */
  empty?: { title: string; description?: string };
}

interface Dashboard49Props {
  organization?: { name: string; image?: string; initial?: string; tag?: string; detail?: string };
  meta?: string;
  /** One or two ruled lists side by side, e.g. projects and members */
  lists?: Dashboard49List[];
  /** A muted row at the foot */
  footer?: { label: string; value?: string };
  /** Frosted rim around the card, for sitting on a photo or gradient */
  framed?: boolean;
  /** Take the slot's full width instead of a card-sized box */
  fill?: boolean;
  className?: string;
}

export const dashboard49Demo: Dashboard49Props = {
  organization: { name: "Halden Studio", image: "https://oud.pics/b/gradients/gradient-silk-orange.webp", tag: "Business" },
  lists: [
    {
      title: "Projects",
      rows: [
        { label: "aurora-clinic.com", thumb: "https://oud.pics/b/beste/oriel-studio.webp", value: "Pro", pill: "accent" },
        { label: "monteverdi-studio.com", thumb: "https://oud.pics/b/beste/project-mira.webp", value: "Pro", pill: "accent" },
        { label: "harborfront.co", thumb: "https://oud.pics/b/beste/project-ardena.webp", value: "Pro", pill: "accent" },
      ],
    },
    {
      title: "Members",
      rows: [
        { label: "Norah Jones", image: "https://images.unsplash.com/photo-1578412004177-21321e29f735?q=80&w=400&h=400&auto=format&fit=crop", value: "Owner", pill: "plain" },
        { label: "Jacob Collier", image: "https://images.unsplash.com/photo-1656337789708-cdf37b07112d?q=80&w=400&h=400&auto=format&fit=crop", value: "Admin", pill: "plain" },
        { label: "Nick Drake", image: "https://images.unsplash.com/photo-1618673747378-7e0d3561371a?q=80&w=400&h=400&auto=format&fit=crop", value: "Client guest", pill: "neutral" },
      ],
    },
  ],
  footer: { label: "AI credits shared across projects", value: "30,000 a month" },
  framed: true,
};

const pillStyles: Record<Pill, string> = {
  accent: "rounded-full bg-accent px-2 py-0.5 text-accent-foreground",
  neutral: "rounded-full bg-muted px-2 py-0.5 text-foreground/75",
  plain: "text-foreground/75",
};

export function Dashboard49({ organization, meta, lists = [], footer, framed = true, fill = false, className }: Dashboard49Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center", !fill && "p-4", className)}>
      <div
        className={cn(
          "w-full",
          !fill && "max-w-190",
          framed && "rounded-[1.375rem] border border-card/70 bg-card/35 p-1.5 shadow-xl shadow-foreground/5 backdrop-blur-md"
        )}
      >
        <div className={cn("flex flex-col overflow-hidden rounded-2xl bg-card text-xs text-card-foreground", !framed && "shadow-lg")}>
          {(organization || meta) && (
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border px-4.5 py-3.5">
              {organization && (
                <span className="flex min-w-0 items-center gap-2.5">
                  {organization.image ? (
                    <img src={organization.image} alt="" className="size-7 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-xs font-semibold text-white">{organization.initial ?? organization.name.charAt(0)}</span>
                  )}
                  <span className="truncate text-sm font-semibold">{organization.name}</span>
                  {organization.detail && <span className="truncate text-muted-foreground">{organization.detail}</span>}
                  {organization.tag && <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-foreground/75">{organization.tag}</span>}
                </span>
              )}
              {meta && <span className="text-muted-foreground">{meta}</span>}
            </div>
          )}
          {lists.length > 0 && (
            <div className="flex flex-col sm:flex-row">
              {lists.map((list, listIndex) => (
                <div key={listIndex} className={cn("flex min-w-0 flex-1 flex-col px-4.5 pt-3.5 pb-4", listIndex > 0 && "border-t border-border sm:border-t-0 sm:border-l")}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{list.title}</span>
                    {list.meta && <span className="shrink-0 text-muted-foreground">{list.meta}</span>}
                  </div>
                  {list.empty && list.rows.length === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2.5 border-t border-border px-2 py-5.5 text-center">
                      <span className="flex size-9 items-center justify-center rounded-full bg-muted">
                        <Check aria-hidden="true" className="size-4" />
                      </span>
                      <span className="text-sm font-semibold">{list.empty.title}</span>
                      {list.empty.description && <span className="max-w-52 leading-normal text-muted-foreground">{list.empty.description}</span>}
                    </div>
                  )}
                  <div className="flex flex-col divide-y divide-border">
                    {list.rows.map((row, index) => (
                      <div key={index} className={cn("flex items-center justify-between gap-3", (row.image || row.initials) && !row.icon ? "py-2" : "py-2.5")}>
                        <span className="flex min-w-0 items-center gap-2.5">
                          {row.icon ? (
                            <row.icon aria-hidden="true" className="size-3 shrink-0" />
                          ) : row.image ? (
                            <img src={row.image} alt="" className="size-6 shrink-0 rounded-full object-cover" />
                          ) : row.initials ? (
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground/70">{row.initials}</span>
                          ) : row.thumb ? (
                            <img src={row.thumb} alt="" className="size-5.5 shrink-0 rounded-md object-cover" />
                          ) : (
                            <span aria-hidden="true" className="size-5.5 shrink-0 rounded-md bg-muted ring-1 ring-border" />
                          )}
                          <span className="truncate">{row.label}</span>
                        </span>
                        {row.value && <span className={cn("shrink-0", pillStyles[row.pill ?? "plain"])}>{row.value}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {footer && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-background px-4.5 py-3 text-muted-foreground">
              <span>{footer.label}</span>
              {footer.value && <span>{footer.value}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
